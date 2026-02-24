import type { LoaderFunctionArgs } from '@react-router/node';
import { authenticate } from '../shopify.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const { admin, session } = await authenticate.admin(request);

    // Fetch recent orders using GraphQL
    const response = await admin.graphql(`
      query getRecentOrders {
        orders(first: 50, reverse: true) {
          edges {
            node {
              id
              name
              createdAt
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
              displayFinancialStatus
            }
          }
        }
      }
    `);

    const data = await response.json();
    const orders = data.data?.orders?.edges || [];

    return Response.json({
      success: true,
      orders: orders.map((edge: any) => {
        const order = edge.node;
        return {
          id: order.id,
          name: order.name,
          orderNumber: order.name?.replace('#', ''),
          createdAt: order.createdAt,
          totalPrice: order.totalPriceSet.shopMoney.amount,
          currency: order.totalPriceSet.shopMoney.currencyCode,
          customerName: order.customer
            ? `${order.customer.firstName || ''} ${order.customer.lastName || ''}`.trim()
            : 'Guest',
          customerEmail: order.customer?.email,
          status: order.displayFinancialStatus?.toLowerCase() || 'pending',
        };
      }),
    });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return Response.json(
      { success: false, error: error.message || 'Failed to fetch orders' },
      { status: 500 }
    );
  }
};
