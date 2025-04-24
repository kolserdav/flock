#! /usr/bin/bash

echo "Compile flock-rs script starts"

platform=$(sh $(dirname "$0")/constants/platform.sh)

IFS=',' read -r -a platforms_array <<< "$platform"


for platform in "${platforms_array[@]}"; do
    echo "Startgin compile for platform: $platform ..."
    export CARGO_TARGET_DIR="./target/$platform"
    #cross rustc --target "$platform" --release -- -C lto
    napi build --platform "$platform" --release
done

echo "flock-rs compilled"
