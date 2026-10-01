# Quick Start: Deploy to Netlify

## ⚡ The Problem You're Seeing

Your build is failing with:
```
Error: P2021 - The table `public.projects` does not exist in the current database.
```

This happens because Next.js tries to fetch data during the build, but the database tables don't exist yet.

## ✅ The Solution: Run Migrations BEFORE Build

I've created `netlify.toml` which runs migrations automatically before building.

## 🚀 Step-by-Step Deployment

### Step 1: Create Your New Database

Choose ONE of these options:

#### Option A: Neon PostgreSQL (Recommended - Free Tier)
1. Go to https://console.neon.tech
2. Click **"Create a project"**
3. Name it: `portfolio-production`
4. Copy **both** connection strings:
   - **Pooled connection** → This is your `DATABASE_URL`
   - **Direct connection** → This is your `DIRECT_URL`

#### Option B: Supabase (Alternative)
1. Go to https://supabase.com/dashboard
2. Create new project: `portfolio-production`
3. Go to **Settings** → **Database**
4. Copy **Connection string** (both pooling and direct)

#### Option C: Railway (Alternative)
1. Go to https://railway.app
2. Create **New Project** → **Provision PostgreSQL**
3. Copy connection strings from **Variables** tab

### Step 2: Generate Production Secrets

Run these commands in your terminal:

```bash
# Generate AUTH_SECRET
openssl rand -base64 32
```

Copy the output - this is your `AUTH_SECRET`.

### Step 3: Create GitHub OAuth App

1. Go to https://github.com/settings/developers
2. Click **"New OAuth App"**
3. Fill in:
   - **Application name**: `Portfolio Production`
   - **Homepage URL**: `https://your-site-name.netlify.app` (you'll update this after Step 4)
   - **Authorization callback URL**: `https://your-site-name.netlify.app/api/auth/callback/github`
   - **NOTE**: For now, use a placeholder like `my-portfolio-prod` - you'll get the real URL in Step 4
4. Click **"Register application"**
5. Copy **Client ID**
6. Click **"Generate a new client secret"** and copy it

### Step 4: Deploy to Netlify

1. **Go to Netlify**:
   - Visit https://app.netlify.com
   - Click **"Add new site"** → **"Import an existing project"**

2. **Connect Repository**:
   - Choose your Git provider (GitHub/GitLab/Bitbucket)
   - Select your portfolio repository
   - Click **"Authorize"** if prompted

3. **IMPORTANT - Configure Build Settings**:
   - Netlify should auto-detect Next.js
   - **Build command**: Leave as default (netlify.toml will override it)
   - **Publish directory**: `.next`
   - **Note**: The `netlify.toml` file I created will handle the build command

4. **Add Environment Variables** (CRITICAL STEP):
   Click **"Add environment variables"** and add these ONE BY ONE:

   ```
   DATABASE_URL=postgresql://your-neon-connection-string
   DIRECT_URL=postgresql://your-neon-direct-connection-string
   NEXTAUTH_URL=https://PLACEHOLDER.netlify.app
   AUTH_SECRET=<paste-your-generated-secret>
   AUTH_GITHUB_ID=<paste-github-client-id>
   AUTH_GITHUB_SECRET=<paste-github-client-secret>
   ADMIN_EMAIL=your-email@example.com
   NEXT_PUBLIC_DOWNLOAD_URL=https://alireza-cv.storage.iran.liara.space/cv/alireza-jalili-cv.pdf
   NEXT_PUBLIC_API_BASE_URL=https://PLACEHOLDER.netlify.app/api
   ```

   **Important**: 
   - Use `PLACEHOLDER.netlify.app` for now
   - We'll update `NEXTAUTH_URL` and `NEXT_PUBLIC_API_BASE_URL` in Step 6

5. **Click "Deploy"**:
   - Netlify will start building
   - The `netlify.toml` will run migrations first
   - Then build Next.js

6. **Wait for Deploy** (2-5 minutes):
   - Watch the deploy logs
   - Look for: `✓ Running migrations...` (this means Prisma is working)
   - Wait for: `✓ Site is live`

### Step 5: Get Your Netlify URL

After deploy completes:
1. Copy your Netlify URL (e.g., `https://gleaming-unicorn-123456.netlify.app`)
2. **This is your production domain**

### Step 6: Update Environment Variables with Real URL

1. Go to **Site settings** → **Environment variables**
2. **Update these TWO variables**:
   - `NEXTAUTH_URL`: Change from `PLACEHOLDER.netlify.app` to your real Netlify URL
   - `NEXT_PUBLIC_API_BASE_URL`: Change to `https://your-real-url.netlify.app/api`
3. Click **"Save"**
4. Go to **Deploys** tab → Click **"Trigger deploy"** → **"Clear cache and deploy site"**

### Step 7: Update GitHub OAuth Callback

1. Go back to https://github.com/settings/developers
2. Click on your OAuth app
3. Update:
   - **Homepage URL**: `https://your-real-netlify-url.netlify.app`
   - **Authorization callback URL**: `https://your-real-netlify-url.netlify.app/api/auth/callback/github`
4. Click **"Update application"**

### Step 8: Test Your Deployment

1. **Visit your site**: Open `https://your-netlify-url.netlify.app`
2. **Test GitHub login**:
   - Click **"Sign in with GitHub"**
   - Authorize the app
   - You should be redirected back and logged in
3. **Verify admin access**:
   - If your email matches `ADMIN_EMAIL`, you should have admin access
   - Try creating a blog post
4. **Test the blog**:
   - Visit `/blog`
   - Create a category
   - Create a tag
   - Create and publish a post

## 🎉 You're Live!

Your portfolio is now deployed! 

### What `netlify.toml` Does

The configuration file I created:
1. ✅ Runs `prisma db push` to sync the database schema before the Next.js build
2. ✅ Runs `npm run build` to generate Prisma Client and build Next.js
3. ✅ Configures caching for static assets
4. ✅ Uses Node.js 22 (same as your Dockerfile)

This project does not currently contain Prisma migration files, so the Netlify
build uses `db push` rather than `migrate deploy`. Make sure the `DATABASE_URL`
configured for the Netlify deploy points to the same database used by the
deployed app.

## 🔧 Troubleshooting

### Build still fails with "table does not exist"

**Check**:
1. Are `DATABASE_URL` and `DIRECT_URL` correct in Netlify environment variables?
2. Do both URLs include `?sslmode=require` at the end?
3. Can you connect to the database from your local machine?

**Test locally**:
```bash
# Set your production database URL temporarily
export DATABASE_URL="your-production-database-url"
export DIRECT_URL="your-production-direct-url"

# Sync the schema from prisma/schema.prisma
npx prisma db push

# Confirm the command reports that the database is in sync
```

### "Invalid redirect_uri" error during GitHub login

**Fix**: The GitHub OAuth callback URL doesn't match.
- Check it's: `https://your-exact-netlify-url.netlify.app/api/auth/callback/github`
- No trailing slash
- Matches your `NEXTAUTH_URL` exactly

### "Invalid environment configuration" error

**Check**: All required environment variables are set in Netlify:
- DATABASE_URL
- DIRECT_URL  
- NEXTAUTH_URL
- AUTH_SECRET
- AUTH_GITHUB_ID
- AUTH_GITHUB_SECRET
- ADMIN_EMAIL
- NEXT_PUBLIC_DOWNLOAD_URL
- NEXT_PUBLIC_API_BASE_URL

### Database connection timeout

**Solutions**:
1. **Neon**: Database might be in sleep mode - wait 30 seconds and try again
2. Check if database accepts connections from `0.0.0.0/0` (all IPs)
3. Verify SSL mode is enabled: `?sslmode=require`

## 📝 After Deployment

### Custom Domain (Optional)

1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Follow DNS configuration instructions
4. **After DNS propagates**:
   - Update `NEXTAUTH_URL` to custom domain
   - Update `NEXT_PUBLIC_API_BASE_URL` to custom domain
   - Update GitHub OAuth callback URL to custom domain
   - Trigger a new deploy

### Continuous Deployment

Every push to your `main` branch will:
- ✅ Automatically trigger a new deploy
- ✅ Run migrations (safe, idempotent)
- ✅ Rebuild the site
- ✅ Go live in ~2-5 minutes

### Monitor Your Site

1. **View logs**: Deploys tab → Click a deploy → View logs
2. **Function logs**: Functions tab (for API routes)
3. **Analytics**: Analytics tab (enable if needed)

## 🎯 Next Steps

1. ✅ Test all functionality
2. ✅ Create your first blog post
3. ✅ Set up custom domain (optional)
4. ✅ Configure analytics (Google Analytics, Plausible, etc.)
5. ✅ Set up error monitoring (Sentry recommended)

## 💰 Cost

**Netlify Free Tier** includes everything you need:
- ✅ 100 GB bandwidth/month
- ✅ 300 build minutes/month
- ✅ Unlimited sites
- ✅ Automatic HTTPS
- ✅ CDN
- ✅ Continuous deployment

**Neon Free Tier**:
- ✅ 3 GB storage
- ✅ Unlimited databases
- ✅ Auto-suspend after inactivity
- ✅ Point-in-time restore

Perfect for a portfolio site! No credit card required.

---

**Need Help?** If you encounter any issues:
1. Check the deploy logs in Netlify
2. Verify all environment variables are set correctly
3. Test database connection with `npx prisma studio` locally using production DATABASE_URL
4. Check the NETLIFY_DEPLOYMENT_GUIDE.md for more detailed troubleshooting
