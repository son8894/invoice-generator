import { json, redirect } from 'react-router';
import type { LoaderFunctionArgs, ActionFunctionArgs } from '@react-router/node';
import { useLoaderData, Form, useActionData, useNavigation } from 'react-router';
import { authenticate } from '../shopify.server';
import db from '../db.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);

  const settings = await db.companySettings.findUnique({
    where: { shop: session.shop },
  });

  return json({ settings, shop: session.shop });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const { session } = await authenticate.admin(request);
    const formData = await request.formData();

    const companyName = formData.get('companyName') as string;

    // Validation
    if (!companyName || companyName.trim() === '') {
      return json({ 
        success: false, 
        error: 'Company name is required' 
      }, { status: 400 });
    }

    const data = {
      companyName: companyName.trim(),
      address: formData.get('address') as string,
      city: formData.get('city') as string,
      postalCode: formData.get('postalCode') as string,
      country: formData.get('country') as string,
      taxId: formData.get('taxId') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      locale: formData.get('locale') as string || 'en',
    };

    await db.companySettings.upsert({
      where: { shop: session.shop },
      create: {
        shop: session.shop,
        ...data,
      },
      update: data,
    });

    return json({ success: true, message: 'Settings saved successfully!' });
  } catch (error: any) {
    console.error('Error saving settings:', error);
    return json({ 
      success: false, 
      error: `Failed to save settings: ${error.message}` 
    }, { status: 500 });
  }
};

export default function Settings() {
  const { settings } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  return (
    <div style={{ padding: '20px', maxWidth: '800px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Company Settings</h1>
        <p style={{ color: '#666' }}>
          Configure your company information to appear on invoices.
        </p>
      </div>

      {actionData?.success && (
        <s-banner status="success">
          <s-paragraph>{actionData.message}</s-paragraph>
        </s-banner>
      )}

      {actionData?.error && (
        <s-banner status="critical">
          <s-paragraph>{actionData.error}</s-paragraph>
        </s-banner>
      )}

      <Form method="post">
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Company Name *
            </label>
            <input
              type="text"
              name="companyName"
              defaultValue={settings?.companyName || ''}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Address
            </label>
            <input
              type="text"
              name="address"
              defaultValue={settings?.address || ''}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                City
              </label>
              <input
                type="text"
                name="city"
                defaultValue={settings?.city || ''}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Postal Code
              </label>
              <input
                type="text"
                name="postalCode"
                defaultValue={settings?.postalCode || ''}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Country
            </label>
            <input
              type="text"
              name="country"
              defaultValue={settings?.country || ''}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Tax ID / Business Number
            </label>
            <input
              type="text"
              name="taxId"
              defaultValue={settings?.taxId || ''}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                defaultValue={settings?.email || ''}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                defaultValue={settings?.phone || ''}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Invoice Language
            </label>
            <select
              name="locale"
              defaultValue={settings?.locale || 'en'}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            >
              <option value="en">English</option>
              <option value="ko">한국어 (Korean)</option>
              <option value="ja">日本語 (Japanese)</option>
            </select>
            <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              Select the language for your invoice PDFs
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: '12px 24px',
              backgroundColor: isSubmitting ? '#999' : '#5C6AC4',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
            }}
          >
            {isSubmitting ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </Form>

      <div style={{ marginTop: '20px' }}>
        <a
          href="/app/invoices"
          style={{
            color: '#5C6AC4',
            textDecoration: 'none',
            fontSize: '14px',
          }}
        >
          ← Back to Invoices
        </a>
      </div>
    </div>
  );
}
