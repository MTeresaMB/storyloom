# Deployment Guide

## Overview

Esta guía cubre el despliegue de StoryLoom en diferentes entornos, desde desarrollo local hasta producción.

## Prerequisites

### Required Software

- Node.js 18+
- npm 9+
- Git
- PostgreSQL (via Supabase)
- Vercel CLI (for frontend deployment)
- Railway CLI (for backend deployment)

### Required Accounts

- Supabase account
- Vercel account
- Railway account
- GitHub account

## Environment Setup

### 1. Development Environment

#### Local Setup

```bash
# Clone repository
git clone https://github.com/your-username/storyloom.git
cd storyloom

# Install dependencies
npm run install:all

# Set up environment variables
cp .env.example .env.local
```text

#### Environment Variables
```bash
# Frontend (.env.local)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:3001/api

# Backend (.env)
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_jwt_secret
PORT=3001
NODE_ENV=development
```text

#### Database Setup
```bash
# Install Supabase CLI
npm install -g supabase

# Initialize Supabase
supabase init

# Start local Supabase
supabase start

# Apply migrations
supabase db push

# Seed development data
supabase db seed
```text

#### Running Development
```bash
# Start all services
npm run dev

# Or start individually
npm run dev:frontend
npm run dev:backend
```text

### 2. Staging Environment

#### Vercel Deployment (Frontend)
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to staging
vercel --prod

# Set environment variables
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel env add VITE_API_URL
```text

#### Railway Deployment (Backend)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Deploy to Railway
railway up

# Set environment variables
railway variables set SUPABASE_URL=your_supabase_url
railway variables set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
railway variables set JWT_SECRET=your_jwt_secret
railway variables set NODE_ENV=staging
```text

### 3. Production Environment

#### Production Checklist
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificates configured
- [ ] Domain names configured
- [ ] Monitoring setup
- [ ] Backup strategy implemented

#### Frontend Production (Vercel)
```bash
# Build for production
npm run build

# Deploy to production
vercel --prod

# Configure custom domain
vercel domains add storyloom.com
```text

#### Backend Production (Railway)
```bash
# Deploy to production
railway up --service backend

# Configure custom domain
railway domains add api.storyloom.com
```text

## Database Deployment

### Supabase Setup

#### 1. Create Supabase Project
```bash
# Create new project
supabase projects create storyloom-prod

# Get project URL and keys
supabase projects list
```text

#### 2. Apply Migrations
```bash
# Link to production project
supabase link --project-ref your-project-ref

# Apply migrations
supabase db push

# Set up RLS policies
supabase db push --include-seed
```text

#### 3. Configure Authentication
```sql
-- Enable email authentication
UPDATE auth.config
SET enable_email = true,
    enable_phone = false;

-- Configure JWT settings
UPDATE auth.config
SET jwt_expiry = 3600,
    refresh_token_expiry = 2592000;
```text

#### 4. Set up Row Level Security
```sql
-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE objects ENABLE ROW LEVEL SECURITY;

-- Apply RLS policies
\i database/migrations/0003_rls_policies.sql
```text

### Database Monitoring

#### 1. Performance Monitoring
```sql
-- Monitor slow queries
SELECT query, mean_time, calls, total_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Monitor index usage
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```text

#### 2. Backup Strategy
```bash
# Automated daily backups
# Configure in Supabase dashboard
# Set retention period to 30 days
# Enable point-in-time recovery
```text

## CI/CD Pipeline

### GitHub Actions

#### 1. Frontend CI/CD
```yaml
# .github/workflows/frontend.yml
name: Frontend CI/CD

on:
  push:
    branches: [main]
    paths: ['frontend/**']

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd frontend && npm ci
      - run: cd frontend && npm run test
      - run: cd frontend && npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install -g vercel
      - run: cd frontend && vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```text

#### 2. Backend CI/CD
```yaml
# .github/workflows/backend.yml
name: Backend CI/CD

on:
  push:
    branches: [main]
    paths: ['backend/**']

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd backend && npm ci
      - run: cd backend && npm run test
      - run: cd backend && npm run lint

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install -g @railway/cli
      - run: railway up --token ${{ secrets.RAILWAY_TOKEN }}
```text

## Monitoring and Logging

### 1. Application Monitoring

#### Frontend Monitoring (Vercel)
```bash
# Enable Vercel Analytics
vercel analytics enable

# Configure error tracking
vercel env add SENTRY_DSN
```text

#### Backend Monitoring (Railway)
```bash
# Enable Railway monitoring
railway monitoring enable

# Configure logging
railway variables set LOG_LEVEL=info
railway variables set LOG_FORMAT=json
```text

### 2. Database Monitoring

#### Supabase Monitoring
```sql
-- Monitor database performance
SELECT
  schemaname,
  tablename,
  n_tup_ins as inserts,
  n_tup_upd as updates,
  n_tup_del as deletes
FROM pg_stat_user_tables
ORDER BY n_tup_ins DESC;
```text

#### Alert Configuration
```bash
# Set up alerts for:
# - High CPU usage (>80%)
# - High memory usage (>90%)
# - Slow queries (>1s)
# - Connection errors
# - Disk space (>85%)
```text

### 3. Error Tracking

#### Sentry Integration
```typescript
// Frontend error tracking
import * as Sentry from '@sentry/react'

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
})

// Backend error tracking
import * as Sentry from '@sentry/node'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
})
```text

## Security Configuration

### 1. Environment Security

#### Secrets Management
```bash
# Use environment variables for secrets
# Never commit secrets to repository
# Use different secrets for each environment
# Rotate secrets regularly
```text

#### CORS Configuration
```javascript
// Backend CORS setup
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? ['https://storyloom.com', 'https://www.storyloom.com']
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  optionsSuccessStatus: 200
}
```text

### 2. Database Security

#### RLS Policies
```sql
-- Ensure all tables have RLS enabled
-- Test RLS policies thoroughly
-- Use service role key only for server-side operations
-- Use anon key for client-side operations
```text

#### Connection Security
```bash
# Use SSL connections
# Configure connection pooling
# Set connection limits
# Monitor connection usage
```text

### 3. API Security

#### Rate Limiting
```javascript
// Implement rate limiting
const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
})

app.use('/api/', limiter)
```text

#### Input Validation
```javascript
// Validate all inputs
const { body, validationResult } = require('express-validator')

const validateProject = [
  body('title').isLength({ min: 1, max: 255 }).trim(),
  body('description').optional().isLength({ max: 1000 }),
  body('target_words').isInt({ min: 0, max: 1000000 }),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  }
]
```text

## Performance Optimization

### 1. Frontend Optimization

#### Build Optimization
```bash
# Optimize bundle size
npm run build -- --analyze

# Enable compression
vercel env add ENABLE_COMPRESSION=true
```text

#### Caching Strategy
```typescript
// Implement caching
const cache = new Map()

const getCachedData = (key: string) => {
  if (cache.has(key)) {
    return cache.get(key)
  }
  return null
}
```text

### 2. Backend Optimization

#### Database Optimization
```sql
-- Create indexes for frequently queried columns
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_chapters_project_id ON chapters(project_id);
CREATE INDEX idx_chapters_last_modified ON chapters(last_modified);
```text

#### Connection Pooling
```javascript
// Configure connection pooling
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})
```text

### 3. CDN Configuration

#### Static Assets
```bash
# Configure CDN for static assets
# Enable gzip compression
# Set appropriate cache headers
# Use image optimization
```text

## Troubleshooting

### Common Issues

#### 1. Build Failures
```bash
# Check Node.js version
node --version

# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```text

#### 2. Database Connection Issues
```bash
# Check database connection
supabase status

# Verify environment variables
echo $SUPABASE_URL
echo $SUPABASE_SERVICE_ROLE_KEY
```text

#### 3. Deployment Issues
```bash
# Check deployment logs
vercel logs
railway logs

# Verify environment variables
vercel env ls
railway variables
```text

### Debugging

#### 1. Frontend Debugging
```typescript
// Enable debug mode
localStorage.setItem('debug', 'storyloom:*')

// Check network requests
// Use React DevTools
// Monitor performance
```text

#### 2. Backend Debugging
```javascript
// Enable debug logging
process.env.DEBUG = 'storyloom:*'

// Use logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`)
  next()
})
```text

#### 3. Database Debugging
```sql
-- Check active connections
SELECT * FROM pg_stat_activity;

-- Check slow queries
SELECT * FROM pg_stat_statements ORDER BY mean_time DESC;
```text

## Maintenance

### Regular Tasks

#### 1. Weekly Maintenance
- [ ] Check application logs
- [ ] Monitor database performance
- [ ] Review error reports
- [ ] Update dependencies

#### 2. Monthly Maintenance
- [ ] Security updates
- [ ] Database optimization
- [ ] Backup verification
- [ ] Performance review

#### 3. Quarterly Maintenance
- [ ] Security audit
- [ ] Dependency updates
- [ ] Architecture review
- [ ] Capacity planning

### Backup and Recovery

#### 1. Database Backups
```bash
# Automated daily backups
# Test backup restoration
# Verify backup integrity
# Store backups securely
```text

#### 2. Application Backups
```bash
# Backup configuration files
# Backup environment variables
# Backup SSL certificates
# Document recovery procedures
```text

## Scaling Considerations

### 1. Horizontal Scaling
- Use load balancers
- Implement database sharding
- Use CDN for static assets
- Implement caching layers

### 2. Vertical Scaling
- Increase server resources
- Optimize database queries
- Implement connection pooling
- Use read replicas

### 3. Cost Optimization
- Monitor resource usage
- Use auto-scaling
- Optimize database queries
- Implement caching
