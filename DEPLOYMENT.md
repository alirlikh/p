# Deployment Guide

This document outlines the production deployment requirements for the Alireza Jalili portfolio website.

## Prerequisites

- Node.js 22+
- Docker
- PostgreSQL (or similar Prisma-compatible database)

## Environment Variables

The following variables must be set in production:

- `DATABASE_URL`: Connection string for the production database.
- `NEXT_PUBLIC_API_BASE_URL`: API URL.
- `NEXT_PUBLIC_DOWNLOAD_URL`: URL for the CV download.
- `NEXTAUTH_SECRET`: Secret key for authentication.
- `NEXTAUTH_URL`: Canonical URL of the production app.
- `ADMIN_EMAIL`: Email of the administrator.

## Database Backup Strategy

We use `pg_dump` for PostgreSQL backups.

### Automated Backups
Schedule a cron job on your server or in your infrastructure (e.g., AWS RDS snapshot) to run:

```bash
pg_dump -U username -h host -d dbname > /path/to/backups/db_$(date +%F).sql
```

Upload these backups to offsite storage like AWS S3.

### Restoration Procedure

```bash
# Restore from a backup file
psql -U username -h host -d dbname < /path/to/backup.sql
```

## Docker Deployment

1. **Build the image**:
   ```bash
   docker build -t portfolio-app .
   ```

2. **Run the container**:
   ```bash
   docker run -d -p 3000:3000 \
     -e DATABASE_URL="your_db_url" \
     -e NEXTAUTH_SECRET="your_secret" \
     portfolio-app
   ```

## Monitoring

- The application uses a custom logger (`lib/logger.ts`). Check container logs for errors:
  ```bash
  docker logs <container_id>
  ```
- Error monitoring integration (e.g., Sentry) is recommended. Configure `SENTRY_DSN` if enabled.
