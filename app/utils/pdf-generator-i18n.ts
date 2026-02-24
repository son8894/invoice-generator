import PDFDocument from 'pdfkit';
import type { InvoiceData } from './pdf-generator';

export type Locale = 'en' | 'ko' | 'ja';

interface I18nStrings {
  invoice: string;
  invoiceNumber: string;
  orderNumber: string;
  date: string;
  billTo: string;
  item: string;
  quantity: string;
  price: string;
  total: string;
  subtotal: string;
  tax: string;
  shipping: string;
  thankYou: string;
  taxId: string;
  email: string;
  phone: string;
}

const translations: Record<Locale, I18nStrings> = {
  en: {
    invoice: 'INVOICE',
    invoiceNumber: 'Invoice Number',
    orderNumber: 'Order Number',
    date: 'Date',
    billTo: 'Bill To',
    item: 'Item',
    quantity: 'Qty',
    price: 'Price',
    total: 'Total',
    subtotal: 'Subtotal',
    tax: 'Tax',
    shipping: 'Shipping',
    thankYou: 'Thank you for your business!',
    taxId: 'Tax ID',
    email: 'Email',
    phone: 'Phone',
  },
  ko: {
    invoice: '세금계산서',
    invoiceNumber: '계산서 번호',
    orderNumber: '주문 번호',
    date: '발행일',
    billTo: '받는 분',
    item: '품목',
    quantity: '수량',
    price: '단가',
    total: '합계',
    subtotal: '소계',
    tax: '세금',
    shipping: '배송비',
    thankYou: '거래해 주셔서 감사합니다!',
    taxId: '사업자등록번호',
    email: '이메일',
    phone: '전화번호',
  },
  ja: {
    invoice: '請求書',
    invoiceNumber: '請求書番号',
    orderNumber: '注文番号',
    date: '発行日',
    billTo: '請求先',
    item: '品目',
    quantity: '数量',
    price: '単価',
    total: '合計',
    subtotal: '小計',
    tax: '税金',
    shipping: '送料',
    thankYou: 'お取引ありがとうございました！',
    taxId: '事業者番号',
    email: 'メール',
    phone: '電話番号',
  },
};

/**
 * Generate localized PDF invoice
 */
export async function generateLocalizedInvoicePDF(
  data: InvoiceData,
  locale: Locale = 'en'
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks: Buffer[] = [];
    const t = translations[locale];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // For Korean/Japanese, we might need a font that supports those characters
    // For now, we'll use the default font which works for English
    // In production, you'd load a font like NotoSans that supports CJK

    // Header: Company Info
    doc.fontSize(20).text(data.company.name || 'Your Company', { align: 'left' });
    doc.fontSize(10).moveDown(0.5);

    if (data.company.address) {
      doc.text(data.company.address);
    }
    if (data.company.city || data.company.postalCode) {
      doc.text(`${data.company.city || ''} ${data.company.postalCode || ''}`.trim());
    }
    if (data.company.country) {
      doc.text(data.company.country);
    }
    if (data.company.taxId) {
      doc.text(`${t.taxId}: ${data.company.taxId}`);
    }
    if (data.company.email) {
      doc.text(`${t.email}: ${data.company.email}`);
    }
    if (data.company.phone) {
      doc.text(`${t.phone}: ${data.company.phone}`);
    }

    doc.moveDown(2);

    // Invoice Title
    doc.fontSize(24).text(t.invoice, { align: 'center' });
    doc.moveDown(1);

    // Invoice Details
    doc.fontSize(10);
    const detailsX = 50;
    const detailsY = doc.y;

    doc.text(`${t.invoiceNumber}: ${data.invoiceNumber}`, detailsX, detailsY);
    doc.text(`${t.orderNumber}: ${data.orderNumber}`, detailsX, detailsY + 15);
    doc.text(`${t.date}: ${data.date}`, detailsX, detailsY + 30);

    doc.moveDown(2);

    // Bill To Section
    if (data.customerName || data.customerEmail || data.customerAddress) {
      doc.fontSize(12).text(`${t.billTo}:`, { underline: true });
      doc.fontSize(10).moveDown(0.5);

      if (data.customerName) {
        doc.text(data.customerName);
      }
      if (data.customerEmail) {
        doc.text(data.customerEmail);
      }
      if (data.customerAddress) {
        doc.text(data.customerAddress);
      }

      doc.moveDown(2);
    }

    // Items Table
    const tableTop = doc.y;
    const itemX = 50;
    const quantityX = 280;
    const priceX = 360;
    const totalX = 460;

    // Table Header
    doc.fontSize(10).font('Helvetica-Bold');
    doc.text(t.item, itemX, tableTop);
    doc.text(t.quantity, quantityX, tableTop);
    doc.text(t.price, priceX, tableTop);
    doc.text(t.total, totalX, tableTop);

    doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

    // Table Rows
    doc.font('Helvetica');
    let y = tableTop + 25;

    data.items.forEach((item) => {
      if (y > 700) {
        doc.addPage();
        y = 50;
      }

      doc.text(item.title, itemX, y, { width: 220 });
      doc.text(item.quantity.toString(), quantityX, y);
      doc.text(`${data.currency} ${item.price}`, priceX, y);
      doc.text(`${data.currency} ${item.total}`, totalX, y);

      y += 30;
    });

    // Line separator
    doc.moveTo(50, y).lineTo(550, y).stroke();
    y += 15;

    // Totals Section
    const totalsX = 400;
    doc.fontSize(10);

    doc.text(`${t.subtotal}:`, totalsX, y);
    doc.text(`${data.currency} ${data.subtotal}`, totalsX + 100, y, { align: 'right' });
    y += 20;

    if (data.tax) {
      doc.text(`${t.tax}:`, totalsX, y);
      doc.text(`${data.currency} ${data.tax}`, totalsX + 100, y, { align: 'right' });
      y += 20;
    }

    if (data.shipping) {
      doc.text(`${t.shipping}:`, totalsX, y);
      doc.text(`${data.currency} ${data.shipping}`, totalsX + 100, y, { align: 'right' });
      y += 20;
    }

    doc.font('Helvetica-Bold').fontSize(12);
    doc.text(`${t.total}:`, totalsX, y);
    doc.text(`${data.currency} ${data.total}`, totalsX + 100, y, { align: 'right' });

    // Footer
    doc.fontSize(8).font('Helvetica').moveDown(3);
    doc.text(t.thankYou, 50, doc.page.height - 100, { align: 'center' });

    doc.end();
  });
}

/**
 * Get locale from shop domain or settings
 */
export function detectLocale(shop: string): Locale {
  if (shop.includes('.jp') || shop.includes('japan')) {
    return 'ja';
  }
  if (shop.includes('.kr') || shop.includes('korea')) {
    return 'ko';
  }
  return 'en';
}
