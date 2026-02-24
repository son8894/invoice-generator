import { useState } from 'react';
import type { LoaderFunctionArgs } from '@react-router/node';
import { useLoaderData, useNavigate } from 'react-router';
import { useAppBridge } from '@shopify/app-bridge-react';
import {
  Page,
  Card,
  EmptyState,
  Badge,
  Button,
  BlockStack,
  Banner,
  Box,
  InlineStack,
  Text,
  TextField,
} from '@shopify/polaris';
import { authenticate } from '../shopify.server';
import db from '../db.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);

  const invoices = await db.invoice.findMany({
    where: { shop: session.shop },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  return { invoices };
};

export default function InvoicesIndex() {
  const { invoices } = useLoaderData<typeof loader>();
  const shopify = useAppBridge();
  const navigate = useNavigate();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [selectedInvoices, setSelectedInvoices] = useState<Set<string>>(new Set());
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'sent' | 'not-sent'>('all');

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
        throw new Error(`Download failed: ${response.statusText}`);
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
    
    for (const invoiceId of selectedInvoices) {
      const invoice = invoices.find(inv => inv.id === invoiceId);
      if (invoice) {
        await downloadPDF(invoice.id, invoice.invoiceNumber);
        await new Promise(resolve => setTimeout(resolve, 500));
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
    if (selectedInvoices.size === filteredInvoices.length) {
      setSelectedInvoices(new Set());
    } else {
      setSelectedInvoices(new Set(filteredInvoices.map(inv => inv.id)));
    }
  };

  // Filter invoices
  const filteredInvoices = invoices.filter(invoice => {
    // Search filter
    if (searchValue) {
      const search = searchValue.toLowerCase();
      const matchesSearch = 
        invoice.invoiceNumber.toLowerCase().includes(search) ||
        invoice.orderNumber.toLowerCase().includes(search) ||
        invoice.customerName?.toLowerCase().includes(search);
      if (!matchesSearch) return false;
    }

    // Status filter
    if (statusFilter === 'sent' && !invoice.emailSent) return false;
    if (statusFilter === 'not-sent' && invoice.emailSent) return false;

    return true;
  });

  return (
    <Page
      title="All Invoices"
      subtitle={`${invoices.length} total invoices`}
      primaryAction={{
        content: 'Create from Orders',
        onAction: openOrderPicker,
      }}
      secondaryActions={[
        {
          content: 'Settings',
          onAction: () => navigate('/app/settings'),
        },
      ]}
      backAction={{ onAction: () => navigate('/app') }}
    >
      <BlockStack gap="500">
        <Banner tone="info">
          <p>
            Select multiple orders from the "Create from Orders" button to generate invoices in bulk.
            Use checkboxes to download multiple PDFs at once.
          </p>
        </Banner>

        <Card>
          <BlockStack gap="400">
            {/* Search and Filter */}
            <InlineStack gap="300" align="space-between">
              <div style={{ flex: 1, maxWidth: '400px' }}>
                <TextField
                  label=""
                  value={searchValue}
                  onChange={setSearchValue}
                  placeholder="Search invoices..."
                  autoComplete="off"
                  clearButton
                  onClearButtonClick={() => setSearchValue('')}
                />
              </div>
              <InlineStack gap="200">
                <Button
                  pressed={statusFilter === 'all'}
                  onClick={() => setStatusFilter('all')}
                  size="slim"
                >
                  All
                </Button>
                <Button
                  pressed={statusFilter === 'sent'}
                  onClick={() => setStatusFilter('sent')}
                  size="slim"
                >
                  Sent
                </Button>
                <Button
                  pressed={statusFilter === 'not-sent'}
                  onClick={() => setStatusFilter('not-sent')}
                  size="slim"
                >
                  Not Sent
                </Button>
              </InlineStack>
            </InlineStack>

            {/* Bulk Actions */}
            {filteredInvoices.length > 0 && (
              <InlineStack align="space-between" blockAlign="center">
                <InlineStack gap="200">
                  <Button onClick={selectAllInvoices} size="slim" variant="plain">
                    {selectedInvoices.size === filteredInvoices.length ? 'Deselect All' : 'Select All'}
                  </Button>
                  {selectedInvoices.size > 0 && (
                    <Badge tone="info">
                      {selectedInvoices.size} selected
                    </Badge>
                  )}
                </InlineStack>
                {selectedInvoices.size > 0 && (
                  <Button onClick={downloadBulk} variant="primary" size="slim">
                    Download Selected ({selectedInvoices.size})
                  </Button>
                )}
              </InlineStack>
            )}

            {/* Invoice List */}
            {filteredInvoices.length === 0 && searchValue ? (
              <EmptyState
                heading="No invoices found"
                image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
              >
                <p>Try adjusting your search or filters</p>
              </EmptyState>
            ) : filteredInvoices.length === 0 ? (
              <EmptyState
                heading="No invoices yet"
                image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
              >
                <p>
                  Click "Create from Orders" to select orders and generate invoices.
                  Make sure to configure your company settings first.
                </p>
                <div style={{ marginTop: '16px' }}>
                  <InlineStack gap="200" align="center">
                    <Button onClick={openOrderPicker}>Create from Orders</Button>
                    <Button url="/app/settings">Settings</Button>
                  </InlineStack>
                </div>
              </EmptyState>
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
                          <InlineStack gap="200" blockAlign="center">
                            <Text as="h3" variant="headingSm">
                              {invoice.invoiceNumber}
                            </Text>
                            {invoice.emailSent && (
                              <Badge tone="success">Sent</Badge>
                            )}
                          </InlineStack>
                          <Text as="p">
                            Order #{invoice.orderNumber} • {invoice.customerName || 'No customer'}
                          </Text>
                          <InlineStack gap="300">
                            <Text as="p" tone="subdued" variant="bodySm">
                              {invoice.currency} {invoice.totalAmount}
                            </Text>
                            <Text as="p" tone="subdued" variant="bodySm">
                              •
                            </Text>
                            <Text as="p" tone="subdued" variant="bodySm">
                              {new Date(invoice.createdAt).toLocaleDateString()}
                            </Text>
                          </InlineStack>
                        </BlockStack>
                      </InlineStack>
                      <InlineStack gap="200" align="end">
                        <Button
                          variant="secondary"
                          size="slim"
                          onClick={() => downloadPDF(invoice.id, invoice.invoiceNumber)}
                          loading={downloadingId === invoice.id}
                        >
                          {downloadingId === invoice.id ? 'Generating...' : 'Download'}
                        </Button>
                      </InlineStack>
                    </InlineStack>
                  </Box>
                ))}
              </BlockStack>
            )}
          </BlockStack>
        </Card>
      </BlockStack>
    </Page>
  );
}
