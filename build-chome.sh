#!/bin/bash

# Configuration
PROJECT_NAME="Lead-Generator"
DIST_DIR="dist"
UNZIPPED_DIR="$DIST_DIR/unpacked_extension"
ZIP_FILE="$DIST_DIR/lead-generator.zip"

echo "🔨 Building $PROJECT_NAME..."

# 1. Create and clean the dist folder structure
mkdir -p "$UNZIPPED_DIR"
# Clear previous build files
rm -rf "$UNZIPPED_DIR"/*
rm -f "$ZIP_FILE"

# 2. List of core files to include
FILES=("manifest.json" "popup.html" "popup.js" "content.js" "background.js" "README.md")

# 3. Copy files to the unzipped folder
echo "📂 Creating unzipped folder in $UNZIPPED_DIR..."
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        cp "$file" "$UNZIPPED_DIR/"
        echo "  ✔️ Copied $file"
    else
        echo "  ⚠️ Skipping $file (not found)"
    fi
done

# 4. Create the Zip file from the unzipped folder
echo "📦 Packaging extension into $ZIP_FILE..."
# Navigate into the folder to ensure the zip doesn't contain the 'dist/' path prefix
(cd "$UNZIPPED_DIR" && zip -rq "../../$ZIP_FILE" .)

echo "---"
echo "✅ Done! Build files are in the /$DIST_DIR folder."
echo "   - Unzipped: Load this in Chrome (Developer Mode -> Load Unpacked)"
echo "   - Zip: Send this to others or upload to the Web Store"