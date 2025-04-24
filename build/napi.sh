#!/bin/bash
set -euo pipefail

export DEBUG="napi:*"
export MACOSX_DEPLOYMENT_TARGET="10.13"

platform=$(sh $(dirname "$0")/constants/platform.sh)

IFS=',' read -r -a TARGETS <<< "$platform"

for target in "${TARGETS[@]}"; do
  rustup target add "$target"
done


echo "Install dependencies ..."
yarn install

echo "Project building..."
for target in "${TARGETS[@]}"; do
  echo "Build for $target..."
  yarn build --target "$target"
done

echo "Creating artifacts..."
mkdir -p artifacts
for target in "${TARGETS[@]}"; do
  cp 01-pure-rust/*.node "artifacts/bindings-$target" 2>/dev/null || :
done

echo "Build successfully end!"