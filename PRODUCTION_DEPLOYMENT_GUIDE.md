# Production Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying the Next.js 16.2.3 portfolio website to a production server. The project includes a blog system with authentication, Prisma ORM with PostgreSQL, and NextAuth with GitHub OAuth.

## Completed Production Preparation

### ✅ Security Hardening
1. **Environment Variables Standardized**: All `.env` and `.env.local` files now use consistent variable names matching `lib/env.ts`
2. **Template Files Created**:
   - `.env.example` - Safe template for documentation
   - `.env.production` - Production environment template
3. **CSP Tightened**: Removed `'unsafe-eval'` from Content-Security-Policy
4. **Structured Logging**: Replaced all `console.error()` calls with `logger.error()` from `lib/logger.ts`
5. **TypeScript Types**: Fixed all `any` types with proper interfaces

### ✅ Code Quality
- **TypeScript**: All type checks passing ✓
- **ESLint**: No errors or warnings ✓
- **Pre-commit Hooks**: Husky configured to run lint and typecheck

### ✅ Docker Configuration
- Multi-stage build with Node 22 Alpine
- Standalone output mode for minimal image size
- Non-root user (`nextjs`) for security
- Port 3000 exposed

## Critical: Production Secrets Setup

### 🚨 **IMPORTANT**: Update These Before Deployment

Your current `.env.local` contains development credentials. For production, you **must**:

1. **Generate a new `AUTH_SECRET`** for production:
   ```bash
   openssl rand -base64 32
   ```

2. **Update `NEXTAUTH_URL`** to your production domain:
   ```
   NEXTAUTH_URL=https://your-production-domain.com
   ```

3. **Configure GitHub OAuth for Production**:
   - Go to https://github.com/settings/developers
   - Create a new OAuth App (or update the existing one)
   - Set the **Homepage URL** to your production domain
   - Set the **Authorization callback URL** to: `https://your-production-domain.com/api/auth/callback/github`
   - Copy the new Client ID and Secret

4. **Update Production Environment Variables**:
   Edit `.env.production` with your actual production values:
   ```env
   # Database (use your production Neon PostgreSQL or other database)
   DATABASE_URL="postgresql://..."
   DIRECT_URL="postgresql://..."

   # NextAuth
   NEXTAUTH_URL="https://your-production-domain.com"
   AUTH_SECRET="<your-new-production-secret>"

   # GitHub OAuth (production credentials)
   AUTH_GITHUB_ID="<your-production-github-client-id>"
   AUTH_GITHUB_SECRET="<your-production-github-client-secret>"

   # Admin Email
   ADMIN_EMAIL="your-production-admin-email@example.com"

   # Public Assets & API
   NEXT_PUBLIC_DOWNLOAD_URL="https://alireza-cv.storage.iran.liara.space/cv/alireza-jalili-cv.pdf"
   NEXT_PUBLIC_API_BASE_URL="https://your-production-domain.com/api"
   ```

## Deployment Options

### Option 1: Docker Deployment (Recommended)

1. **Build the Docker image**:
   ```bash
   docker build -t portfolio-app .
   ```

2. **Run with environment variables**:
   ```bash
   docker run -d \
     --name portfolio \
     -p 3000:3000 \
     --env-file .env.production \
     portfolio-app
   ```

3. **Or use Docker Compose** (create `docker-compose.yml`):
   ```yaml
   version: '3.8'
   services:
     app:
       build: .
       ports:
         - "3000:3000"
       env_file:
         - .env.production
       restart: unless-stopped
   ```

   Then run:
   ```bash
   docker-compose up -d
   ```

### Option 2: Direct Server Deployment

1. **Install dependencies**:
   ```bash
   npm ci --production
   ```

2. **Run Prisma migrations**:
   ```bash
   npm run db:migrate:deploy
   ```

3. **Build the application**:
   ```bash
   npm run build
   ```

4. **Start with PM2** (process manager):
   ```bash
   npm install -g pm2
   pm2 start npm --name "portfolio" -- start
   pm2 save
   pm2 startup
   ```

### Option 3: Vercel / Netlify / Similar Platforms

1. Connect your Git repository
2. Set environment variables in the platform dashboard (use values from `.env.production`)
3. Deploy - the platform will automatically run build and migrations

## Database Setup

### Prisma Migrations

For production deployment, use the deployment command:
```bash
npx prisma migrate deploy
```

This command:
- Applies all pending migrations
- Does not create new migrations
- Safe for CI/CD pipelines

### Database Connection

The project uses:
- `DATABASE_URL` - For Prisma Client queries (should use connection pooling)
- `DIRECT_URL` - For migrations (direct connection, bypasses pooling)

Neon PostgreSQL is already configured. Make sure your production database is accessible from your server.

## SSL/TLS Configuration

### Using Nginx as Reverse Proxy

1. **Install Nginx and Certbot**:
   ```bash
   sudo apt update
   sudo apt install nginx certbot python3-certbot-nginx
   ```

2. **Configure Nginx** (`/etc/nginx/sites-available/portfolio`):
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

3. **Enable the site**:
   ```bash
   sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

4. **Get SSL certificate**:
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

## Post-Deployment Checklist

- [ ] Verify `NEXTAUTH_URL` is set to production domain
- [ ] Test GitHub OAuth login flow
- [ ] Verify admin email grants admin access
- [ ] Test all API endpoints
- [ ] Check database connectivity
- [ ] Verify blog post creation/editing works
- [ ] Test image uploads (if applicable)
- [ ] Check mobile responsiveness
- [ ] Run Lighthouse audit for performance
- [ ] Set up error monitoring (Sentry, LogRocket, etc.)
- [ ] Configure backup strategy for database
- [ ] Set up monitoring/alerts for downtime

## Monitoring & Maintenance

### Log Access

The application uses structured logging via `lib/logger.ts`. Logs are output as JSON to stdout.

To view logs:
- **Docker**: `docker logs -f portfolio`
- **PM2**: `pm2 logs portfolio`

### Database Backups

For Neon PostgreSQL:
- Automatic backups are included in the free tier
- Configure backup retention in Neon dashboard
- Test restore process periodically

### Updates

1. Pull latest changes
2. Run `npm run typecheck` and `npm run lint`
3. Run `npm run build` locally to verify
4. Deploy to production
5. Run `npx prisma migrate deploy` if there are new migrations
6. Restart the application

## Troubleshooting

### Common Issues

**Issue**: "Invalid redirect_uri" from GitHub OAuth  
**Solution**: Update GitHub OAuth app callback URL to match production domain

**Issue**: "Invalid environment configuration" error  
**Solution**: Verify all required environment variables are set (check `lib/env.ts` for the complete list)

**Issue**: Database connection errors  
**Solution**: Check `DATABASE_URL` and `DIRECT_URL` are correct and the database is accessible from the server

**Issue**: 500 errors on API routes  
**Solution**: Check application logs for detailed error messages

## Security Notes

1. **Never commit `.env.production` to version control** - it contains production secrets
2. **Rotate secrets periodically** - especially `AUTH_SECRET`
3. **Keep dependencies updated** - run `npm audit` regularly
4. **Monitor logs for suspicious activity**
5. **Use strong database passwords**
6. **Enable 2FA on all service accounts** (GitHub, database host, etc.)

## Performance Optimization

The project already includes:
- ✅ Standalone Docker output for minimal image size
- ✅ Image optimization via Next.js Image component
- ✅ Package import optimization (Framer Motion, Swiper)
- ✅ ISR (Incremental Static Regeneration) for blog pages

Consider adding:
- CDN for static assets
- Redis for session storage
- Database query optimization
- Bundle analysis (`npm run analyze`)

## Support

For issues specific to:
- **Next.js**: https://nextjs.org/docs
- **Prisma**: https://www.prisma.io/docs
- **NextAuth**: https://next-auth.js.org
- **Neon**: https://neon.tech/docs

---

**Last Updated**: 2026-10-01  
**Project Version**: 0.1.2
