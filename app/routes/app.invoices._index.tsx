import { useState } from 'react';
import type { LoaderFunctionArgs } from '@react-router/node';
import { useLoaderData } from 'react-router';
import { useAppBridge } from '@shopify/app-bridge-react';
import {
  Page,
  Card,
  EmptyState,
  Badge,
  Button,
  DataTable,
  BlockStack,
  Banner,
} from '@shopify/polaris';
import { authenticate } from '../shopify.server';
import db from '../db.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);

  const invoices = await db.invoice.findMany({
    where: { shop: session.shop },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return { invoices };
};

export default function InvoicesIndex() {
  const { invoices } = useLoaderData<typeof loader>();
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

  const rows = invoices.map((invoice) => [
    invoice.invoiceNumber,
    invoice.orderNumber,
    invoice.customerName || '-',
    `${invoice.currency} ${invoice.totalAmount}`,
    new Date(invoice.createdAt).toLocaleDateString(),
    invoice.emailSent ? (
      <Badge tone="success">Sent</Badge>
    ) : (
      <Badge tone="info">Not sent</Badge>
    ),
    <Button
      size="slim"
      onClick={() => downloadPDF(invoice.id, invoice.invoiceNumber)}
      loading={downloadingId === invoice.id}
    >
      Download
    </Button>,
  ]);

  return (
    <Page
      title="Invoices"
      subtitle="View and manage all your invoices"
      primaryAction={{
        content: 'Settings',
        url: '/app/settings',
      }}
      backAction={{ url: '/app' }}
    >
      <BlockStack gap="500">
        <Banner tone="info">
          <p>
            Invoices are automatically generated when orders are created.
            Configure your company information in Settings to customize your invoices.
          </p>
        </Banner>

        <Card padding="0">
          {invoices.length === 0 ? (
            <EmptyState
              heading="No invoices yet"
              image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
            >
              <p>
                Invoices will be automatically generated when orders are created.
                Make sure to configure your company settings first.
              </p>
              <div style={{ marginTop: '16px' }}>
                <Button url="/app/settings">Go to Settings</Button>
              </div>
            </EmptyState>
          ) : (
            <DataTable
              columnContentTypes={[
                'text',
                'text',
                'text',
                'text',
                'text',
                'text',
                'text',
              ]}
              headings={[
                'Invoice #',
                'Order #',
                'Customer',
                'Total',
                'Date',
                'Email Status',
                'Actions',
              ]}
              rows={rows}
            />
          )}
        </Card>
      </BlockStack>
    </Page>
  );
}
