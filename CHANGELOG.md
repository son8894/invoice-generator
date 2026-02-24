# Changelog

All notable changes to Invoice Generator will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-24

### Added
- ✨ Initial release
- ✅ PDF invoice generation with PDFKit
- ✅ Multi-language support (English, Korean, Japanese)
- ✅ Admin dashboard with statistics
- ✅ Invoice list page with download functionality
- ✅ Company settings page with locale selection
- ✅ Manual invoice creation from order ID
- ✅ Automatic invoice generation webhook (pending Shopify approval)
- ✅ Locale auto-detection from shop domain
- ✅ Professional invoice templates for all languages
- ✅ Database schema with Prisma ORM
- ✅ Error handling and validation
- ✅ Onboarding guide for new users
- ✅ Welcome banner for first-time setup
- ✅ Comprehensive documentation

### Technical Details
- React Router v7 framework
- TypeScript for type safety
- Prisma + PostgreSQL database
- PDFKit for PDF generation
- Shopify Admin API integration
- Polaris web components for UI

### Documentation
- User Guide
- Deployment Guide
- Privacy Policy
- App Store Listing
- Technical README

### Known Limitations
- Email delivery not yet implemented
- Logo upload not available
- Custom templates not supported
- Bulk download not available
- CJK fonts may not render perfectly (using default Helvetica)

### Dependencies
- PDFKit: ^0.15.0
- Prisma: ^6.16.3
- React Router: ^7.12.0
- @shopify/shopify-app-react-router: ^1.1.0

---

## [Unreleased]

### Planned for v1.1
- Email delivery integration (Resend)
- Logo upload functionality
- Better CJK font support (NotoSans)
- Custom invoice templates
- Bulk PDF download
- Invoice editing

### Planned for v1.2
- More languages (French, German, Spanish)
- Invoice numbering customization
- Line item details (separate table)
- Tax breakdown display
- Invoice preview before download

### Planned for v2.0
- Custom branding options
- Advanced template designer
- Recurring invoices
- Payment tracking
- Customer portal
- Multi-currency conversion display
- Analytics dashboard

---

## Version History

| Version | Date | Status |
|---------|------|--------|
| 1.0.0 | 2026-02-24 | ✅ Released |
| 1.1.0 | TBD | 🚧 Planned |
| 1.2.0 | TBD | 🚧 Planned |
| 2.0.0 | TBD | 💭 Future |

---

## Breaking Changes

### v1.0.0
- Initial release - no breaking changes

---

## Security Updates

### v1.0.0
- Implemented input validation for order IDs
- Added error handling for all API routes
- Secure PDF generation with buffer handling
- Protected customer data compliance ready

---

## Bug Fixes

_No bug fixes yet - initial release_

---

## Notes

- **orders/create webhook**: Implemented but not active until Shopify Protected Customer Data approval
- **Database**: Uses SQLite in development, PostgreSQL in production
- **Hosting**: Optimized for Render.com Free tier
- **Monitoring**: Uptime Robot recommended to prevent sleep

---

**Current Status**: v1.0.0 - Production Ready ✅

**Next Release**: v1.1.0 (Q2 2026)
