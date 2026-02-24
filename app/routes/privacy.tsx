export default function Privacy() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '20px' }}>Privacy Policy</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>Last updated: February 24, 2026</p>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '15px' }}>Introduction</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '15px' }}>
          InvoiceGen ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how
          we collect, use, and safeguard your information when you use our Shopify app.
        </p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '15px' }}>Information We Collect</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '15px' }}>
          When you install and use InvoiceGen, we collect the following information:
        </p>
        <ul style={{ marginLeft: '20px', lineHeight: '1.8' }}>
          <li><strong>Store Information:</strong> Shop domain, shop owner email</li>
          <li><strong>Order Data:</strong> Order numbers, customer names, email addresses, order totals, line items</li>
          <li><strong>Company Settings:</strong> Your company name, address, tax ID, contact information</li>
          <li><strong>Invoice Records:</strong> Generated invoice numbers and timestamps</li>
        </ul>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '15px' }}>How We Use Your Information</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '15px' }}>
          We use the collected information solely to:
        </p>
        <ul style={{ marginLeft: '20px', lineHeight: '1.8' }}>
          <li>Generate PDF invoices for your orders</li>
          <li>Display invoice statistics in your dashboard</li>
          <li>Provide customer support</li>
          <li>Improve our app functionality</li>
        </ul>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '15px' }}>Data Storage and Security</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '15px' }}>
          <strong>Database:</strong> We store invoice records and company settings in a secure PostgreSQL database
          (Neon.tech) located in Singapore.
        </p>
        <p style={{ lineHeight: '1.6', marginBottom: '15px' }}>
          <strong>Security:</strong> All data transmission is encrypted using HTTPS. We do not store credit card
          information or Shopify access tokens permanently.
        </p>
        <p style={{ lineHeight: '1.6', marginBottom: '15px' }}>
          <strong>PDF Files:</strong> Generated PDFs are created on-demand and are not stored on our servers.
        </p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '15px' }}>Data Sharing</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '15px' }}>
          We do <strong>not</strong> sell, trade, or transfer your data to third parties. Your information is used
          exclusively within the app to provide invoice generation services.
        </p>
        <p style={{ lineHeight: '1.6', marginBottom: '15px' }}>
          We may share information only in these circumstances:
        </p>
        <ul style={{ marginLeft: '20px', lineHeight: '1.8' }}>
          <li>With your explicit consent</li>
          <li>To comply with legal obligations</li>
          <li>To protect our rights and safety</li>
        </ul>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '15px' }}>Your Rights (GDPR Compliance)</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '15px' }}>
          If you are located in the European Economic Area (EEA), you have the following rights:
        </p>
        <ul style={{ marginLeft: '20px', lineHeight: '1.8' }}>
          <li><strong>Right to Access:</strong> Request a copy of your data</li>
          <li><strong>Right to Rectification:</strong> Correct inaccurate data</li>
          <li><strong>Right to Erasure:</strong> Request deletion of your data</li>
          <li><strong>Right to Data Portability:</strong> Receive your data in a structured format</li>
        </ul>
        <p style={{ lineHeight: '1.6', marginTop: '15px' }}>
          To exercise these rights, contact us at <a href="mailto:thss2641@gmail.com" style={{ color: '#5C6AC4' }}>thss2641@gmail.com</a>
        </p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '15px' }}>Data Retention</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '15px' }}>
          We retain your data for as long as you use the app. When you uninstall InvoiceGen:
        </p>
        <ul style={{ marginLeft: '20px', lineHeight: '1.8' }}>
          <li>Your company settings and invoice records are automatically deleted within 48 hours</li>
          <li>Session tokens are immediately invalidated</li>
        </ul>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '15px' }}>Third-Party Services</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '15px' }}>
          We use the following third-party services:
        </p>
        <ul style={{ marginLeft: '20px', lineHeight: '1.8' }}>
          <li><strong>Shopify API:</strong> To access your order and store data</li>
          <li><strong>Neon.tech:</strong> PostgreSQL database hosting (Singapore region)</li>
          <li><strong>Render.com:</strong> App hosting (Singapore region)</li>
        </ul>
        <p style={{ lineHeight: '1.6', marginTop: '15px' }}>
          These services have their own privacy policies and are GDPR compliant.
        </p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '15px' }}>Cookies</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '15px' }}>
          We use session cookies only for authentication purposes. These are temporary and are deleted when you
          close your browser.
        </p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '15px' }}>Changes to This Policy</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '15px' }}>
          We may update this Privacy Policy from time to time. We will notify you of any changes by updating the
          "Last updated" date at the top of this page.
        </p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '15px' }}>Contact Us</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '15px' }}>
          If you have any questions about this Privacy Policy, please contact us:
        </p>
        <ul style={{ marginLeft: '20px', lineHeight: '1.8', listStyle: 'none' }}>
          <li><strong>Email:</strong> <a href="mailto:thss2641@gmail.com" style={{ color: '#5C6AC4' }}>thss2641@gmail.com</a></li>
          <li><strong>App Name:</strong> InvoiceGen - B2B PDF Invoice</li>
          <li><strong>Developer:</strong> 손준혁 (Son Junhyuk)</li>
        </ul>
      </section>

      <hr style={{ margin: '40px 0', border: 'none', borderTop: '1px solid #e5e5e5' }} />

      <p style={{ color: '#999', fontSize: '14px', textAlign: 'center' }}>
        © 2026 InvoiceGen. All rights reserved.
      </p>
    </div>
  );
}
