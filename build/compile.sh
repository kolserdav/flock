#! /usr/bin/bash

set -e

echo "Compile flock-rs script starts"

PACKAGE_NAME=flock-rs
RELEASE_DIR=release

platform=$(sh $(dirname "$0")/constants/platform.sh)

IFS=',' read -r -a platforms_array <<< "$platform"

rm -rf "$RELEASE_DIR"
mkdir -p "$RELEASE_DIR"

for platform in "${platforms_array[@]}"; do
    echo "Startgin compile for platform: $platform ..."
    export CARGO_TARGET_DIR="./target/$platform"
    rustup target add "$platform"
    napi build --platform --release --target "$platform"

    case "$platform" in
        "x86_64-unknown-linux-gnu")
            FILE_NAME="$PACKAGE_NAME.linux-x64-gnu.node"
            ;;
        "x86_64-unknown-linux-musl")
            FILE_NAME="$PACKAGE_NAME.linux-x64-musl.node"
            ;;
        "aarch64-unknown-linux-musl")
            FILE_NAME="$PACKAGE_NAME.linux-arm64-musl.node"
            ;;
        *)
            echo "Unknown platform: $platform"
            exit 1
            ;;
    esac

    mv -f "$FILE_NAME" "$RELEASE_DIR/$PACKAGE_NAME.$platform.node"
done

echo "flock-rs compilled"
