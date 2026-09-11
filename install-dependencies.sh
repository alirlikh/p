#!/bin/bash

# Fix npm cache permissions and install dependencies
# Run this script with: bash install-dependencies.sh

echo "🔧 Fixing npm cache permissions..."
sudo chown -R $(whoami) ~/.npm

echo "🧹 Cleaning npm cache..."
npm cache clean --force

echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

echo "🗄️  Generating Prisma client..."
npx prisma generate

echo ""
echo "✅ Installation complete!"
echo ""
echo "Next steps:"
echo "1. Configure .env file with your database and auth settings"
echo "2. Run: npm run db:migrate"
echo "3. Run: npm run dev"
