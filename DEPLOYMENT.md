# Invoice Generator - Deployment Guide

Complete step-by-step guide to deploy Invoice Generator to production.

## Prerequisites

- Shopify Partners account
- GitHub account
- Neon account (PostgreSQL)
- Render account (hosting)
- Domain name (optional, for email)

---

## Phase 1: Pre-Deployment Checklist

### 1. Local Testing ✓
- [x] Run dev server successfully
- [x] Configure company settings
- [x] Create test invoice
- [x] Download PDF (all 3 languages)
- [x] Verify PDF content is correct

### 2. Code Quality ✓
- [x] TypeScript compilation passes
- [x] No console errors
- [x] Error handling in place
- [x] Loading states implemented

---

## Phase 2: Database Setup (Neon PostgreSQL)

### Step 1: Create Database

1. Go to https://console.neon.tech
2. Click "Create Project"
3. Settings:
   - **Project Name**: `invoice-generator`
   - **Region**: `ap-southeast-1` (Singapore)
   - **PostgreSQL Version**: 16 (latest)
4. Click "Create Project"

### Step 2: Get Connection String

1. In project dashboard, go to "Connection Details"
2. Copy connection string (Pooled connection)
3. Format: `postgresql://user:password@host:5432/neondb?sslmode=require`
4. Save this for later (Render environment variables)

### Step 3: Update Database Provider

Update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

---

## Phase 3: GitHub Setup

### Step 1: Create Repository

1. Go to https://github.com/new
2. Settings:
   - **Repository name**: `invoice-generator`
   - **Description**: "Shopify Invoice Generator App - Auto PDF generation with multi-language support"
   - **Visibility**: Private (or Public)
3. Click "Create repository"

### Step 2: Push Code

```bash
cd C:\Users\82102\.openclaw\workspace\invoice-generator

# Initialize git
git init

# Add files
git add .

# Commit
git commit -m "Initial commit: Invoice Generator v1.0"

# Add remote
git remote add origin https://github.com/son8894/invoice-generator.git

# Push
git branch -M main
git push -u origin main
```

---

## Phase 4: Render Deployment

### Step 1: Create Web Service

1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect GitHub account if not connected
4. Select `son8894/invoice-generator` repository
5. Settings:
   - **Name**: `invoice-generator`
   - **Region**: `Singapore (Southeast Asia)`
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run docker-start`
   - **Plan**: `Free` (or `Starter` for better performance)

### Step 2: Environment Variables

Add the following environment variables in Render dashboard:

```bash
# Shopify Configuration
SHOPIFY_API_KEY=e0fc18ec6f715444e2ebf252b0f1982f
SHOPIFY_API_SECRET=[GET FROM PARTNERS DASHBOARD]
SCOPES=read_orders,write_orders

# Database
DATABASE_URL=[NEON CONNECTION STRING FROM PHASE 2]

# Node
NODE_ENV=production
```

### Step 3: Get Shopify API Secret

1. Go to https://partners.shopify.com/5879223922/apps
2. Click "ctrl+ainvoice-generator"
3. Go to "Configuration" → "Client credentials"
4. Copy "Client secret"
5. Paste into Render `SHOPIFY_API_SECRET`

### Step 4: Deploy

1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Copy service URL: `https://invoice-generator.onrender.com`

---

## Phase 5: Shopify App Configuration

### Step 1: Update App URLs

1. Go to Partners Dashboard → Apps → invoice-generator
2. Update "App URL": `https://invoice-generator.onrender.com`
3. Update "Allowed redirection URL(s)":
   ```
   https://invoice-generator.onrender.com/api/auth
   https://invoice-generator.onrender.com/api/auth/callback
   ```
4. Click "Save"

### Step 2: Test Production App

1. Go to dev store: `https://admin.shopify.com/store/sonsapp-dev`
2. Install production app
3. Configure settings
4. Create test invoice
5. Download and verify PDF

---

## Phase 6: Monitoring Setup (Optional but Recommended)

### Uptime Robot

1. Go to https://uptimerobot.com
2. Click "Add New Monitor"
3. Settings:
   - **Monitor Type**: HTTP(s)
   - **Friendly Name**: Invoice Generator
   - **URL**: `https://invoice-generator.onrender.com`
   - **Monitoring Interval**: 5 minutes
4. Click "Create Monitor"

**Why?** Prevents Render Free tier from sleeping (15 min inactivity)

---

## Phase 7: App Store Submission

### Step 1: Prepare Materials

1. **Screenshots** (5 required):
   - Dashboard overview
   - Invoice list page
   - Settings page
   - PDF invoice (English)
   - PDF invoice (Korean or Japanese)

2. **App Listing**:
   - Copy from `APP_STORE_LISTING.md`
   - Fill in all fields in Partners Dashboard

3. **Privacy Policy**:
   - Create simple privacy policy page
   - Upload to GitHub Pages or use generator
   - Example: https://www.privacypolicygenerator.info/

### Step 2: Submit for Review

1. Go to Partners Dashboard → Apps → invoice-generator
2. Click "Create app listing"
3. Fill in all required fields
4. Upload screenshots
5. Add privacy policy URL
6. Click "Submit for review"

### Step 3: Review Process

- **Duration**: 1-2 weeks typically
- **Protected Customer Data**: Request approval for `orders/create` webhook
- **Respond quickly**: Check email daily (thss2641@gmail.com)
- **Be available**: Shopify may ask questions

---

## Phase 8: Post-Approval

### Step 1: Enable Webhook

Once approved, update `shopify.app.toml`:

```toml
[[webhooks.subscriptions]]
topics = [ "orders/create" ]
uri = "/webhooks/orders/create"
```

Commit and push to GitHub. Render auto-deploys.

### Step 2: Launch

1. Set app to "Public"
2. Publish app listing
3. Share on social media
4. Monitor reviews

---

## Troubleshooting

### Database Connection Fails
- Check `DATABASE_URL` format
- Verify Neon project is active
- Check IP allowlist (Neon allows all by default)

### Build Fails on Render
- Check build logs
- Verify `package.json` scripts are correct
- Make sure all dependencies are listed

### App Won't Load in Shopify
- Check App URL is correct
- Verify redirect URLs are set
- Check Render service is running

### Webhook Not Firing
- Verify webhook is registered in Partners Dashboard
- Check Render logs for errors
- Make sure Protected Customer Data is approved

---

## Maintenance

### Updating the App

```bash
# Make changes locally
git add .
git commit -m "Description of changes"
git push

# Render auto-deploys from main branch
```

### Monitoring

- Check Render dashboard daily
- Monitor error logs
- Respond to user reviews
- Update based on feedback

---

## Production Checklist

Before going live, verify:

- [x] Database migrated to PostgreSQL
- [x] Environment variables set
- [x] App URLs updated
- [x] Production deployment tested
- [x] Screenshots taken
- [x] App listing written
- [x] Privacy policy created
- [x] Submitted for review
- [ ] Protected customer data approved
- [ ] Webhook enabled (after approval)
- [ ] Monitoring enabled
- [ ] Backup plan in place

---

## Support

- **Email**: thss2641@gmail.com
- **GitHub**: https://github.com/son8894/invoice-generator
- **Shopify Partners**: https://partners.shopify.com/5879223922

---

**Last Updated**: 2026-02-24  
**Status**: Ready for deployment
