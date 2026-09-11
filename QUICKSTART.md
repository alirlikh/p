# Quick Start Guide

## ⚠️ Important: You MUST complete these steps before the code will work!

### Step 1: Fix NPM Permissions (REQUIRED)

```bash
sudo chown -R $(whoami) ~/.npm
npm cache clean --force
```

### Step 2: Install Dependencies (REQUIRED)

```bash
npm install prisma @prisma/client zod next-auth@beta @auth/prisma-adapter
```

### Step 3: Setup Database (REQUIRED)

**Option A: Local PostgreSQL**

```bash
# Create database
createdb portfolio_dev

# Update .env
cp .env.example .env
# Edit DATABASE_URL in .env to match your PostgreSQL credentials
```

**Option B: Vercel Postgres (Recommended)**

```bash
# 1. Go to Vercel dashboard → Storage → Create Postgres
# 2. Copy connection strings
# 3. Update .env with POSTGRES_URL and POSTGRES_URL_NON_POOLING
```

### Step 4: Setup GitHub OAuth (REQUIRED)

```bash
# 1. Go to: https://github.com/settings/developers
# 2. Click "New OAuth App"
# 3. Fill in:
#    - Name: Portfolio Blog
#    - Homepage: http://localhost:3000
#    - Callback: http://localhost:3000/api/auth/callback/github
# 4. Copy Client ID and Secret to .env
```

### Step 5: Generate Auth Secret (REQUIRED)

```bash
openssl rand -base64 32
# Copy output to AUTH_SECRET in .env
```

### Step 6: Set Admin Email (REQUIRED)

```bash
# Edit .env and set:
ADMIN_EMAIL="your-github-email@example.com"
# MUST match your GitHub account email!
```

### Step 7: Initialize Database (REQUIRED)

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### Step 8: Start Development Server

```bash
npm run dev
```

### Step 9: Test Everything

```bash
# Open browser
http://localhost:3000

# Test auth
http://localhost:3000/api/auth/signin

# Open Prisma Studio
npx prisma studio
```

## 🎉 Once Setup is Complete

You'll have:

- ✅ Working authentication with GitHub
- ✅ Blog API endpoints (GET, POST, PATCH, DELETE)
- ✅ Database with all tables created
- ✅ Admin access control
- ✅ Input validation
- ✅ Error handling

## 📚 Full Documentation

For detailed information, see:

- `SETUP.md` - Complete setup guide
- `IMPLEMENTATION_SUMMARY.md` - What was built
- `.claude/plans/blog-database-api-design-review.md` - Architecture review

## ⚡ Quick Test Commands

```bash
# List all posts (should return empty array initially)
curl http://localhost:3000/api/blog

# Get categories
curl http://localhost:3000/api/blog/categories

# View database
npx prisma studio
```

## 🚨 Common Errors

**"Cannot find module '@prisma/client'"**
→ Run: `npm install prisma @prisma/client`

**"P1001: Can't reach database"**
→ Check DATABASE_URL in .env is correct

**"Admin access required"**
→ Ensure ADMIN_EMAIL matches your GitHub email

---

**Estimated Setup Time:** 10-15 minutes

**Status:** Backend complete, ready for frontend development!
