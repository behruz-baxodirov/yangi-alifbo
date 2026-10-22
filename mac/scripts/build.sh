#!/usr/bin/env bash
# Universal (arm64 + x86_64) YangiAlifbo.app va YangiAlifbo.zip ni dist/ ga yig'adi.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
MAC="$ROOT/mac"
DIST="$ROOT/dist"
APP="$DIST/YangiAlifbo.app"
ARCHS=(--arch arm64 --arch x86_64)

swift build --package-path "$MAC" -c release "${ARCHS[@]}" --product YangiAlifbo
BIN_DIR="$(swift build --package-path "$MAC" -c release "${ARCHS[@]}" --show-bin-path)"

[ -f "$MAC/Resources/icon.tiff" ] || swift "$MAC/scripts/make-icon.swift" "$MAC/Resources/icon.tiff"

rm -rf "$APP"
mkdir -p "$APP/Contents/MacOS" "$APP/Contents/Resources"
cp "$BIN_DIR/YangiAlifbo" "$APP/Contents/MacOS/YangiAlifbo"
cp "$MAC/Resources/Info.plist" "$APP/Contents/Info.plist"
cp "$MAC/Resources/icon.tiff" "$APP/Contents/Resources/icon.tiff"
codesign --force --sign - --timestamp=none "$APP"

rm -f "$DIST/YangiAlifbo.zip"
(cd "$DIST" && ditto -c -k --keepParent YangiAlifbo.app YangiAlifbo.zip)
echo "tayyor: $APP"
echo "tayyor: $DIST/YangiAlifbo.zip"
