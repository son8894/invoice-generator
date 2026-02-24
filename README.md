# Invoice Generator for Shopify

> Automatically generate professional PDF invoices for Shopify orders with multi-language support (English, Korean, Japanese)

[![Shopify App](https://img.shields.io/badge/Shopify-App-7AB55C?logo=shopify)](https://www.shopify.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React Router](https://img.shields.io/badge/React_Router-7-red?logo=react-router)](https://reactrouter.com/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## 🎯 Features

- ✅ **Automatic PDF Generation** - Create invoices automatically for new orders
- ✅ **Multi-Language Support** - English, Korean (한국어), Japanese (日本語)
- ✅ **Customizable** - Add company logo, address, tax ID
- ✅ **One-Click Download** - Download any invoice as PDF instantly
- ✅ **Clean Dashboard** - View statistics and manage invoices easily
- ✅ **Manual Creation** - Generate invoices for existing orders anytime
- ✅ **Professional Templates** - Clean, business-ready invoice designs
- ✅ **B2B Ready** - Perfect for Plus stores and wholesale businesses

## 📸 Screenshots

_Screenshots coming soon after app deployment_

## 🚀 Quick Start

### For Merchants

1. Install from [Shopify App Store](#) (link coming soon)
2. Configure your company information
3. Start generating invoices automatically!

See [User Guide](USER_GUIDE.md) for detailed instructions.

### For Developers

See [Development Setup](#development) below.

## 📋 Requirements

- Shopify store (any plan)
- Node.js >= 20.19 or >= 22.12
- Shopify Partners account (for development)

## 🛠️ Development

### Prerequisites

```bash
node --version  # v20.19+ or v22.12+
npm --version   # 9+
```

### Installation

1. **Clone repository**
```bash
git clone https://github.com/son8894/invoice-generator.git
cd invoice-generator
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your Shopify credentials
```

4. **Setup database**
```bash
npm run prisma migrate dev
```

5. **Start development server**
```bash
npm run dev
```

6. **Open in browser**
```
https://admin.shopify.com/store/YOUR_DEV_STORE/apps/YOUR_APP_ID?dev-console=show
```

### Project Structure

```
invoice-generator/
├── app/
│   ├── routes/              # React Router routes
│   │   ├── app._index.tsx   # Dashboard
│   │   ├── app.invoices._index.tsx  # Invoice list
│   │   ├── app.settings.tsx         # Settings page
│   │   ├── api.invoices.create.tsx  # Create API
│   │   └── api.invoices.$id.download.tsx  # Download API
│   ├── components/          # React components
│   └── utils/               # Utilities
│       ├── pdf-generator.ts       # PDF generation
│       └── pdf-generator-i18n.ts  # Multi-language support
├── prisma/
│   └── schema.prisma        # Database schema
├── public/                  # Static assets
└── shopify.app.toml         # Shopify app config
```

## 🗄️ Database Schema

```prisma
model CompanySettings {
  id          String   @id @default(cuid())
  shop        String   @unique
  companyName String?
  address     String?
  city        String?
  postalCode  String?
  country     String?
  taxId       String?
  email       String?
  phone       String?
  logoUrl     String?
  locale      String?  @default("en")
}

model Invoice {
  id              String   @id @default(cuid())
  shop            String
  orderId         String
  orderNumber     String
  invoiceNumber   String   @unique
  customerName    String?
  customerEmail   String?
  totalAmount     String?
  currency        String?
  createdAt       DateTime @default(now())
  emailSent       Boolean  @default(false)
}
```

## 🌍 Multi-Language Support

### Supported Languages

| Language | Code | Status |
|----------|------|--------|
| English | `en` | ✅ Ready |
| Korean (한국어) | `ko` | ✅ Ready |
| Japanese (日本語) | `ja` | ✅ Ready |
| French | `fr` | 🚧 Planned |
| German | `de` | 🚧 Planned |
| Spanish | `es` | 🚧 Planned |

### Adding New Languages

See [i18n Guide](docs/I18N.md) for instructions on adding new languages.

## 📦 Deployment

### Production Deployment

See [Deployment Guide](DEPLOYMENT.md) for complete step-by-step instructions.

**Quick Summary:**

1. **Database**: Neon PostgreSQL (Singapore)
2. **Hosting**: Render.com (Free or Starter tier)
3. **Monitoring**: Uptime Robot (optional)

### Environment Variables

```bash
SHOPIFY_API_KEY=your_api_key
SHOPIFY_API_SECRET=your_api_secret
SCOPES=read_orders,write_orders
DATABASE_URL=postgresql://...
NODE_ENV=production
```

## 🧪 Testing

### Run Tests

```bash
npm test
```

### Manual Testing Checklist

- [ ] Install app on dev store
- [ ] Configure company settings
- [ ] Create test order
- [ ] Generate invoice
- [ ] Download PDF
- [ ] Test all 3 languages
- [ ] Verify PDF content

## 📚 Documentation

- [User Guide](USER_GUIDE.md) - For merchants
- [Deployment Guide](DEPLOYMENT.md) - For deployment
- [App Store Listing](APP_STORE_LISTING.md) - Marketing copy
- [Privacy Policy](PRIVACY_POLICY.md) - Privacy information
- [Technical Docs](README_INVOICE_GENERATOR.md) - Technical details

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

## 🐛 Bug Reports

Found a bug? Please [open an issue](https://github.com/son8894/invoice-generator/issues/new) with:
- Description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)

## 💬 Support

- **Email**: thss2641@gmail.com
- **Issues**: [GitHub Issues](https://github.com/son8894/invoice-generator/issues)
- **Response Time**: Within 48 hours

## 🗺️ Roadmap

### v1.0 (Current)
- [x] PDF generation
- [x] Multi-language support (en/ko/ja)
- [x] Manual invoice creation
- [x] Admin dashboard
- [x] Company settings

### v1.1 (Planned)
- [ ] Email delivery integration
- [ ] Logo upload
- [ ] Custom invoice templates
- [ ] Bulk download
- [ ] Invoice editing

### v2.0 (Future)
- [ ] More languages (French, German, Spanish)
- [ ] Custom branding
- [ ] Advanced templates
- [ ] Recurring invoices
- [ ] Payment tracking
- [ ] Customer portal

## ⚙️ Tech Stack

- **Framework**: [React Router v7](https://reactrouter.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [Prisma](https://www.prisma.io/) + PostgreSQL
- **PDF**: [PDFKit](https://pdfkit.org/)
- **Hosting**: [Render.com](https://render.com/)
- **Platform**: [Shopify](https://www.shopify.com/)

## 📊 Statistics

- **Development Time**: ~12 hours
- **Lines of Code**: ~2,500
- **Dependencies**: 20+
- **Supported Languages**: 3
- **Database Models**: 4

## 👤 Author

**손준혁 (Son Jun-hyeok)**

- Email: thss2641@gmail.com
- GitHub: [@son8894](https://github.com/son8894)
- Location: South Korea

## 🙏 Acknowledgments

- Shopify for the amazing platform
- React Router team for the framework
- PDFKit for PDF generation
- All contributors and users

---

**Made with ❤️ in South Korea**

If you find this helpful, please ⭐ star the repository!

---

**Status**: ✅ Ready for production  
**Last Updated**: February 24, 2026  
**Version**: 1.0.0
