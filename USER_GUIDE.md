# Invoice Generator - User Guide

Complete guide to using Invoice Generator for your Shopify store.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Dashboard](#dashboard)
3. [Creating Invoices](#creating-invoices)
4. [Managing Invoices](#managing-invoices)
5. [Settings](#settings)
6. [Multi-Language Support](#multi-language-support)
7. [FAQ](#faq)
8. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Installation

1. Visit the Shopify App Store
2. Search for "Invoice Generator"
3. Click "Add app"
4. Click "Install" on your store
5. Authorize the app to access your orders

### First Time Setup

After installation, you'll see a welcome banner:

1. **Click "Configure Settings"**
2. Fill in your company information:
   - Company name (required)
   - Address
   - City and postal code
   - Country
   - Tax ID / Business number
   - Contact email and phone
3. **Select invoice language** (English, Korean, or Japanese)
4. Click "Save Settings"

**That's it!** You're ready to generate invoices.

---

## Dashboard

The Dashboard is your home base for Invoice Generator.

### What You'll See

**Statistics Cards:**
- **Total Invoices**: How many invoices you've generated
- **Emails Sent**: Number of invoices emailed (coming soon)
- **Recent Invoices**: Number of invoices in the last 10 items

**Manual Invoice Creation:**
- Enter an order ID
- Click "Generate Invoice"
- Invoice appears instantly

**Recent Invoices:**
- Last 10 invoices
- Quick download access
- Email sent status

---

## Creating Invoices

### Automatic Creation (Coming Soon)

Once approved by Shopify, invoices will be created automatically when:
- A new order is placed
- Payment is confirmed
- Order is created manually

Until then, use manual creation.

### Manual Creation

1. Go to **Dashboard**
2. Find the **"Create Invoice Manually"** section
3. Enter an **Order ID**
   - Example: `1234567890`
   - Find order IDs in Shopify Admin → Orders
4. Click **"Generate Invoice"**
5. Success! Invoice appears in the list

**Tips:**
- Order ID is a numeric value (not order name like #1001)
- Find it in the URL: `.../orders/1234567890`
- Can create invoices for any past order

---

## Managing Invoices

### Viewing All Invoices

1. Click **"Invoices"** in the navigation
2. See complete list of all invoices

**Information Shown:**
- Invoice number (e.g., INV-1001-123456)
- Order number
- Customer name
- Total amount and currency
- Creation date
- Email sent status

### Downloading PDFs

**From Dashboard:**
1. Find invoice in "Recent Invoices"
2. Click "Download PDF" button
3. PDF opens in new tab or downloads

**From Invoice List:**
1. Go to Invoices page
2. Click "Download PDF" on any invoice
3. PDF is ready instantly

**PDF Contents:**
- Your company information
- Invoice number and date
- Customer details
- Order items
- Total amount
- "Thank you" message

---

## Settings

Configure your company information and preferences.

### Company Information

**Required:**
- **Company Name**: Appears at top of invoice

**Optional:**
- **Address**: Street address
- **City**: City name
- **Postal Code**: ZIP/postal code
- **Country**: Country name
- **Tax ID**: Business/VAT number
- **Email**: Contact email
- **Phone**: Contact phone number

### Invoice Language

Choose the language for your invoice PDFs:

**English:**
- Standard international format
- "INVOICE" heading
- English field labels

**한국어 (Korean):**
- Korean invoice format
- "세금계산서" heading
- Korean field labels
- Perfect for Korean B2B customers

**日本語 (Japanese):**
- Japanese invoice format
- "請求書" heading
- Japanese field labels
- Ideal for Japanese market

**To Change Language:**
1. Go to Settings
2. Select language from dropdown
3. Click "Save Settings"
4. New invoices use new language
5. Old invoices keep their original language

---

## Multi-Language Support

### Automatic Language Detection

If you don't set a language, Invoice Generator automatically detects:
- `.kr` domains → Korean
- `.jp` domains → Japanese
- All others → English

### Language-Specific Features

**English:**
- "Invoice Number", "Date", "Bill To"
- "Item", "Quantity", "Price", "Total"
- "Thank you for your business!"

**Korean:**
- "계산서 번호", "발행일", "받는 분"
- "품목", "수량", "단가", "합계"
- "거래해 주셔서 감사합니다!"

**Japanese:**
- "請求書番号", "発行日", "請求先"
- "品目", "数量", "単価", "合計"
- "お取引ありがとうございました！"

### Changing Language for One Invoice

Download URL supports language override:
```
/api/invoices/123/download?locale=ko
/api/invoices/123/download?locale=ja
/api/invoices/123/download?locale=en
```

---

## FAQ

### Q: How much does it cost?
**A:** $39/month after 7-day free trial. Unlimited invoices.

### Q: Can I use this for B2C customers?
**A:** Yes! Works for both B2B and B2C orders.

### Q: What currencies are supported?
**A:** All Shopify currencies. Currency code appears on invoice.

### Q: Can I customize the invoice template?
**A:** Currently no. Custom templates coming in future update.

### Q: Can I add my logo?
**A:** Logo upload coming in next version. For now, company name appears.

### Q: Can I edit an existing invoice?
**A:** No. Generate a new invoice if order details changed.

### Q: What happens to invoices when I uninstall?
**A:** All data is deleted within 30 days of uninstall.

### Q: Can I export invoices in bulk?
**A:** Bulk download coming soon. For now, download individually.

### Q: Do you send invoices via email?
**A:** Email sending is in development. Currently download-only.

### Q: Is there a mobile app?
**A:** No, but the web interface works on mobile browsers.

### Q: Can I use this on Shopify Basic plan?
**A:** Yes! Works on all Shopify plans.

---

## Troubleshooting

### Problem: "Order not found"
**Solution:**
- Check order ID is correct (numeric only)
- Verify order exists in your store
- Make sure you have permission to view orders

### Problem: PDF won't download
**Solution:**
- Check browser allows pop-ups
- Try different browser
- Clear browser cache
- Check internet connection

### Problem: Invoice shows wrong company info
**Solution:**
- Go to Settings
- Update information
- Save settings
- Regenerate invoice

### Problem: Language not showing correctly
**Solution:**
- Korean/Japanese may use default font
- Characters should still be readable
- Custom fonts coming in update

### Problem: "Invoice already exists"
**Solution:**
- You already created invoice for this order
- Go to Invoices list to find it
- Can't create duplicate invoices

### Problem: Settings won't save
**Solution:**
- Make sure Company Name is filled (required)
- Check internet connection
- Try again
- Contact support if persists

---

## Getting Help

### Support Channels

**Email Support:**
- Email: thss2641@gmail.com
- Response time: Within 48 hours
- Include: Store name, problem description, screenshots

**GitHub Issues:**
- Report bugs: https://github.com/son8894/invoice-generator/issues
- Feature requests welcome
- Open source community

**Shopify Partners:**
- General Shopify help: https://help.shopify.com
- App listing: Shopify App Store

### Before Contacting Support

1. Check this guide
2. Review FAQ section
3. Try basic troubleshooting
4. Gather information:
   - Store name
   - Order ID (if relevant)
   - Error message (screenshot)
   - Steps to reproduce

---

## Tips & Best Practices

### For Best Results

1. **Fill all company information** - Complete invoices look more professional
2. **Choose correct language** - Match your customer's language
3. **Keep settings updated** - Update when business info changes
4. **Generate invoices regularly** - Don't wait, do it right after order
5. **Download important invoices** - Keep local backup if needed

### For International Stores

- Use English for international customers
- Use Korean for Korean market
- Use Japanese for Japanese market
- Company info can be in any language

### For B2B Customers

- Include Tax ID in company settings
- Use business address
- Professional email and phone
- Generate invoices immediately

---

## What's Coming Next

**Planned Features:**
- Email delivery integration
- Logo upload
- Custom invoice templates
- Bulk download
- Invoice editing
- More languages (French, German, Spanish)
- Invoice numbering customization
- Line item details
- Tax breakdown

**Want to request a feature?**
Email us at thss2561@gmail.com

---

## About Invoice Generator

**Developer:** 손준혁 (Son Jun-hyeok)  
**Location:** South Korea  
**Platform:** Shopify  
**Version:** 1.0  
**Last Updated:** February 24, 2026  

---

**Thank you for using Invoice Generator!** 🎉

We're committed to helping you streamline your invoice generation process.

If you find this app helpful, please leave a review on the Shopify App Store!
