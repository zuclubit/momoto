/// Momoto Swift/iOS Example
///
/// This file demonstrates how to integrate momoto-wasm into a Swift/iOS project.
///
/// Integration strategies:
/// 1. **WKWebView + JavaScript bridge** (recommended for WASM on iOS)
///    - Load momoto-wasm in a WKWebView
///    - Call JS functions via evaluateJavaScript
///    - Use WKScriptMessageHandler to receive results
///
/// 2. **UniFFI (native Rust bindings)** — upcoming
///    - Uses `uniffi-bindgen-swift` to generate Swift bindings from Rust
///    - Requires: `cargo install uniffi-bindgen-swift`
///    - Generates: MomotoCore.swift + libmomoto_core.a (xcframework)
///
/// This example uses Strategy 1 (WKWebView bridge).

import Foundation
import WebKit
import UIKit

// MARK: — MomotoEngine

/// Singleton engine that communicates with momoto-wasm via WKWebView.
@MainActor
public class MomotoEngine: NSObject {
    private static var _shared: MomotoEngine?
    public static var shared: MomotoEngine {
        if _shared == nil { _shared = MomotoEngine() }
        return _shared!
    }

    private var webView: WKWebView
    private var pendingCallbacks: [String: (Result<Any, Error>) -> Void] = [:]
    private var isReady = false
    private var readyCallbacks: [() -> Void] = []
    private var callId = 0

    private override init() {
        let config = WKWebViewConfiguration()
        config.preferences.javaScriptEnabled = true
        webView = WKWebView(frame: .zero, configuration: config)
        super.init()
        webView.navigationDelegate = self
        webView.configuration.userContentController.add(self, name: "momotoCallback")
        loadEngine()
    }

    private func loadEngine() {
        let html = """
        <!DOCTYPE html><html><head>
        <script type="module">
          import init, * as wasm from 'https://esm.sh/momoto-wasm@7.0.0';
          await init();
          window.wasm = wasm;

          window.momotoCall = async (id, fn, args) => {
            try {
              const result = await wasm[fn](...args);
              const value = result?.toHex?.() ?? result?.toString?.() ?? result;
              window.webkit.messageHandlers.momotoCallback.postMessage({ id, ok: true, value });
            } catch (e) {
              window.webkit.messageHandlers.momotoCallback.postMessage({ id, ok: false, error: e.message });
            }
          };
          window.webkit.messageHandlers.momotoCallback.postMessage({ id: '__ready__', ok: true, value: null });
        </script></head><body></body></html>
        """
        webView.loadHTMLString(html, baseURL: URL(string: "https://momoto-engine"))
    }

    private func waitForReady() async {
        if isReady { return }
        await withCheckedContinuation { cont in
            readyCallbacks.append { cont.resume() }
        }
    }

    // MARK: — Public API

    /// WCAG 2.1 contrast ratio between two hex colors
    public func wcagContrastRatio(fg: String, bg: String) async throws -> Double {
        try await waitForReady()
        return try await callJS("wcagContrastRatio", args: [hexColorArg(fg), hexColorArg(bg)])
    }

    /// APCA contrast (absolute value = Lc)
    public func apcaContrast(fg: String, bg: String) async throws -> Double {
        let raw: Double = try await callJS("apcaContrast", args: [hexColorArg(fg), hexColorArg(bg)])
        return abs(raw)
    }

    /// Best accessible foreground for a background color
    public func recommendForeground(bg: String) async throws -> String {
        try await waitForReady()
        return try await callJS("agentRecommendForeground", args: [hexColorArg(bg)])
    }

    /// Simulate CVD. type: "protanopia" | "deuteranopia" | "tritanopia"
    public func simulateCVD(hex: String, type: CVDType) async throws -> String {
        try await waitForReady()
        return try await callJS("simulateCVD", args: ["\"\(hex)\"", "\"\(type.rawValue)\""])
    }

    /// Generate HCT tonal palette. Returns Array of (tailwindScale, hex) pairs.
    public func hctTonalPalette(hex: String) async throws -> [(scale: Int, hex: String)] {
        try await waitForReady()
        let raw: [Double] = try await callJS("hexToHct", args: ["\"\(hex)\""])
        let h = raw[0], c = raw[1]

        let tones  = [10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99]
        let twMap  = [10:950, 20:900, 30:800, 40:700, 50:600, 60:500, 70:400, 80:300, 90:200, 95:100, 99:50]

        var result: [(scale: Int, hex: String)] = []
        for (i, tone) in tones.enumerated() {
            let toneHex: String = try await callJS("hctToHex", args: ["\(h)", "\(c)", "\(tone)"])
            result.append((scale: twMap[tone]!, hex: toneHex))
        }
        return result
    }

    // MARK: — Private

    private func hexColorArg(_ hex: String) -> String {
        "wasm.Color.fromHex('\(hex)')"
    }

    private func waitForReady() async {
        if isReady { return }
        await withCheckedContinuation { (cont: CheckedContinuation<Void, Never>) in
            readyCallbacks.append { cont.resume() }
        }
    }

    private func callJS<T>(_ fn: String, args: [String]) async throws -> T {
        await waitForReady()

        callId += 1
        let id = "\(callId)"

        return try await withCheckedThrowingContinuation { cont in
            pendingCallbacks[id] = { result in
                switch result {
                case .success(let value):
                    if let v = value as? T {
                        cont.resume(returning: v)
                    } else {
                        cont.resume(throwing: MomotoError.typeMismatch)
                    }
                case .failure(let e):
                    cont.resume(throwing: e)
                }
            }
            let js = "momotoCall('\(id)', '\(fn)', [\(args.joined(separator: ","))])"
            webView.evaluateJavaScript(js, completionHandler: nil)
        }
    }
}

// MARK: — WKNavigationDelegate

extension MomotoEngine: WKNavigationDelegate {
    public func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        // WebView loaded — wait for WASM ready signal via callback
    }
}

// MARK: — WKScriptMessageHandler

extension MomotoEngine: WKScriptMessageHandler {
    public func userContentController(_ controller: WKUserContentController, didReceive message: WKScriptMessage) {
        guard let body = message.body as? [String: Any],
              let id   = body["id"] as? String,
              let ok   = body["ok"] as? Bool else { return }

        if id == "__ready__" {
            isReady = true
            readyCallbacks.forEach { $0() }
            readyCallbacks = []
            return
        }

        if let cb = pendingCallbacks.removeValue(forKey: id) {
            if ok {
                cb(.success(body["value"] ?? NSNull()))
            } else {
                let msg = body["error"] as? String ?? "Unknown error"
                cb(.failure(MomotoError.jsError(msg)))
            }
        }
    }
}

// MARK: — Supporting types

public enum CVDType: String {
    case protanopia, deuteranopia, tritanopia
}

public enum MomotoError: Error, LocalizedError {
    case typeMismatch
    case jsError(String)
    case engineNotReady

    public var errorDescription: String? {
        switch self {
        case .typeMismatch:         return "Return type mismatch from WASM"
        case .jsError(let msg):     return "WASM JS error: \(msg)"
        case .engineNotReady:       return "Momoto engine not yet initialized"
        }
    }
}
