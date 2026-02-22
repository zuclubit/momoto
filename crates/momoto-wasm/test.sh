#!/bin/bash
# WASM Test Execution Script
#
# Requires: wasm-pack (install with: cargo install wasm-pack)
#
# Usage:
#   ./test.sh          # Run in Node.js
#   ./test.sh firefox  # Run in Firefox headless
#   ./test.sh chrome   # Run in Chrome headless

set -e

if ! command -v wasm-pack &> /dev/null; then
    echo "Error: wasm-pack is not installed"
    echo "Install with: cargo install wasm-pack"
    exit 1
fi

case "${1:-node}" in
    node)
        echo "Running WASM tests in Node.js..."
        wasm-pack test --node
        ;;
    firefox)
        echo "Running WASM tests in Firefox (headless)..."
        wasm-pack test --headless --firefox
        ;;
    chrome)
        echo "Running WASM tests in Chrome (headless)..."
        wasm-pack test --headless --chrome
        ;;
    *)
        echo "Usage: $0 [node|firefox|chrome]"
        exit 1
        ;;
esac

echo "✅ All WASM tests passed!"
