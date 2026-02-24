import type { LoaderFunctionArgs } from '@react-router/node';
import { authenticate } from '../shopify.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const { admin } = await authenticate.admin(request);

    // Fetch recent orders
    const response = await admin.rest.get({
      path: 'orders.json',
      query: {
        status: 'any',
        limit: '50',
        fields: 'id,name,created_at,total_price,currency,customer,financial_status',
      },
    });

    const orders = response.body?.orders || [];

    return Response.json({
      success: true,
      orders: orders.map((order: any) => ({
        id: order.id,
        name: order.name,
        orderNumber: order.name?.replace('#', ''),
        createdAt: order.created_at,
        totalPrice: order.total_price,
        currency: order.currency,
        customerName: order.customer
          ? `${order.customer.first_name || ''} ${order.customer.last_name || ''}`.trim()
          : 'Guest',
        customerEmail: order.customer?.email,
        status: order.financial_status,
      })),
    });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
};
