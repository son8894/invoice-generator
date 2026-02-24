import PDFDocument from 'pdfkit';
import type { Readable } from 'stream';

export interface CompanyInfo {
  name?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  taxId?: string;
  email?: string;
  phone?: string;
}

export interface OrderItem {
  title: string;
  quantity: number;
  price: string;
  total: string;
}

export interface InvoiceData {
  invoiceNumber: string;
  orderNumber: string;
  date: string;
  customerName?: string;
  customerEmail?: string;
  customerAddress?: string;
  items: OrderItem[];
  subtotal: string;
  tax?: string;
  shipping?: string;
  total: string;
  currency: string;
  company: CompanyInfo;
}

/**
 * Generate PDF invoice as a Buffer
 */
export async function generateInvoicePDF(data: InvoiceData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

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
      doc.text(`Tax ID: ${data.company.taxId}`);
    }
    if (data.company.email) {
      doc.text(`Email: ${data.company.email}`);
    }
    if (data.company.phone) {
      doc.text(`Phone: ${data.company.phone}`);
    }

    doc.moveDown(2);

    // Invoice Title
    doc.fontSize(24).text('INVOICE', { align: 'center' });
    doc.moveDown(1);

    // Invoice Details
    doc.fontSize(10);
    const detailsX = 50;
    const detailsY = doc.y;
    
    doc.text(`Invoice Number: ${data.invoiceNumber}`, detailsX, detailsY);
    doc.text(`Order Number: ${data.orderNumber}`, detailsX, detailsY + 15);
    doc.text(`Date: ${data.date}`, detailsX, detailsY + 30);

    doc.moveDown(2);

    // Bill To Section
    if (data.customerName || data.customerEmail || data.customerAddress) {
      doc.fontSize(12).text('Bill To:', { underline: true });
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
    doc.text('Item', itemX, tableTop);
    doc.text('Qty', quantityX, tableTop);
    doc.text('Price', priceX, tableTop);
    doc.text('Total', totalX, tableTop);

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

    doc.text('Subtotal:', totalsX, y);
    doc.text(`${data.currency} ${data.subtotal}`, totalsX + 100, y, { align: 'right' });
    y += 20;

    if (data.tax) {
      doc.text('Tax:', totalsX, y);
      doc.text(`${data.currency} ${data.tax}`, totalsX + 100, y, { align: 'right' });
      y += 20;
    }

    if (data.shipping) {
      doc.text('Shipping:', totalsX, y);
      doc.text(`${data.currency} ${data.shipping}`, totalsX + 100, y, { align: 'right' });
      y += 20;
    }

    doc.font('Helvetica-Bold').fontSize(12);
    doc.text('Total:', totalsX, y);
    doc.text(`${data.currency} ${data.total}`, totalsX + 100, y, { align: 'right' });

    // Footer
    doc.fontSize(8).font('Helvetica').moveDown(3);
    doc.text(
      'Thank you for your business!',
      50,
      doc.page.height - 100,
      { align: 'center' }
    );

    doc.end();
  });
}

/**
 * Generate invoice number based on order number
 */
export function generateInvoiceNumber(orderNumber: string): string {
  const timestamp = Date.now().toString().slice(-6);
  return `INV-${orderNumber}-${timestamp}`;
}

/**
 * Format date for invoice
 */
export function formatInvoiceDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
