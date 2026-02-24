#!/bin/bash

# Download Noto Sans Korean and Japanese fonts for PDF generation
FONTS_DIR="app/fonts"

mkdir -p "$FONTS_DIR"

echo "Downloading Noto Sans KR..."
curl -L "https://github.com/notofonts/noto-cjk/raw/main/Sans/OTF/Korean/NotoSansKR-Regular.otf" -o "$FONTS_DIR/NotoSansKR-Regular.otf" 2>/dev/null || echo "KR font download failed"

echo "Downloading Noto Sans JP..."
curl -L "https://github.com/notofonts/noto-cjk/raw/main/Sans/OTF/Japanese/NotoSansJP-Regular.otf" -o "$FONTS_DIR/NotoSansJP-Regular.otf" 2>/dev/null || echo "JP font download failed"

echo "Font download complete!"
ls -lh "$FONTS_DIR"
