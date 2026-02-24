import { useEffect, useState } from "react";
import type {
  ActionFunctionArgs,
  HeadersFunction,
  LoaderFunctionArgs,
} from "react-router";
import { useFetcher, useLoaderData, Link } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import {
  Page,
  Card,
  Button,
  Text,
  BlockStack,
  InlineStack,
  Banner,
  Spinner,
  Badge,
  Box,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { boundary } from "@shopify/shopify-app-react-router/server";
import db from "../db.server";

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

export default function Index() {
  const { invoices, settings, stats } = useLoaderData<typeof loader>();
  const shopify = useAppBridge();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const downloadPDF = async (invoiceId: string, invoiceNumber: string) => {
    try {
      setDownloadingId(invoiceId);
      shopify.toast.show('Generating PDF...');
      
      const response = await fetch(`/app/invoices/${invoiceId}/download`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/pdf',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Download failed: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${invoiceNumber}.pdf`;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 100);
      
      shopify.toast.show('PDF downloaded successfully');
    } catch (err: any) {
      console.error('Download failed:', err);
      shopify.toast.show(`Failed to download PDF: ${err.message}`, { isError: true });
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <Page
      title="Invoice Generator"
      primaryAction={{
        content: 'View All Invoices',
        url: '/app/invoices',
      }}
      secondaryActions={[
        {
          content: 'Settings',
          url: '/app/settings',
        },
      ]}
    >
      <BlockStack gap="500">
        {!settings && (
          <Banner title="Welcome to Invoice Generator!" tone="info">
            <p>
              Get started by configuring your company settings. This will ensure your invoices
              include all necessary business information.
            </p>
          </Banner>
        )}

        {(!settings || stats.total === 0) && (
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">
                Getting Started
              </Text>
              <BlockStack gap="200">
                {!settings && (
                  <Text as="p">
                    <Link to="/app/settings" style={{ textDecoration: 'underline' }}>
                      1. Configure company settings
                    </Link>
                  </Text>
                )}
                <Text as="p">
                  {settings ? '1.' : '2.'} Create a test order in your store
                </Text>
                <Text as="p">
                  {settings ? '2.' : '3.'} Invoice will be generated automatically
                </Text>
                <Text as="p">
                  {settings ? '3.' : '4.'} Download and review the PDF
                </Text>
              </BlockStack>
            </BlockStack>
          </Card>
        )}

        <Card>
          <BlockStack gap="400">
            <Text as="h2" variant="headingMd">
              Dashboard
            </Text>
            <InlineStack gap="400">
              <Box
                padding="400"
                background="bg-surface-secondary"
                borderRadius="200"
                minWidth="200px"
              >
                <BlockStack gap="200">
                  <Text as="h3" variant="heading2xl">
                    {stats.total}
                  </Text>
                  <Text as="p" tone="subdued">
                    Total Invoices
                  </Text>
                </BlockStack>
              </Box>
              <Box
                padding="400"
                background="bg-surface-secondary"
                borderRadius="200"
                minWidth="200px"
              >
                <BlockStack gap="200">
                  <Text as="h3" variant="heading2xl">
                    {stats.emailsSent}
                  </Text>
                  <Text as="p" tone="subdued">
                    Emails Sent
                  </Text>
                </BlockStack>
              </Box>
              <Box
                padding="400"
                background="bg-surface-secondary"
                borderRadius="200"
                minWidth="200px"
              >
                <BlockStack gap="200">
                  <Text as="h3" variant="heading2xl">
                    {invoices.length}
                  </Text>
                  <Text as="p" tone="subdued">
                    Recent Invoices
                  </Text>
                </BlockStack>
              </Box>
            </InlineStack>
          </BlockStack>
        </Card>

        <Card>
          <BlockStack gap="400">
            <Text as="h2" variant="headingMd">
              Automatic Invoice Generation
            </Text>
            <Text as="p">
              Invoices are automatically generated when orders are created.
              To test this feature, create a test order in your store and the invoice will be
              generated automatically.
            </Text>
            <Banner tone="info">
              Manual invoice creation requires additional API permissions.
              For now, invoices are created automatically via webhook when orders are placed.
            </Banner>
          </BlockStack>
        </Card>

        <Card>
          <BlockStack gap="400">
            <Text as="h2" variant="headingMd">
              Recent Invoices
            </Text>
            {invoices.length === 0 ? (
              <Text as="p" tone="subdued">
                No invoices yet. Create a test order in your store to generate your first invoice.
              </Text>
            ) : (
              <BlockStack gap="300">
                {invoices.map((invoice) => (
                  <Box
                    key={invoice.id}
                    padding="400"
                    borderWidth="025"
                    borderColor="border"
                    borderRadius="200"
                  >
                    <InlineStack align="space-between" blockAlign="center">
                      <BlockStack gap="200">
                        <Text as="h3" variant="headingSm">
                          {invoice.invoiceNumber}
                        </Text>
                        <Text as="p">
                          Order #{invoice.orderNumber} • {invoice.customerName || 'No customer'} •{' '}
                          {invoice.currency} {invoice.totalAmount}
                        </Text>
                        <Text as="p" tone="subdued" variant="bodySm">
                          {new Date(invoice.createdAt).toLocaleDateString()}
                        </Text>
                      </BlockStack>
                      <InlineStack gap="200" align="end">
                        {invoice.emailSent && (
                          <Badge tone="success">Email Sent</Badge>
                        )}
                        <Button
                          variant="secondary"
                          size="slim"
                          onClick={() => downloadPDF(invoice.id, invoice.invoiceNumber)}
                          loading={downloadingId === invoice.id}
                        >
                          {downloadingId === invoice.id ? 'Generating...' : 'Download PDF'}
                        </Button>
                      </InlineStack>
                    </InlineStack>
                  </Box>
                ))}
              </BlockStack>
            )}
            {invoices.length > 0 && (
              <Box paddingBlockStart="300">
                <Link to="/app/invoices">
                  <Button variant="plain">View All Invoices →</Button>
                </Link>
              </Box>
            )}
          </BlockStack>
        </Card>
      </BlockStack>
    </Page>
  );
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
