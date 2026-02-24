import { Card, List, BlockStack, Text } from '@shopify/polaris';
import { Link } from 'react-router';

interface OnboardingGuideProps {
  hasSettings: boolean;
  totalInvoices: number;
}

export function OnboardingGuide({ hasSettings, totalInvoices }: OnboardingGuideProps) {
  return (
    <Card>
      <BlockStack gap="400">
        <Text as="h2" variant="headingMd">
          Getting Started
        </Text>
        <List>
          {!hasSettings && (
            <List.Item>
              <Link to="/app/settings" style={{ textDecoration: 'underline' }}>
                Configure company settings
              </Link>
            </List.Item>
          )}
          <List.Item>
            Create a test order in your store
          </List.Item>
          <List.Item>
            Invoice will be generated automatically
          </List.Item>
          <List.Item>
            Download and review the PDF
          </List.Item>
        </List>
      </BlockStack>
    </Card>
  );
}
