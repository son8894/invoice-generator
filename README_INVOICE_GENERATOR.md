# Invoice Generator - Shopify App

Automatically generate professional PDF invoices for Shopify orders with multi-language support.

## Features

✅ **Auto-generate PDF invoices** when orders are created  
✅ **Multi-language support**: English, Korean (한국어), Japanese (日本語)  
✅ **Customizable company info**: Logo, address, tax ID, contact details  
✅ **Manual invoice creation**: Generate invoices for existing orders  
✅ **Download PDFs**: One-click download from admin dashboard  
✅ **Clean admin UI**: Easy-to-use dashboard and settings page

## Tech Stack

- **Framework**: React Router v7
- **Database**: Prisma + PostgreSQL (Neon)
- **PDF Generation**: PDFKit
- **Hosting**: Render.com (Free tier)
- **Language**: TypeScript

## Project Structure

```
invoice-generator/
├── app/
│   ├── routes/
│   │   ├── app._index.tsx              # Dashboard (stats, recent invoices, manual creation)
│   │   ├── app.invoices._index.tsx     # Invoice list page
│   │   ├── app.settings.tsx            # Company settings page
│   │   ├── api.invoices.create.tsx     # Manual invoice creation API
│   │   ├── api.invoices.$id.download.tsx # PDF download API
│   │   └── webhooks.orders.create.tsx  # Webhook handler (auto-create invoices)
│   └── utils/
│       ├── pdf-generator.ts            # Basic PDF generation
│       └── pdf-generator-i18n.ts       # Multi-language PDF templates
├── prisma/
│   └── schema.prisma                   # Database schema (4 models)
└── shopify.app.toml                    # App configuration
```

## Database Schema

### CompanySettings
- Company name, address, city, postal code, country
- Tax ID, email, phone
- Logo URL
- **locale**: Invoice language (en/ko/ja)

### Invoice
- Invoice number, order number, order ID
- Customer name, email
- Total amount, currency
- PDF URL
- Email sent status

### EmailLog
- Email delivery tracking
- Status, error messages
- Sent timestamp

## Development

### Prerequisites
- Node.js >= 20.19 or >= 22.12
- Shopify Partners account
- Dev store

### Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
SHOPIFY_API_KEY=your_api_key
SHOPIFY_API_SECRET=your_api_secret
SCOPES=read_orders,write_orders
```

3. Run Prisma migrations:
```bash
npm run prisma migrate dev
```

4. Start dev server:
```bash
npm run dev
```

### Testing Manually

1. **Configure Company Settings**
   - Go to Settings page
   - Fill in company information
   - Select invoice language (English/Korean/Japanese)
   - Save

2. **Create Test Invoice**
   - Go to Dashboard
   - Enter an existing order ID
   - Click "Generate Invoice"
   - Invoice appears in "Recent Invoices"

3. **Download PDF**
   - Click "Download PDF" button
   - Review the generated invoice

## Deployment

### 1. Neon Database Setup

1. Go to https://neon.tech
2. Create new project: `invoice-generator`
3. Copy connection string
4. Add to Render environment variables: `DATABASE_URL`

### 2. Render Deployment

1. Create new Web Service
2. Connect GitHub repository
3. Settings:
   - **Region**: Singapore
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run docker-start`

4. Environment Variables:
```
DATABASE_URL=postgresql://...
SHOPIFY_API_KEY=e0fc18ec6f715444e2ebf252b0f1982f
SHOPIFY_API_SECRET=(from Partners Dashboard)
SCOPES=read_orders,write_orders
NODE_ENV=production
```

### 3. Uptime Robot (Optional)

- Create HTTP(s) monitor
- URL: https://invoice-generator.onrender.com
- Interval: 5 minutes (prevents Free tier sleep)

## App Store Submission

### Before Submitting

1. ✅ Test all features on dev store
2. ✅ Configure company settings
3. ✅ Generate test invoices
4. ✅ Download and verify PDFs
5. ✅ Test all 3 languages (en/ko/ja)

### Submission Checklist

- [ ] App deployed to Render
- [ ] Screenshots prepared (3-5 images)
- [ ] App description written
- [ ] Privacy policy URL added
- [ ] Support email configured
- [ ] **Note**: Request `orders/create` webhook approval during submission

### Protected Customer Data

The `orders/create` webhook requires **protected customer data access**.

**Current Status**: Disabled in dev environment (causes errors)

**To Enable**:
1. Submit app to Shopify App Store
2. Request "Protected customer data access" approval
3. Once approved, add webhook to `shopify.app.toml`:

```toml
[[webhooks.subscriptions]]
topics = [ "orders/create" ]
uri = "/webhooks/orders/create"
```

**Workaround**: Use manual invoice creation from Dashboard until approved

## Features Roadmap

### Phase 1 (Current) ✅
- [x] PDF generation
- [x] Multi-language support (en/ko/ja)
- [x] Admin dashboard
- [x] Company settings
- [x] Manual invoice creation

### Phase 2 (Future)
- [ ] Email delivery (Resend integration)
- [ ] Custom templates (upload own design)
- [ ] Logo upload
- [ ] Line item details (separate table)
- [ ] Invoice preview before download
- [ ] Bulk download
- [ ] Invoice numbering customization

## Pricing Strategy

**Target**: Plus stores ($2K+/month merchants)  
**Pricing**: $29-49/month  
**Competitors**: Order Printer Pro ($39), Sufio ($49)  
**Differentiation**: Korean/Japanese templates, simple setup, clean UI

## Support

**Developer**: 손준혁  
**Email**: thss2641@gmail.com  
**Partners Dashboard**: https://partners.shopify.com/5879223922/apps

## License

Private - Not for distribution

---

**Last Updated**: 2026-02-24  
**Status**: ✅ Core features complete, ready for testing
