import { useEffect } from 'react';
import type { LoaderFunctionArgs, ActionFunctionArgs } from '@react-router/node';
import { useLoaderData, Form, useActionData, useNavigation } from 'react-router';
import { useAppBridge } from '@shopify/app-bridge-react';
import {
  Page,
  Card,
  FormLayout,
  TextField,
  Select,
  Button,
  Banner,
  BlockStack,
} from '@shopify/polaris';
import { authenticate } from '../shopify.server';
import db from '../db.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);

  const settings = await db.companySettings.findUnique({
    where: { shop: session.shop },
  });

  return { settings, shop: session.shop };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const { session } = await authenticate.admin(request);
    const formData = await request.formData();

    const companyName = formData.get('companyName') as string;

    // Validation
    if (!companyName || companyName.trim() === '') {
      return Response.json({ 
        success: false, 
        error: 'Company name is required' 
      }, { status: 400 });
    }

    const data = {
      companyName: companyName.trim(),
      address: formData.get('address') as string || '',
      city: formData.get('city') as string || '',
      postalCode: formData.get('postalCode') as string || '',
      country: formData.get('country') as string || '',
      taxId: formData.get('taxId') as string || '',
      email: formData.get('email') as string || '',
      phone: formData.get('phone') as string || '',
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

    return { success: true, message: 'Settings saved successfully!' };
  } catch (error: any) {
    console.error('Error saving settings:', error);
    return Response.json({ 
      success: false, 
      error: `Failed to save settings: ${error.message}` 
    }, { status: 500 });
  }
};

export default function Settings() {
  const { settings } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const shopify = useAppBridge();
  const isSubmitting = navigation.state === 'submitting';

  useEffect(() => {
    if (actionData?.success) {
      shopify.toast.show(actionData.message);
    } else if (actionData?.error) {
      shopify.toast.show(actionData.error, { isError: true });
    }
  }, [actionData, shopify]);

  const localeOptions = [
    { label: 'English', value: 'en' },
    { label: '한국어 (Korean)', value: 'ko' },
    { label: '日本語 (Japanese)', value: 'ja' },
  ];

  return (
    <Page
      title="Company Settings"
      subtitle="Configure your company information to appear on invoices"
      backAction={{ url: '/app' }}
    >
      <BlockStack gap="500">
        {actionData?.error && (
          <Banner title="Error" tone="critical">
            <p>{actionData.error}</p>
          </Banner>
        )}

        <Form method="post">
          <Card>
            <BlockStack gap="400">
              <FormLayout>
                <TextField
                  label="Company Name"
                  name="companyName"
                  autoComplete="organization"
                  defaultValue={settings?.companyName || ''}
                  requiredIndicator
                />

                <TextField
                  label="Address"
                  name="address"
                  autoComplete="street-address"
                  defaultValue={settings?.address || ''}
                />

                <FormLayout.Group>
                  <TextField
                    label="City"
                    name="city"
                    autoComplete="address-level2"
                    defaultValue={settings?.city || ''}
                  />
                  <TextField
                    label="Postal Code"
                    name="postalCode"
                    autoComplete="postal-code"
                    defaultValue={settings?.postalCode || ''}
                  />
                </FormLayout.Group>

                <TextField
                  label="Country"
                  name="country"
                  autoComplete="country"
                  defaultValue={settings?.country || ''}
                />

                <TextField
                  label="Tax ID / Business Number"
                  name="taxId"
                  defaultValue={settings?.taxId || ''}
                  helpText="Your business registration number or tax ID"
                />

                <FormLayout.Group>
                  <TextField
                    label="Email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    defaultValue={settings?.email || ''}
                  />
                  <TextField
                    label="Phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    defaultValue={settings?.phone || ''}
                  />
                </FormLayout.Group>

                <Select
                  label="Invoice Language"
                  name="locale"
                  options={localeOptions}
                  value={settings?.locale || 'en'}
                  helpText="Select the language for your invoice PDFs"
                />

                <Button submit variant="primary" loading={isSubmitting}>
                  Save Settings
                </Button>
              </FormLayout>
            </BlockStack>
          </Card>
        </Form>
      </BlockStack>
    </Page>
  );
}
