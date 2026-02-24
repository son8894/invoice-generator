import { useEffect, useState } from "react";
import type {
  ActionFunctionArgs,
  HeadersFunction,
  LoaderFunctionArgs,
} from "react-router";
import { useFetcher, useLoaderData, Link } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { boundary } from "@shopify/shopify-app-react-router/server";
import db from "../db.server";
import { WelcomeBanner } from "../components/WelcomeBanner";
import { OnboardingGuide } from "../components/OnboardingGuide";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);

  const [invoices, settings] = await Promise.all([
    db.invoice.findMany({
      where: { shop: session.shop },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    db.companySettings.findUnique({
      where: { shop: session.shop },
    }),
  ]);

  const totalInvoices = await db.invoice.count({
    where: { shop: session.shop },
  });

  const emailsSent = await db.invoice.count({
    where: {
      shop: session.shop,
      emailSent: true,
    },
  });

  return {
    invoices,
    settings,
    stats: {
      total: totalInvoices,
      emailsSent,
    },
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session, admin } = await authenticate.admin(request);
  const formData = await request.formData();
  const actionName = formData.get('_action');

  if (actionName === 'createInvoice') {
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
      const { generateInvoiceNumber } = await import('../utils/pdf-generator');
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
      return Response.json({ error: error.message || 'Failed to create invoice' }, { status: 500 });
    }
  }

  return Response.json({ error: 'Invalid action' }, { status: 400 });
};

export default function Index() {
  const { invoices, settings, stats } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const shopify = useAppBridge();
  const [orderId, setOrderId] = useState('');

  const isLoading = fetcher.state === 'submitting';

  useEffect(() => {
    if (fetcher.data?.success) {
      shopify.toast.show('Invoice created successfully');
      setOrderId('');
    } else if (fetcher.data?.error) {
      shopify.toast.show(fetcher.data.error, { isError: true });
    }
  }, [fetcher.data, shopify]);

  return (
    <s-page heading="Invoice Generator">
      <Link to="/app/invoices" slot="primary-action">
        <s-button>View All Invoices</s-button>
      </Link>
      <Link to="/app/settings" slot="secondary-action">
        <s-button variant="secondary">Settings</s-button>
      </Link>

      {!settings && <WelcomeBanner />}

      {(!settings || stats.total === 0) && (
        <OnboardingGuide hasSettings={!!settings} totalInvoices={stats.total} />
      )}

      <s-section heading="Dashboard">
        <s-stack direction="inline" gap="base">
          <s-box
            padding="base"
            borderWidth="base"
            borderRadius="base"
            background="subdued"
            style={{ flex: 1 }}
          >
            <s-stack direction="block" gap="tight">
              <s-heading size="2xl">{stats.total}</s-heading>
              <s-text>Total Invoices</s-text>
            </s-stack>
          </s-box>
          <s-box
            padding="base"
            borderWidth="base"
            borderRadius="base"
            background="subdued"
            style={{ flex: 1 }}
          >
            <s-stack direction="block" gap="tight">
              <s-heading size="2xl">{stats.emailsSent}</s-heading>
              <s-text>Emails Sent</s-text>
            </s-stack>
          </s-box>
          <s-box
            padding="base"
            borderWidth="base"
            borderRadius="base"
            background="subdued"
            style={{ flex: 1 }}
          >
            <s-stack direction="block" gap="tight">
              <s-heading size="2xl">{invoices.length}</s-heading>
              <s-text>Recent Invoices</s-text>
            </s-stack>
          </s-box>
        </s-stack>
      </s-section>

      <s-section heading="Create Invoice Manually">
        <s-paragraph>
          Enter an order ID to manually generate an invoice. Normally, invoices
          are automatically generated when orders are created.
        </s-paragraph>
        <fetcher.Form method="post">
          <input type="hidden" name="_action" value="createInvoice" />
          <s-stack direction="inline" gap="base">
            <s-text-field
              label="Order ID"
              name="orderId"
              value={orderId}
              onChange={(e: any) => setOrderId(e.target.value)}
              placeholder="e.g., 1234567890"
              style={{ flex: 1 }}
            />
            <s-button
              type="submit"
              {...(isLoading ? { loading: true } : {})}
              disabled={!orderId || isLoading}
            >
              Generate Invoice
            </s-button>
          </s-stack>
        </fetcher.Form>
      </s-section>

      <s-section heading="Recent Invoices">
        {invoices.length === 0 ? (
          <s-paragraph>
            No invoices yet. Create your first invoice using the form above or
            wait for an order to be placed.
          </s-paragraph>
        ) : (
          <s-stack direction="block" gap="base">
            {invoices.map((invoice) => (
              <s-box
                key={invoice.id}
                padding="base"
                borderWidth="base"
                borderRadius="base"
              >
                <s-stack direction="inline" gap="base" alignment="space-between">
                  <s-stack direction="block" gap="tight">
                    <s-heading size="sm">{invoice.invoiceNumber}</s-heading>
                    <s-text>
                      Order #{invoice.orderNumber} • {invoice.customerName || 'No customer'} •{' '}
                      {invoice.currency} {invoice.totalAmount}
                    </s-text>
                    <s-text size="sm" tone="subdued">
                      {new Date(invoice.createdAt).toLocaleDateString()}
                    </s-text>
                  </s-stack>
                  <s-stack direction="inline" gap="tight">
                    {invoice.emailSent && (
                      <s-badge tone="success">Email Sent</s-badge>
                    )}
                    <a
                      href={`/api/invoices/${invoice.id}/download`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <s-button variant="secondary" size="sm">
                        Download PDF
                      </s-button>
                    </a>
                  </s-stack>
                </s-stack>
              </s-box>
            ))}
          </s-stack>
        )}
        {invoices.length > 0 && (
          <Link to="/app/invoices">
            <s-button variant="tertiary">View All Invoices →</s-button>
          </Link>
        )}
      </s-section>

      <s-section slot="aside" heading="Getting Started">
        <s-unordered-list>
          <s-list-item>
            <Link to="/app/settings">
              Configure company settings
            </Link>
          </s-list-item>
          <s-list-item>
            Create a test invoice using the form above
          </s-list-item>
          <s-list-item>
            Download and review the PDF invoice
          </s-list-item>
          <s-list-item>
            Invoices will be automatically generated for new orders
          </s-list-item>
        </s-unordered-list>
      </s-section>

      <s-section slot="aside" heading="About">
        <s-paragraph>
          This app automatically generates PDF invoices for your Shopify orders.
          Customize your company information, invoice templates, and email settings.
        </s-paragraph>
      </s-section>
    </s-page>
  );
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
