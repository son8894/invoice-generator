import { useEffect, useState } from "react";
import type {
  ActionFunctionArgs,
  HeadersFunction,
  LoaderFunctionArgs,
} from "react-router";
import { useFetcher, useLoaderData, Link, useNavigate } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import {
  Page,
  Card,
  Button,
  Text,
  BlockStack,
  InlineStack,
  Banner,
  Badge,
  Box,
  TextField,
  Filters,
  ChoiceList,
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
  const navigate = useNavigate();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [selectedInvoices, setSelectedInvoices] = useState<Set<string>>(new Set());
  const [searchValue, setSearchValue] = useState('');

  // Order Resource Picker
  const openOrderPicker = async () => {
    try {
      const selected = await shopify.resourcePicker({
        type: 'order',
        multiple: 10,
      });

      if (selected && selected.length > 0) {
        shopify.toast.show(`Selected ${selected.length} orders. Creating invoices...`);
        console.log('Selected orders:', selected);
        
        // TODO: Call API to create invoices for selected orders
        // For now, just show success message
        setTimeout(() => {
          shopify.toast.show(`Feature coming soon! Selected ${selected.length} orders.`);
        }, 500);
      }
    } catch (error) {
      console.error('Order picker error:', error);
      shopify.toast.show('Failed to open order picker', { isError: true });
    }
  };

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

  const downloadBulk = async () => {
    if (selectedInvoices.size === 0) {
      shopify.toast.show('Please select invoices to download', { isError: true });
      return;
    }

    shopify.toast.show(`Downloading ${selectedInvoices.size} invoices...`);
    
    // Download each invoice sequentially
    for (const invoiceId of selectedInvoices) {
      const invoice = invoices.find(inv => inv.id === invoiceId);
      if (invoice) {
        await downloadPDF(invoice.id, invoice.invoiceNumber);
        await new Promise(resolve => setTimeout(resolve, 500)); // Delay between downloads
      }
    }
    
    setSelectedInvoices(new Set());
  };

  const toggleInvoiceSelection = (invoiceId: string) => {
    const newSelection = new Set(selectedInvoices);
    if (newSelection.has(invoiceId)) {
      newSelection.delete(invoiceId);
    } else {
      newSelection.add(invoiceId);
    }
    setSelectedInvoices(newSelection);
  };

  const selectAllInvoices = () => {
    if (selectedInvoices.size === invoices.length) {
      setSelectedInvoices(new Set());
    } else {
      setSelectedInvoices(new Set(invoices.map(inv => inv.id)));
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    if (!searchValue) return true;
    const search = searchValue.toLowerCase();
    return (
      invoice.invoiceNumber.toLowerCase().includes(search) ||
      invoice.orderNumber.toLowerCase().includes(search) ||
      invoice.customerName?.toLowerCase().includes(search)
    );
  });

  return (
    <Page
      title="Invoice Generator"
      primaryAction={{
        content: 'Create from Orders',
        onAction: openOrderPicker,
      }}
      secondaryActions={[
        {
          content: 'View All Invoices',
          onAction: () => navigate('/app/invoices'),
        },
        {
          content: 'Settings',
          onAction: () => navigate('/app/settings'),
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
                  {settings ? '1.' : '2.'} Click "Create from Orders" to select orders
                </Text>
                <Text as="p">
                  {settings ? '2.' : '3.'} Generate invoices automatically
                </Text>
                <Text as="p">
                  {settings ? '3.' : '4.'} Download and send to customers
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
            <InlineStack align="space-between" blockAlign="center">
              <Text as="h2" variant="headingMd">
                Recent Invoices
              </Text>
              {selectedInvoices.size > 0 && (
                <InlineStack gap="200">
                  <Badge tone="info">
                    {selectedInvoices.size} selected
                  </Badge>
                  <Button onClick={downloadBulk} variant="primary" size="slim">
                    Download Selected ({selectedInvoices.size})
                  </Button>
                </InlineStack>
              )}
            </InlineStack>

            {invoices.length > 0 && (
              <TextField
                label=""
                value={searchValue}
                onChange={setSearchValue}
                placeholder="Search by invoice #, order #, or customer name..."
                autoComplete="off"
                clearButton
                onClearButtonClick={() => setSearchValue('')}
              />
            )}

            {invoices.length > 0 && (
              <InlineStack gap="200">
                <Button onClick={selectAllInvoices} size="slim" variant="plain">
                  {selectedInvoices.size === invoices.length ? 'Deselect All' : 'Select All'}
                </Button>
              </InlineStack>
            )}

            {filteredInvoices.length === 0 && searchValue ? (
              <Text as="p" tone="subdued">
                No invoices found matching "{searchValue}"
              </Text>
            ) : filteredInvoices.length === 0 ? (
              <Text as="p" tone="subdued">
                No invoices yet. Click "Create from Orders" to generate your first invoice.
              </Text>
            ) : (
              <BlockStack gap="300">
                {filteredInvoices.map((invoice) => (
                  <Box
                    key={invoice.id}
                    padding="400"
                    borderWidth="025"
                    borderColor="border"
                    borderRadius="200"
                    background={selectedInvoices.has(invoice.id) ? 'bg-surface-selected' : undefined}
                  >
                    <InlineStack align="space-between" blockAlign="center">
                      <InlineStack gap="300" blockAlign="center">
                        <input
                          type="checkbox"
                          checked={selectedInvoices.has(invoice.id)}
                          onChange={() => toggleInvoiceSelection(invoice.id)}
                          style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                        />
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
                      </InlineStack>
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
            {filteredInvoices.length > 0 && !searchValue && (
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
