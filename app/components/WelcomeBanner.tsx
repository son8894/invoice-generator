import { Banner } from '@shopify/polaris';
import { Link } from 'react-router';

export function WelcomeBanner() {
  return (
    <Banner title="Welcome to Invoice Generator!" tone="info">
      <p>
        Get started by{' '}
        <Link to="/app/settings" style={{ textDecoration: 'underline' }}>
          configuring your company settings
        </Link>
        . This will ensure your invoices include all necessary business information.
      </p>
    </Banner>
  );
}
