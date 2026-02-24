import { type LoaderFunctionArgs } from '@react-router/node';
import { authenticate } from '../shopify.server';
import db from '../db.server';
import { generateProfessionalInvoicePDF, detectLocale, type Locale } from '../utils/pdf-generator-pro';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  try {
    const { session, admin } = await authenticate.admin(request);
    const { id } = params;

    if (!id) {
      return new Response('Invoice ID is required', { status: 400 });
    }

    // Get invoice
    const invoice = await db.invoice.findFirst({
      where: {
        id,
        shop: session.shop,
      },
    });

    if (!invoice) {
      return new Response('Invoice not found', { status: 404 });
    }

    // Get company settings
    const companySettings = await db.companySettings.findUnique({
      where: { shop: session.shop },
    });

    // Use data from database (populated by webhook or manual entry)
    let items = [];
    let subtotal = invoice.subtotal || invoice.totalAmount || '0.00';
    let tax = invoice.taxAmount || undefined;
    let taxRate = invoice.taxRate ? parseFloat(invoice.taxRate) : undefined;
    let shipping = invoice.shippingAmount || undefined;
    let total = invoice.totalAmount || '0.00';
    let customerAddress = invoice.customerAddress || undefined;

    // Parse line items from JSON
    if (invoice.lineItems) {
      try {
        items = JSON.parse(invoice.lineItems);
      } catch (error) {
        console.error('Failed to parse line items:', error);
        items = [{
          title: `Order #${invoice.orderNumber}`,
          quantity: 1,
          price: total,
          total,
        }];
      }
    } else {
      // Fallback if no line items
      items = [{
        title: `Order #${invoice.orderNumber}`,
        quantity: 1,
        price: total,
        total,
      }];
    }

    // Get locale
    const url = new URL(request.url);
    const localeParam = url.searchParams.get('locale') as Locale | null;
    const locale = localeParam || (companySettings?.locale as Locale) || detectLocale(session.shop);

    // Generate professional PDF
    const pdfBuffer = await generateProfessionalInvoicePDF({
      invoiceNumber: invoice.invoiceNumber,
      orderNumber: invoice.orderNumber,
      date: new Date(invoice.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      customerName: invoice.customerName || undefined,
      customerEmail: invoice.customerEmail || undefined,
      customerAddress: customerAddress,
      items,
      subtotal,
      tax,
      taxRate,
      shipping,
      total,
      currency: invoice.currency || 'USD',
      company: {
        name: companySettings?.companyName || 'Your Company',
        address: companySettings?.address || undefined,
        city: companySettings?.city || undefined,
        postalCode: companySettings?.postalCode || undefined,
        country: companySettings?.country || undefined,
        taxId: companySettings?.taxId || undefined,
        email: companySettings?.email || undefined,
        phone: companySettings?.phone || undefined,
        logoPath: companySettings?.logoUrl || undefined,
      },
      paymentTerms: companySettings?.paymentTerms || undefined,
    }, locale);

    // Return PDF
    return new Response(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${invoice.invoiceNumber}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error('Error generating PDF:', error);
    return new Response(`Failed to generate PDF: ${error.message}`, { status: 500 });
  }
};
