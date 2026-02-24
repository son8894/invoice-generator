import { Link } from 'react-router';

export function WelcomeBanner() {
  return (
    <s-banner status="info">
      <s-stack direction="block" gap="tight">
        <s-heading size="sm">Welcome to Invoice Generator! 👋</s-heading>
        <s-paragraph>
          Get started by configuring your company information. This will appear on all your invoices.
        </s-paragraph>
        <s-stack direction="inline" gap="tight">
          <Link to="/app/settings">
            <s-button variant="primary">Configure Settings</s-button>
          </Link>
          <s-text size="sm" tone="subdued">
            Takes less than 2 minutes
          </s-text>
        </s-stack>
      </s-stack>
    </s-banner>
  );
}
