import { type LoaderFunctionArgs } from '@react-router/node';
import { authenticate } from '../shopify.server';
import db from '../db.server';
import { generateInvoicePDF } from '../utils/pdf-generator';
import { generateLocalizedInvoicePDF, detectLocale, type Locale } from '../utils/pdf-generator-i18n';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  try {
    const { session } = await authenticate.admin(request);
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

  // Parse items (stored as JSON string in totalAmount field for now)
  // In production, you'd want a separate InvoiceItem table
  const items = [
    {
      title: 'Order Items',
      quantity: 1,
      price: invoice.totalAmount || '0.00',
      total: invoice.totalAmount || '0.00',
    },
  ];

  // Get locale from company settings or URL query params
  const url = new URL(request.url);
  const localeParam = url.searchParams.get('locale') as Locale | null;
  const locale = localeParam || (companySettings?.locale as Locale) || detectLocale(session.shop);

  // Generate PDF with localization
  const pdfBuffer = await generateLocalizedInvoicePDF({
    invoiceNumber: invoice.invoiceNumber,
    orderNumber: invoice.orderNumber,
    date: new Date(invoice.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    customerName: invoice.customerName || undefined,
    customerEmail: invoice.customerEmail || undefined,
    items,
    subtotal: invoice.totalAmount || '0.00',
    total: invoice.totalAmount || '0.00',
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
    },
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
