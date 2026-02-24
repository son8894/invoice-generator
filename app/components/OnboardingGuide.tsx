import { Link } from 'react-router';

interface OnboardingGuideProps {
  hasSettings: boolean;
  totalInvoices: number;
}

export function OnboardingGuide({ hasSettings, totalInvoices }: OnboardingGuideProps) {
  const steps = [
    {
      title: 'Configure Company Settings',
      description: 'Add your company name, address, and contact information',
      link: '/app/settings',
      linkText: 'Go to Settings',
      completed: hasSettings,
    },
    {
      title: 'Create Your First Invoice',
      description: 'Generate a test invoice using an existing order ID',
      link: '/app',
      linkText: 'Create Invoice',
      completed: totalInvoices > 0,
    },
    {
      title: 'Review & Download',
      description: 'Download and review your generated invoice PDF',
      link: '/app/invoices',
      linkText: 'View Invoices',
      completed: totalInvoices > 0,
    },
  ];

  const allCompleted = steps.every(step => step.completed);

  if (allCompleted) {
    return null;
  }

  return (
    <s-box padding="base" borderWidth="base" borderRadius="base" background="surface-subdued">
      <s-stack direction="block" gap="base">
        <s-heading size="md">Getting Started</s-heading>
        <s-stack direction="block" gap="tight">
          {steps.map((step, index) => (
            <s-box key={index} padding="tight" borderWidth="base" borderRadius="base">
              <s-stack direction="inline" gap="base" alignment="space-between">
                <s-stack direction="inline" gap="tight">
                  {step.completed ? (
                    <s-badge tone="success">✓</s-badge>
                  ) : (
                    <s-badge>{index + 1}</s-badge>
                  )}
                  <s-stack direction="block" gap="extra-tight">
                    <s-text>{step.title}</s-text>
                    <s-text size="sm" tone="subdued">{step.description}</s-text>
                  </s-stack>
                </s-stack>
                {!step.completed && (
                  <Link to={step.link}>
                    <s-button variant="secondary" size="sm">{step.linkText}</s-button>
                  </Link>
                )}
              </s-stack>
            </s-box>
          ))}
        </s-stack>
      </s-stack>
    </s-box>
  );
}
