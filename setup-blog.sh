#!/bin/bash

# Blog System Setup Script
# Run this script to complete the blog system setup

set -e  # Exit on error

echo "🚀 Starting Blog System Setup..."
echo ""

# Step 1: Fix npm permissions
echo "📦 Step 1: Fixing npm permissions..."
sudo chown -R $(whoami) ~/.npm
npm cache clean --force
echo "✅ npm permissions fixed"
echo ""

# Step 2: Install dependencies
echo "📦 Step 2: Installing dependencies..."
npm install prisma @prisma/client zod next-auth@beta @auth/prisma-adapter react-markdown react-syntax-highlighter
npm install -D @types/react-syntax-highlighter
echo "✅ Dependencies installed"
echo ""

# Step 3: Check for .env file
if [ ! -f .env ]; then
    echo "⚙️  Step 3: Creating .env file..."
    cat > .env << 'EOF'
# Database Configuration
DATABASE_URL="postgresql://user:password@localhost:5432/portfolio_dev"
DIRECT_URL="postgresql://user:password@localhost:5432/portfolio_dev"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
AUTH_SECRET="REPLACE_WITH_GENERATED_SECRET"

# GitHub OAuth (Configure at: https://github.com/settings/developers)
AUTH_GITHUB_ID="your_github_client_id_here"
AUTH_GITHUB_SECRET="your_github_client_secret_here"

# Admin Access (use your GitHub email)
ADMIN_EMAIL="your-email@example.com"

# Existing environment variables
NEXT_PUBLIC_DOWNLOAD_URL="http://localhost:3000/download"
NEXT_PUBLIC_HOST="localhost"
NEXT_PUBLIC_HOSTNAME="localhost:3000"
NEXT_PUBLIC_API_BASE_URL="http://localhost:3000/api"
HOSTNAME="localhost"
PORT="3000"
HOST="http://localhost:3000"
EOF
    echo "✅ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env file with your actual values:"
    echo "   1. Update DATABASE_URL with your PostgreSQL connection"
    echo "   2. Generate AUTH_SECRET: openssl rand -base64 32"
    echo "   3. Configure GitHub OAuth at: https://github.com/settings/developers"
    echo "   4. Update ADMIN_EMAIL with your GitHub email"
    echo ""
else
    echo "⚙️  Step 3: .env file already exists, skipping..."
    echo ""
fi

# Step 4: Generate Prisma Client
echo "🗄️  Step 4: Generating Prisma Client..."
npx prisma generate
echo "✅ Prisma Client generated"
echo ""

# Step 5: Remove temporary type declarations
echo "🧹 Step 5: Cleaning up temporary type files..."
if [ -d "types" ]; then
    rm -f types/temp-declarations.d.ts
    rm -f types/markdown.d.ts
    # Remove types directory if empty
    rmdir types 2>/dev/null || true
    echo "✅ Temporary type files removed"
else
    echo "✅ No temporary files to clean"
fi
echo ""

echo "✨ Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Configure your .env file with actual values:"
echo "   - Database connection string"
echo "   - Generate AUTH_SECRET: openssl rand -base64 32"
echo "   - Setup GitHub OAuth: https://github.com/settings/developers"
echo "     Callback URL: http://localhost:3000/api/auth/callback/github"
echo ""
echo "2. Initialize the database:"
echo "   npm run db:migrate"
echo ""
echo "3. Run type check to verify no errors:"
echo "   npm run typecheck"
echo ""
echo "4. Start the development server:"
echo "   npm run dev"
echo ""
echo "5. Test the blog:"
echo "   - Visit: http://localhost:3000/blog"
echo "   - Sign in: http://localhost:3000/api/auth/signin"
echo ""
echo "📚 For detailed instructions, see QUICKSTART.md"
echo ""
