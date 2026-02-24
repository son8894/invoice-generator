import type { ActionFunctionArgs } from "@react-router/node";
import { authenticate } from "../shopify.server";
import db from "../db.server";
import { generateInvoiceNumber } from "../utils/pdf-generator";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { topic, shop, session, admin, payload } =
    await authenticate.webhook(request);

  if (!admin || !session) {
    // Unauthenticated webhook
    throw new Response();
  }

  console.log(`Received ${topic} webhook for ${shop}`);

  try {
    const order = payload as any;

    // Check if invoice already exists
    const existingInvoice = await db.invoice.findFirst({
      where: {
        shop,
        orderId: order.id.toString(),
      },
    });

    if (existingInvoice) {
      console.log(`Invoice already exists for order ${order.id}`);
      throw new Response();
    }

    // Generate invoice number
    const invoiceNumber = generateInvoiceNumber(
      order.order_number?.toString() || order.id.toString()
    );

    // Create invoice
    const invoice = await db.invoice.create({
      data: {
        shop,
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

    console.log(`Invoice ${invoiceNumber} created for order ${order.id}`);

    // TODO: Send email with invoice PDF attachment (optional)
    // This requires email service integration (e.g., Resend, SendGrid)

    throw new Response();
  } catch (error) {
    console.error("Error processing orders/create webhook:", error);
    throw new Response();
  }
};
