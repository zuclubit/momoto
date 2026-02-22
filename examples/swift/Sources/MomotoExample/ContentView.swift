/// Momoto iOS SwiftUI Example — Color Contrast Checker
///
/// Demonstrates:
/// - WCAG + APCA contrast validation
/// - CVD simulation
/// - Accessible foreground recommendation

import SwiftUI

@available(iOS 16.0, macOS 13.0, *)
struct ContentView: View {
    @State private var fg = "#6188d8"
    @State private var bg = "#07070e"
    @State private var result: ContrastResultVM?
    @State private var loading = false
    @State private var recommendation = ""

    private let engine = MomotoEngine.shared

    var body: some View {
        NavigationStack {
            List {
                // ── Color inputs ─────────────────────────────────────────
                Section("Colors") {
                    HexColorRow(label: "Foreground", hex: $fg)
                    HexColorRow(label: "Background", hex: $bg)
                }

                // ── Preview swatch ────────────────────────────────────────
                Section {
                    ZStack {
                        Color(hex: bg)
                            .frame(height: 80)
                            .cornerRadius(10)
                        Text("Sample Text")
                            .font(.title3.bold())
                            .foregroundColor(Color(hex: fg))
                    }
                    .listRowInsets(.init(top: 0, leading: 0, bottom: 0, trailing: 0))
                }

                // ── Actions ───────────────────────────────────────────────
                Section {
                    Button(action: checkContrast) {
                        Label(loading ? "Checking…" : "Check Contrast", systemImage: "eye")
                    }
                    .disabled(loading)

                    if !recommendation.isEmpty {
                        HStack {
                            Text("Recommended FG")
                            Spacer()
                            Text(recommendation)
                                .font(.system(.caption, design: .monospaced))
                            Circle()
                                .fill(Color(hex: recommendation))
                                .frame(width: 18, height: 18)
                        }
                    }
                }

                // ── Results ───────────────────────────────────────────────
                if let r = result {
                    Section("Results") {
                        MetricRow(label: "WCAG Ratio",  value: String(format: "%.2f:1", r.wcagRatio))
                        MetricRow(label: "Level",        value: r.level, badge: r.level)
                        MetricRow(label: "APCA Lc",      value: String(format: "%.0f Lc", r.apcaLc))
                        MetricRow(label: "WCAG AA",      value: r.passesAA  ? "Pass ✓" : "Fail ✗", pass: r.passesAA)
                        MetricRow(label: "WCAG AAA",     value: r.passesAAA ? "Pass ✓" : "Fail ✗", pass: r.passesAAA)
                    }
                }
            }
            .navigationTitle("Momoto")
            .navigationBarTitleDisplayMode(.inline)
        }
        .task { await loadRecommendation() }
    }

    private func checkContrast() {
        loading = true
        Task {
            do {
                let ratio = try await engine.wcagContrastRatio(fg: fg, bg: bg)
                let lc    = try await engine.apcaContrast(fg: fg, bg: bg)
                let level = wcagLevel(ratio)
                result = ContrastResultVM(wcagRatio: ratio, apcaLc: lc, level: level)
            } catch {
                print("Contrast check error: \(error)")
            }
            loading = false
        }
    }

    private func loadRecommendation() async {
        do {
            recommendation = try await engine.recommendForeground(bg: bg)
        } catch {}
    }

    private func wcagLevel(_ ratio: Double) -> String {
        if ratio >= 7   { return "AAA" }
        if ratio >= 4.5 { return "AA" }
        if ratio >= 3.0 { return "AA Large" }
        return "Fail"
    }
}

// ── View Models ────────────────────────────────────────────────────────────

struct ContrastResultVM {
    let wcagRatio, apcaLc: Double
    let level: String
    var passesAA:  Bool { wcagRatio >= 4.5 }
    var passesAAA: Bool { wcagRatio >= 7.0 }
}

// ── Sub-views ──────────────────────────────────────────────────────────────

@available(iOS 16.0, macOS 13.0, *)
struct HexColorRow: View {
    let label: String
    @Binding var hex: String

    var body: some View {
        HStack {
            Text(label).frame(width: 90, alignment: .leading)
            Circle()
                .fill(Color(hex: hex))
                .frame(width: 22, height: 22)
                .overlay(Circle().stroke(Color.gray.opacity(0.3), lineWidth: 1))
            TextField("#rrggbb", text: $hex)
                .font(.system(.body, design: .monospaced))
                .textInputAutocapitalization(.never)
                .autocorrectionDisabled()
        }
    }
}

struct MetricRow: View {
    let label, value: String
    var badge: String? = nil
    var pass: Bool? = nil

    var body: some View {
        HStack {
            Text(label).foregroundColor(.secondary)
            Spacer()
            if let pass {
                Text(value)
                    .foregroundColor(pass ? .green : .red)
                    .fontWeight(.semibold)
            } else {
                Text(value).fontWeight(.medium)
            }
        }
    }
}

// ── Color(hex:) extension ─────────────────────────────────────────────────

extension Color {
    init(hex: String) {
        let h = hex.trimmingCharacters(in: .init(charactersIn: "#"))
        let val = UInt64(h, radix: 16) ?? 0
        let r = Double((val >> 16) & 0xFF) / 255
        let g = Double((val >> 8)  & 0xFF) / 255
        let b = Double(val         & 0xFF) / 255
        self.init(red: r, green: g, blue: b)
    }
}
