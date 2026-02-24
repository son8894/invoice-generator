import { json } from 'react-router';
import type { LoaderFunctionArgs } from '@react-router/node';
import { useLoaderData, Link } from 'react-router';
import { authenticate } from '../shopify.server';
import db from '../db.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);

  const invoices = await db.invoice.findMany({
    where: { shop: session.shop },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return json({ invoices });
};

export default function InvoicesIndex() {
  const { invoices } = useLoaderData<typeof loader>();

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Invoices</h1>
        <Link
          to="/app/settings"
          style={{
            padding: '10px 20px',
            backgroundColor: '#5C6AC4',
            color: 'white',
            borderRadius: '4px',
            textDecoration: 'none',
          }}
        >
          Settings
        </Link>
      </div>

      {invoices.length === 0 ? (
        <div style={{ 
          padding: '40px', 
          textAlign: 'center', 
          backgroundColor: '#f5f5f5', 
          borderRadius: '8px' 
        }}>
          <p style={{ fontSize: '16px', color: '#666' }}>
            No invoices yet. Invoices will be automatically generated when orders are created.
          </p>
          <p style={{ fontSize: '14px', color: '#999', marginTop: '10px' }}>
            Make sure to configure your company settings first.
          </p>
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e5e5' }}>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Invoice #</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Order #</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Customer</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Total</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Date</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Email</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id} style={{ borderBottom: '1px solid #e5e5e5' }}>
                <td style={{ padding: '12px' }}>{invoice.invoiceNumber}</td>
                <td style={{ padding: '12px' }}>{invoice.orderNumber}</td>
                <td style={{ padding: '12px' }}>{invoice.customerName || '-'}</td>
                <td style={{ padding: '12px' }}>
                  {invoice.currency} {invoice.totalAmount}
                </td>
                <td style={{ padding: '12px' }}>
                  {new Date(invoice.createdAt).toLocaleDateString()}
                </td>
                <td style={{ padding: '12px' }}>
                  {invoice.emailSent ? (
                    <span style={{ color: 'green' }}>✓ Sent</span>
                  ) : (
                    <span style={{ color: '#999' }}>Not sent</span>
                  )}
                </td>
                <td style={{ padding: '12px' }}>
                  <a
                    href={`/api/invoices/${invoice.id}/download`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#5C6AC4',
                      color: 'white',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      fontSize: '14px',
                    }}
                  >
                    Download PDF
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
        <p style={{ fontSize: '14px', color: '#666' }}>
          <strong>Note:</strong> Invoices are automatically generated when orders are created. 
          Configure your company information in Settings to customize your invoices.
        </p>
      </div>
    </div>
  );
}
