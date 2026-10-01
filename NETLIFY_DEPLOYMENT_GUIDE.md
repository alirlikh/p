# Netlify Deployment Guide

## Prerequisites

1. **Netlify Account**: Sign up at https://www.netlify.com
2. **Git Repository**: Your project pushed to GitHub, GitLab, or Bitbucket
3. **New Database**: A PostgreSQL database (recommended: Neon, Supabase, or Railway)

## Step 1: Prepare Your Database

### Option A: Create a New Neon PostgreSQL Database

1. Go to https://neon.tech and sign up
2. Create a new project
3. Copy the connection strings:
   - **Connection String** (for Prisma Client with pooling)
   - **Direct Connection** (for migrations)

### Option B: Use Another PostgreSQL Provider

- **Supabase**: https://supabase.com (includes PostgreSQL + dashboard)
- **Railway**: https://railway.app (PostgreSQL with automatic backups)
- **Vercel Postgres**: https://vercel.com/postgres

## Step 2: Configure Environment Variables

Create a `.env.production.netlify` file locally (DO NOT commit this):

```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"
DIRECT_URL="postgresql://username:password@host:port/database?sslmode=require"

# NextAuth - IMPORTANT: Update to your Netlify domain
NEXTAUTH_URL="https://your-site-name.netlify.app"
AUTH_SECRET="<generate-new-secret-with-openssl-rand-base64-32>"

# GitHub OAuth - Create new OAuth app for production
AUTH_GITHUB_ID="your-production-github-client-id"
AUTH_GITHUB_SECRET="your-production-github-client-secret"

# Admin Email
ADMIN_EMAIL="your-production-admin@example.com"

# Public Assets & API
NEXT_PUBLIC_DOWNLOAD_URL="https://alireza-cv.storage.iran.liara.space/cv/alireza-jalili-cv.pdf"
NEXT_PUBLIC_API_BASE_URL="https://your-site-name.netlify.app/api"
```

## Step 3: Generate New Production Secrets

### 1. Generate AUTH_SECRET

Run this command in your terminal:
```bash
openssl rand -base64 32
```

Copy the output and use it as your `AUTH_SECRET` value.

### 2. Create GitHub OAuth App for Production

1. Go to https://github.com/settings/developers
2. Click **"New OAuth App"**
3. Fill in:
   - **Application name**: `Your Portfolio - Production`
   - **Homepage URL**: `https://your-site-name.netlify.app`
   - **Authorization callback URL**: `https://your-site-name.netlify.app/api/auth/callback/github`
4. Click **"Register application"**
5. Copy the **Client ID** and generate a **Client Secret**
6. Save these as `AUTH_GITHUB_ID` and `AUTH_GITHUB_SECRET`

## Step 4: Deploy to Netlify

### Method 1: Deploy via Netlify Dashboard (Recommended)

1. **Connect Your Repository**:
   - Go to https://app.netlify.com
   - Click **"Add new site"** → **"Import an existing project"**
   - Choose your Git provider (GitHub/GitLab/Bitbucket)
   - Select your repository

2. **Configure Build Settings**:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Base directory**: (leave empty)

3. **Add Environment Variables**:
   - In the deploy settings, click **"Add environment variables"**
   - Add each variable from your `.env.production.netlify` file:
     - `DATABASE_URL`
     - `DIRECT_URL`
     - `NEXTAUTH_URL`
     - `AUTH_SECRET`
     - `AUTH_GITHUB_ID`
     - `AUTH_GITHUB_SECRET`
     - `ADMIN_EMAIL`
     - `NEXT_PUBLIC_DOWNLOAD_URL`
     - `NEXT_PUBLIC_API_BASE_URL`

4. **Configure Netlify for Next.js**:
   - Netlify automatically detects Next.js
   - It will use the **Essential Next.js plugin**
   - Make sure **Server-side rendering** is enabled

5. **Deploy**:
   - Click **"Deploy site"**
   - Wait for the build to complete

### Method 2: Deploy via Netlify CLI

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**:
   ```bash
   netlify login
   ```

3. **Initialize Site**:
   ```bash
   netlify init
   ```
   - Choose **"Create & configure a new site"**
   - Select your team
   - Enter a site name

4. **Set Environment Variables**:
   ```bash
   netlify env:set DATABASE_URL "your-database-url"
   netlify env:set DIRECT_URL "your-direct-url"
   netlify env:set NEXTAUTH_URL "https://your-site-name.netlify.app"
   netlify env:set AUTH_SECRET "your-generated-secret"
   netlify env:set AUTH_GITHUB_ID "your-github-client-id"
   netlify env:set AUTH_GITHUB_SECRET "your-github-client-secret"
   netlify env:set ADMIN_EMAIL "your-email@example.com"
   netlify env:set NEXT_PUBLIC_DOWNLOAD_URL "your-cv-url"
   netlify env:set NEXT_PUBLIC_API_BASE_URL "https://your-site-name.netlify.app/api"
   ```

5. **Deploy**:
   ```bash
   netlify deploy --prod
   ```

## Step 5: Run Database Migrations

After your first deployment, you need to set up your database schema.

### Option A: Run Migrations Locally Against Production DB

1. **Temporarily set your local environment to production**:
   ```bash
   export DATABASE_URL="your-production-database-url"
   export DIRECT_URL="your-production-direct-url"
   ```

2. **Run migrations**:
   ```bash
   npx prisma migrate deploy
   ```

3. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

### Option B: Use Netlify Build Plugin (Automatic)

Create `netlify.toml` in your project root:

```toml
[build]
  command = "npx prisma generate && npx prisma migrate deploy && npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

This will run migrations automatically on every deploy.

## Step 6: Configure Custom Domain (Optional)

1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Follow the instructions to configure DNS
4. **IMPORTANT**: After adding custom domain, update:
   - `NEXTAUTH_URL` environment variable to your custom domain
   - GitHub OAuth callback URL to your custom domain
   - `NEXT_PUBLIC_API_BASE_URL` to your custom domain

## Step 7: Verify Deployment

1. **Visit your site**: `https://your-site-name.netlify.app`
2. **Test authentication**:
   - Click sign in
   - Authenticate with GitHub
   - Verify admin access works
3. **Test blog functionality**:
   - Create a post
   - Publish/unpublish
   - Verify categories and tags work
4. **Check API routes**:
   - Visit `/api/experience`
   - Visit `/api/blog`
   - Verify responses

## Troubleshooting

### Issue: "Invalid redirect_uri" from GitHub OAuth

**Solution**: Update your GitHub OAuth app's callback URL to match your Netlify domain exactly:
```
https://your-site-name.netlify.app/api/auth/callback/github
```

### Issue: Database connection errors

**Solutions**:
1. Verify `DATABASE_URL` and `DIRECT_URL` are correct
2. Check if your database allows connections from Netlify's IP addresses
3. Ensure connection strings include `?sslmode=require` for secure connections

### Issue: "Invalid environment configuration" error

**Solution**: 
1. Go to **Site settings** → **Environment variables**
2. Verify ALL required variables are set (check `lib/env.ts` for the complete list)
3. Click **"Trigger deploy"** to rebuild with new variables

### Issue: Build fails during Prisma generation

**Solution**: Ensure `netlify.toml` includes:
```toml
[build]
  command = "npx prisma generate && npm run build"
```

### Issue: 500 errors on API routes

**Solutions**:
1. Check Netlify function logs: **Functions** tab in dashboard
2. Verify environment variables are accessible
3. Check database connectivity from Netlify

## Performance Optimization for Netlify

### 1. Enable Caching

In `netlify.toml`:
```toml
[[headers]]
  for = "/_next/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/images/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### 2. Enable Asset Optimization

In Netlify dashboard:
- Go to **Site settings** → **Build & deploy** → **Asset optimization**
- Enable:
  - **Bundle CSS**
  - **Minify CSS**
  - **Minify JS**
  - **Compress images**

### 3. Configure Next.js Image Optimization

Netlify automatically handles Next.js Image optimization through their CDN.

## Continuous Deployment

Once connected to Git, Netlify will:
- ✅ Auto-deploy on every push to main branch
- ✅ Create preview deployments for pull requests
- ✅ Run build checks before deploying

To disable auto-deploy:
1. Go to **Site settings** → **Build & deploy** → **Continuous deployment**
2. Click **"Stop auto publishing"**

## Environment-Specific Builds

Create different branches for different environments:
- `main` → Production (auto-deploys)
- `staging` → Staging environment
- `develop` → Development previews

Configure branch deploys in **Site settings** → **Build & deploy** → **Deploy contexts**.

## Monitoring & Logs

### View Logs
1. Go to **Deploys** tab
2. Click on a deploy
3. View build logs and function logs

### Set Up Notifications
1. Go to **Site settings** → **Build & deploy** → **Deploy notifications**
2. Add notifications for:
   - Deploy started
   - Deploy failed
   - Deploy succeeded

## Cost Considerations

Netlify **Free Tier** includes:
- ✅ 100 GB bandwidth/month
- ✅ 300 build minutes/month
- ✅ Automatic HTTPS
- ✅ Continuous deployment
- ✅ Next.js SSR & ISR support

For production sites with higher traffic, consider upgrading to **Pro** ($19/month).

## Backup Strategy

1. **Database backups**:
   - Neon includes automatic backups
   - Schedule additional backups using `pg_dump`

2. **Code backups**:
   - Git repository is your source of truth
   - Netlify stores deploy snapshots

3. **Environment variables backup**:
   - Export from Netlify CLI:
     ```bash
     netlify env:list --json > env-backup.json
     ```
   - Store securely (DO NOT commit to Git)

## Next Steps After Deployment

1. ✅ Set up error monitoring (Sentry, LogRocket)
2. ✅ Configure analytics (Google Analytics, Plausible)
3. ✅ Set up uptime monitoring (UptimeRobot, Pingdom)
4. ✅ Run Lighthouse audit for performance
5. ✅ Test in multiple browsers and devices
6. ✅ Set up database backup automation
7. ✅ Configure CDN for static assets (if not using Netlify's)

## Support & Resources

- **Netlify Docs**: https://docs.netlify.com
- **Next.js on Netlify**: https://docs.netlify.com/frameworks/next-js/
- **Netlify Community**: https://answers.netlify.com
- **Prisma Docs**: https://www.prisma.io/docs

---

**Ready to Deploy?**

1. ✅ New database created and connection strings copied
2. ✅ New `AUTH_SECRET` generated
3. ✅ GitHub OAuth app configured for production
4. ✅ All environment variables prepared
5. ✅ Repository pushed to Git
6. ✅ Netlify account created

**Click "Add new site" in Netlify and follow the steps above!**
