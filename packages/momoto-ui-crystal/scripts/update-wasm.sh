#!/bin/bash

# Update WASM bindings from Rust crate
# Run this script whenever the Rust WASM bindings are updated

set -e

echo "🦀 Building Rust WASM..."
cd ../../../momoto/crates/momoto-wasm
wasm-pack build --target web --out-dir pkg

echo "📦 Copying WASM to public directory..."
cd -
rm -rf public/wasm
mkdir -p public/wasm
cp ../../../momoto/crates/momoto-wasm/pkg/* public/wasm/

echo "✅ WASM updated successfully!"
echo ""
echo "Files copied:"
ls -lh public/wasm/

echo ""
echo "🎯 Next step: Restart Storybook if it's running"
echo "   npm run storybook"
