import type { ActionFunctionArgs } from '@react-router/node';
import { authenticate } from '../shopify.server';
import db from '../db.server';
import { generateInvoiceNumber } from '../utils/pdf-generator';

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session, admin } = await authenticate.admin(request);

  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  const formData = await request.formData();
  const orderIdInput = formData.get('orderId') as string;

  if (!orderIdInput) {
    return Response.json({ error: 'Order ID is required' }, { status: 400 });
  }

  // Validate order ID format (numeric)
  if (!/^\d+$/.test(orderIdInput)) {
    return Response.json({ error: 'Invalid order ID format. Please enter a numeric order ID.' }, { status: 400 });
  }

  try {
    // Fetch order from Shopify
    const response = await admin.rest.get({
      path: `orders/${orderIdInput}`,
    });

    if (!response.body || !response.body.order) {
      return Response.json({ error: 'Order not found. Please check the order ID.' }, { status: 404 });
    }

    const order = response.body.order as any;

    // Check if invoice already exists
    const existingInvoice = await db.invoice.findFirst({
      where: {
        shop: session.shop,
        orderId: order.id.toString(),
      },
    });

    if (existingInvoice) {
      return Response.json({
        error: 'Invoice already exists for this order',
        invoice: existingInvoice,
      }, { status: 400 });
    }

    // Generate invoice number
    const invoiceNumber = generateInvoiceNumber(order.order_number || order.id.toString());

    // Create invoice
    const invoice = await db.invoice.create({
      data: {
        shop: session.shop,
        orderId: order.id.toString(),
        orderNumber: order.order_number?.toString() || order.name,
        invoiceNumber,
        customerName: order.customer
          ? `${order.customer.first_name || ''} ${order.customer.last_name || ''}`.trim()
          : null,
        customerEmail: order.customer?.email || null,
        totalAmount: order.total_price,
        currency: order.currency,
        emailSent: false,
      },
    });

    return Response.json({
      success: true,
      invoice,
      message: 'Invoice created successfully',
    });
  } catch (error: any) {
    console.error('Error creating invoice:', error);
    return Response.json({
      error: error.message || 'Failed to create invoice',
    }, { status: 500 });
  }
};
