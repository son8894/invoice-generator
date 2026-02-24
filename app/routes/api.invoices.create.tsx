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

  try {
    let order: any;

    // Try to fetch by Order Number first (e.g., #1008 or 1008)
    const orderNumber = orderIdInput.replace('#', '');
    
    // Search by order name (GraphQL)
    const graphqlQuery = `
      query getOrderByName($query: String!) {
        orders(first: 1, query: $query) {
          edges {
            node {
              id
              legacyResourceId
              name
              totalPriceSet {
                shopMoney {
                  amount
                  currencyCode
                }
              }
              customer {
                firstName
                lastName
                email
              }
            }
          }
        }
      }
    `;

    const graphqlResponse = await admin.graphql(graphqlQuery, {
      variables: {
        query: `name:#${orderNumber}`,
      },
    });

    const graphqlData = await graphqlResponse.json();

    if (graphqlData?.data?.orders?.edges?.length > 0) {
      // Found order by number
      const gqlOrder = graphqlData.data.orders.edges[0].node;
      const legacyId = gqlOrder.legacyResourceId;

      // Fetch full order details via REST API
      const restResponse = await admin.rest.get({
        path: `orders/${legacyId}`,
      });

      if (restResponse.body?.order) {
        order = restResponse.body.order;
      }
    } else {
      // Try direct ID lookup (if user provided internal ID)
      if (/^\d+$/.test(orderIdInput)) {
        const restResponse = await admin.rest.get({
          path: `orders/${orderIdInput}`,
        });

        if (restResponse.body?.order) {
          order = restResponse.body.order;
        }
      }
    }

    if (!order) {
      return Response.json({ 
        error: 'Order not found. Please enter a valid order number (e.g., 1008) or order ID.' 
      }, { status: 404 });
    }

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
