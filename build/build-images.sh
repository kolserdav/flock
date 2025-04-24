#! /usr/bin/bash

echo "Creating additional cross compile images"

CROSS_PATH=../cross

rm -rf "$CROSS_PATH"
git clone https://github.com/cross-rs/cross "$CROSS_PATH"
cd "$CROSS_PATH"
git submodule update --init --remote
cargo build-docker-image x86_64-pc-windows-msvc-cross --tag local
cargo build-docker-image i686-pc-windows-msvc-cross --tag local
cargo build-docker-image x86_64-apple-darwin-cross --build-arg 'MACOS_SDK_URL=https://github.com/phracker/MacOSX-SDKs/releases/download/11.3/MacOSX11.3.sdk.tar.xz' --tag local
cd -