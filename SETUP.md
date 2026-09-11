# Database & Blog Setup Guide

## Prerequisites

Before starting, ensure you have:

- Node.js 20+ installed
- PostgreSQL 15+ installed (or use Vercel Postgres)
- GitHub account (for OAuth authentication)

## Step 1: Install Dependencies

Since there was a permission issue with npm, please run this command yourself:

```bash
npm install prisma @prisma/client zod next-auth@beta @auth/prisma-adapter
```

Or if you prefer to fix the npm cache permission issue first:

```bash
sudo chown -R $(whoami) ~/.npm
npm cache clean --force
npm install prisma @prisma/client zod next-auth@beta @auth/prisma-adapter
```

## Step 2: Setup Environment Variables

Copy the `.env.example` to `.env`:

```bash
cp .env.example .env
```

Then edit `.env` and update the following values:

### Database Configuration

**Option A: Local PostgreSQL**

```env
DATABASE_URL="postgresql://your_user:your_password@localhost:5432/portfolio_dev"
DIRECT_URL="postgresql://your_user:your_password@localhost:5432/portfolio_dev"
```

Create the database:

```bash
createdb portfolio_dev
```

**Option B: Vercel Postgres (Recommended for production)**

1. Go to your Vercel project dashboard
2. Navigate to Storage → Create Database → Postgres
3. Copy the connection strings
4. Use `POSTGRES_URL` for `DATABASE_URL`
5. Use `POSTGRES_URL_NON_POOLING` for `DIRECT_URL`

### NextAuth Configuration

Generate a secret:

```bash
openssl rand -base64 32
```

Update `.env`:

```env
NEXTAUTH_URL="http://localhost:3000"
AUTH_SECRET="paste-the-generated-secret-here"
```

### GitHub OAuth Setup

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in the details:
   - Application name: "Portfolio Blog"
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Click "Register application"
5. Copy the Client ID and generate a Client Secret
6. Update `.env`:

```env
AUTH_GITHUB_ID="your_github_client_id"
AUTH_GITHUB_SECRET="your_github_client_secret"
```

### Admin Email

Set your email as admin:

```env
ADMIN_EMAIL="your-email@example.com"
```

**Important:** Use the same email that's linked to your GitHub account!

## Step 3: Initialize Database

Run Prisma migrations to create the database schema:

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations (creates tables)
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view your database
npx prisma studio
```

## Step 4: Update package.json Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "typegen": "next typegen",
    "typecheck": "npm run typegen && tsc --noEmit",
    "build": "prisma generate && next build",
    "start": "next start",
    "lint": "eslint",
    "analyze": "npx next experimental-analyze",
    "analyze:snapshot": "npx next experimental-analyze --output && cp -r .next/diagnostics/analyze ./analyze-before-refactor",
    "release": "standard-version",
    "release:minor": "standard-version --release-as minor",
    "release:patch": "standard-version --release-as patch",
    "release:major": "standard-version --release-as major",
    "prepare": "husky",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:push": "prisma db push",
    "db:studio": "prisma studio",
    "db:seed": "tsx prisma/seed.ts"
  }
}
```

## Step 5: Test the Setup

### Test Database Connection

```bash
npx prisma studio
```

This should open a GUI at `http://localhost:5555` showing your database tables.

### Test API Endpoints

Start the development server:

```bash
npm run dev
```

Test endpoints:

1. **List posts (public)**

   ```bash
   curl http://localhost:3000/api/blog
   ```

2. **Get categories (public)**

   ```bash
   curl http://localhost:3000/api/blog/categories
   ```

3. **Authentication**
   - Visit: `http://localhost:3000/api/auth/signin`
   - Sign in with GitHub
   - Make sure your GitHub email matches `ADMIN_EMAIL` in `.env`

4. **Create a post (admin only)**
   - First, sign in via the web UI
   - Then use curl with cookies or test via admin dashboard (to be created)

## Step 6: Verify Technical Debt Fixes

The following issues have been fixed:

✅ **File renamed:** `experince.ts` → `experience.ts`
✅ **Prettier enabled:** `.prettierrc.mjs` uncommented and simplified
✅ **Error handling added:** All `data/server/get*.ts` files now have try-catch blocks
✅ **404 page created:** `app/not-found.tsx`
✅ **Error boundary created:** `app/error.tsx`

## Project Structure (New Files)

````
project/
├── prisma/
│   └── schema.prisma                    # Database schema
├── lib/
│   ├── prisma.ts                        # Prisma client singleton
│   ├── auth.ts                          # NextAuth configuration
│   ├── auth.types.ts                    # NextAuth TypeScript types
│   └── validations/
│       └── blog.ts                      # Zod validation schemas
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/route.ts  # NextAuth API routes
│   │   └── blog/
│   │       ├── route.ts                 # GET (list), POST (create)
│   │       ├── [slug]/route.ts         # GET, PATCH, DELETE single post
│   │       └── categories/route.ts      # Categories CRUD
│   ├── error.tsx                        # Error boundary
│   └── not-found.tsx                    # 404 page
├── middleware.ts                        # Protect admin routes
├── .env.example                         # Environment variables template
└── SETUP.md                             # This file

## Common Issues & Solutions

### Issue: "P1001: Can't reach database server"

**Solution:**
- Check if PostgreSQL is running: `pg_ctl status`
- Verify DATABASE_URL in `.env` is correct
- For local setup, ensure PostgreSQL service is started

### Issue: "Invalid `prisma.post.findMany()` invocation"

**Solution:**
- Run `npx prisma generate` to regenerate the Prisma Client
- Restart your dev server

### Issue: "Module not found: Can't resolve '@prisma/client'"

**Solution:**
- Install dependencies: `npm install`
- Generate Prisma Client: `npx prisma generate`

### Issue: Authentication not working

**Solution:**
- Verify GitHub OAuth callback URL matches exactly
- Check AUTH_SECRET is set
- Ensure ADMIN_EMAIL matches your GitHub email
- Clear cookies and try again

### Issue: "Admin access required" when you should be admin

**Solution:**
- Check your GitHub email matches ADMIN_EMAIL in `.env`
- Sign out and sign in again
- Check database: `npx prisma studio` → users table → verify your role

## Next Steps

Now that the backend is set up, you can:

1. **Create admin dashboard UI** - For managing blog posts
2. **Create blog listing page** - Display all posts at `/blog`
3. **Create blog post page** - Display single post at `/blog/[slug]`
4. **Add rich text editor** - For writing posts (react-markdown or next-mdx-remote)
5. **Add image upload** - For post cover images

Refer to the implementation plan for detailed steps.

## Database Commands Reference

```bash
# Generate Prisma Client (after schema changes)
npx prisma generate

# Create a new migration
npx prisma migrate dev --name your_migration_name

# Apply migrations to production
npx prisma migrate deploy

# Push schema changes without migration (development only)
npx prisma db push

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Open Prisma Studio (database GUI)
npx prisma studio

# Validate schema
npx prisma validate

# Format schema file
npx prisma format
````

## Production Deployment Checklist

Before deploying to production:

- [ ] Set all environment variables in Vercel dashboard
- [ ] Use Vercel Postgres or another production database
- [ ] Run `npx prisma migrate deploy` on production database
- [ ] Update GitHub OAuth callback URL to production URL
- [ ] Set NEXTAUTH_URL to production URL
- [ ] Generate new AUTH_SECRET for production
- [ ] Test authentication in production
- [ ] Test API endpoints in production
- [ ] Monitor database connection pool usage
- [ ] Set up error tracking (Sentry recommended)

## Support

If you encounter issues:

1. Check the error message carefully
2. Review this SETUP.md file
3. Check the review document at `.claude/plans/blog-database-api-design-review.md`
4. Review Prisma docs: https://www.prisma.io/docs
5. Review NextAuth docs: https://next-auth.js.org

Good luck! 🚀
