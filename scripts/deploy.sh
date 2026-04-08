#!/bin/bash
set -e

echo "=== SMWORKS UI KIT Deploy ==="

# 1. Pull latest
echo "→ Pulling latest changes..."
git pull

# 2. Install dependencies
echo "→ Installing dependencies..."
yarn install --frozen-lockfile

# 3. Build library
echo "→ Building library..."
yarn build

# 4. Build preview (includes LLM docs generation)
echo "→ Building preview..."
yarn build:preview

# 5. Copy to public folder
PUBLIC_DIR="./public"
echo "→ Copying build to $PUBLIC_DIR..."
rm -rf "$PUBLIC_DIR"
cp -r preview/dist "$PUBLIC_DIR"

# 6. Copy .htaccess for SPA routing
cp scripts/.htaccess "$PUBLIC_DIR/.htaccess"

echo ""
echo "✓ Deploy complete!"
echo "  Files ready in: $PUBLIC_DIR/"