import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs';

export type Locale = 'en' | 'ko' | 'ja';

interface InvoiceItem {
  title: string;
  quantity: number;
  price: string;
  total: string;
}

interface CompanyInfo {
  name?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  taxId?: string;
  email?: string;
  phone?: string;
  logoPath?: string;
}

export interface InvoiceData {
  invoiceNumber: string;
  orderNumber: string;
  date: string;
  customerName?: string;
  customerEmail?: string;
  customerAddress?: string;
  items: InvoiceItem[];
  subtotal: string;
  tax?: string;
  taxRate?: number;
  shipping?: string;
  total: string;
  currency: string;
  company: CompanyInfo;
  paymentTerms?: string;
}

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
  paymentTerms: string;
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
    paymentTerms: 'Payment due within 30 days',
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
    tax: '부가세',
    shipping: '배송비',
    thankYou: '거래해 주셔서 감사합니다!',
    taxId: '사업자등록번호',
    email: '이메일',
    phone: '전화번호',
    paymentTerms: '결제 기한: 발행일로부터 30일 이내',
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
    tax: '消費税',
    shipping: '送料',
    thankYou: 'お取引ありがとうございました！',
    taxId: '事業者番号',
    email: 'メール',
    phone: '電話番号',
    paymentTerms: 'お支払期限：発行日より30日以内',
  },
};

/**
 * Detect if text contains Korean or Japanese characters
 */
function detectCJKLanguage(text: string): 'ko' | 'ja' | null {
  const koreanRegex = /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/;
  const japaneseRegex = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/;
  
  if (koreanRegex.test(text)) return 'ko';
  if (japaneseRegex.test(text)) return 'ja';
  return null;
}

/**
 * Detect CJK language from invoice data
 */
function detectCJKFromInvoice(invoiceData: InvoiceData): 'ko' | 'ja' | null {
  const allText = [
    invoiceData.customerName || '',
    invoiceData.customerAddress || '',
    ...invoiceData.items.map(item => item.title),
    invoiceData.company.name || '',
    invoiceData.company.address || '',
  ].join(' ');
  
  return detectCJKLanguage(allText);
}

/**
 * Register CJK fonts (Regular + Bold)
 */
function registerCJKFonts(doc: PDFKit.PDFDocument, locale: 'ko' | 'ja'): boolean {
  try {
    const basePath = path.join(process.cwd(), 'app', 'fonts');
    
    if (locale === 'ko') {
      const regularPath = path.join(basePath, 'NotoSansKR.ttf');
      const boldPath = path.join(basePath, 'NotoSansKR-Bold.ttf');
      
      if (fs.existsSync(regularPath) && fs.existsSync(boldPath)) {
        doc.registerFont('NotoSansKR', regularPath);
        doc.registerFont('NotoSansKR-Bold', boldPath);
        console.log('✅ Korean fonts loaded (Regular + Bold)');
        return true;
      } else {
        console.warn('⚠️ Korean fonts not found');
      }
    }
    
    if (locale === 'ja') {
      const regularPath = path.join(basePath, 'NotoSansJP.ttf');
      const boldPath = path.join(basePath, 'NotoSansJP-Bold.ttf');
      
      if (fs.existsSync(regularPath) && fs.existsSync(boldPath)) {
        doc.registerFont('NotoSansJP', regularPath);
        doc.registerFont('NotoSansJP-Bold', boldPath);
        console.log('✅ Japanese fonts loaded (Regular + Bold)');
        return true;
      } else {
        console.warn('⚠️ Japanese fonts not found');
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error loading fonts:', error);
    return false;
  }
}

/**
 * Generate professional PDF invoice with CJK support
 */
export async function generateProfessionalInvoicePDF(
  data: InvoiceData,
  locale: Locale = 'en'
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ 
      size: 'A4', 
      margin: 50,
      bufferPages: true,
    });
    const chunks: Buffer[] = [];
    const t = translations[locale];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Auto-detect CJK from invoice data if locale is English
    let detectedLocale: 'ko' | 'ja' | null = null;
    if (locale === 'en') {
      detectedLocale = detectCJKFromInvoice(data);
      if (detectedLocale) {
        console.log(`🔍 Auto-detected ${detectedLocale === 'ko' ? 'Korean' : 'Japanese'} text`);
      }
    } else if (locale === 'ko') {
      detectedLocale = 'ko';
    } else if (locale === 'ja') {
      detectedLocale = 'ja';
    }

    // Register CJK fonts if needed
    const useCJKFont = detectedLocale !== null;
    if (useCJKFont && detectedLocale) {
      registerCJKFonts(doc, detectedLocale);
    }

    // Helper function to set font
    const setFont = (style: 'regular' | 'bold' = 'regular') => {
      if (useCJKFont && detectedLocale === 'ko') {
        doc.font(style === 'bold' ? 'NotoSansKR-Bold' : 'NotoSansKR');
      } else if (useCJKFont && detectedLocale === 'ja') {
        doc.font(style === 'bold' ? 'NotoSansJP-Bold' : 'NotoSansJP');
      } else {
        doc.font(style === 'bold' ? 'Helvetica-Bold' : 'Helvetica');
      }
    };

    // Initial font
    setFont('regular');

    const primaryColor = '#4F46E5';
    const lightGray = '#F3F4F6';
    const darkGray = '#374151';
    const mediumGray = '#6B7280';

    // HEADER
    const headerHeight = 140;
    doc.rect(0, 0, doc.page.width, headerHeight).fill(primaryColor);

    const logoY = 30;
    const logoX = 50;

    // Company Name
    doc.fillColor('white');
    doc.fontSize(18);
    setFont('bold');
    doc.text(data.company.name || 'Your Company', logoX, logoY, { width: 250 });
    
    doc.fontSize(9);
    setFont('regular');
    doc.moveDown(0.3);
    const addressX = logoX;
    const addressY = doc.y;
    
    if (data.company.address) doc.text(data.company.address, addressX, addressY);
    if (data.company.city || data.company.postalCode) {
      doc.text(`${data.company.city || ''} ${data.company.postalCode || ''}`.trim());
    }
    if (data.company.country) doc.text(data.company.country);
    if (data.company.taxId) doc.text(`${t.taxId}: ${data.company.taxId}`);

    // INVOICE Title
    doc.fontSize(28);
    setFont('bold');
    doc.fillColor('white');
    doc.text(t.invoice, 350, 40, { align: 'right' });

    // Invoice Details
    doc.fontSize(10);
    setFont('regular');
    doc.fillColor('white');
    doc.text(`${t.invoiceNumber}: ${data.invoiceNumber}`, 350, 85, { align: 'right' });
    doc.text(`${t.orderNumber}: ${data.orderNumber}`, 350, 100, { align: 'right' });
    doc.text(`${t.date}: ${data.date}`, 350, 115, { align: 'right' });

    doc.fillColor(darkGray);

    // BILL TO
    const billToY = headerHeight + 30;
    doc.fontSize(11);
    setFont('bold');
    doc.fillColor(darkGray);
    doc.text(t.billTo, 50, billToY);

    doc.fontSize(10);
    setFont('regular');
    doc.fillColor(mediumGray);
    doc.moveDown(0.5);
    if (data.customerName) doc.text(data.customerName, 50);
    if (data.customerEmail) doc.text(data.customerEmail);
    if (data.customerAddress) doc.text(data.customerAddress);

    doc.moveDown(1.5);

    // ITEMS TABLE
    const tableTop = doc.y;
    const itemX = 50;
    const quantityX = 320;
    const priceX = 400;
    const totalX = 480;

    doc.rect(50, tableTop - 5, 500, 25).fill(lightGray);
    
    doc.fontSize(10);
    setFont('bold');
    doc.fillColor(darkGray);
    doc.text(t.item, itemX, tableTop + 5);
    doc.text(t.quantity, quantityX, tableTop + 5, { width: 70, align: 'center' });
    doc.text(t.price, priceX, tableTop + 5, { width: 70, align: 'right' });
    doc.text(t.total, totalX, tableTop + 5, { width: 70, align: 'right' });

    let y = tableTop + 35;
    setFont('regular');
    doc.fillColor(darkGray);

    data.items.forEach((item, index) => {
      if (y > 700) {
        doc.addPage();
        y = 50;
      }

      if (index % 2 === 0) {
        doc.rect(50, y - 5, 500, 30).fill('#FAFAFA');
      }

      doc.fillColor(darkGray);
      doc.text(item.title, itemX, y, { width: 260 });
      doc.text(item.quantity.toString(), quantityX, y, { width: 70, align: 'center' });
      doc.text(`${data.currency} ${item.price}`, priceX, y, { width: 70, align: 'right' });
      doc.text(`${data.currency} ${item.total}`, totalX, y, { width: 70, align: 'right' });

      y += 30;
    });

    doc.moveTo(50, y + 5).lineTo(550, y + 5).stroke('#E5E7EB');
    y += 25;

    // TOTALS
    const totalsLabelX = 380;
    const totalsValueX = 480;

    doc.fontSize(10);
    setFont('regular');
    doc.fillColor(mediumGray);

    doc.text(t.subtotal + ':', totalsLabelX, y);
    doc.text(`${data.currency} ${data.subtotal}`, totalsValueX, y, { width: 70, align: 'right' });
    y += 20;

    if (data.tax) {
      const taxLabel = data.taxRate 
        ? `${t.tax} (${(data.taxRate * 100).toFixed(0)}%):`
        : `${t.tax}:`;
      doc.text(taxLabel, totalsLabelX, y);
      doc.text(`${data.currency} ${data.tax}`, totalsValueX, y, { width: 70, align: 'right' });
      y += 20;
    }

    if (data.shipping) {
      doc.text(t.shipping + ':', totalsLabelX, y);
      doc.text(`${data.currency} ${data.shipping}`, totalsValueX, y, { width: 70, align: 'right' });
      y += 20;
    }

    doc.fontSize(12);
    setFont('bold');
    doc.fillColor(darkGray);
    doc.rect(totalsLabelX - 10, y - 5, 180, 30).fill(lightGray);
    doc.fillColor(primaryColor);
    doc.text(t.total + ':', totalsLabelX, y + 5);
    doc.text(`${data.currency} ${data.total}`, totalsValueX, y + 5, { width: 70, align: 'right' });

    // FOOTER
    const footerY = doc.page.height - 100;
    
    doc.fontSize(9);
    setFont('regular');
    doc.fillColor(mediumGray);
    doc.text(t.thankYou, 50, footerY, { align: 'center' });
    
    const paymentTermsText = data.paymentTerms || t.paymentTerms;
    doc.text(paymentTermsText, 50, footerY + 15, { align: 'center' });

    if (data.company.email || data.company.phone) {
      let footerContact = [];
      if (data.company.email) footerContact.push(`${t.email}: ${data.company.email}`);
      if (data.company.phone) footerContact.push(`${t.phone}: ${data.company.phone}`);
      doc.fontSize(8).text(footerContact.join(' | '), 50, footerY + 30, { align: 'center' });
    }

    doc.end();
  });
}

export function detectLocale(shop: string): Locale {
  if (shop.includes('.jp') || shop.includes('japan')) {
    return 'ja';
  }
  if (shop.includes('.kr') || shop.includes('korea')) {
    return 'ko';
  }
  return 'en';
}
