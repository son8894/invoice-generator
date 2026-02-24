import { generateProfessionalInvoicePDF, InvoiceData } from '../app/utils/pdf-generator-pro';
import fs from 'fs';
import path from 'path';

const testData: InvoiceData = {
  invoiceNumber: 'TEST-001',
  orderNumber: '1009',
  date: 'February 24, 2026',
  customerName: '김철수',
  customerEmail: 'chulsoo.kim@example.com',
  customerAddress: '서울특별시 강남구 테헤란로 123',
  items: [
    {
      title: '프리미엄 무선 헤드폰',
      quantity: 2,
      price: '149.99',
      total: '299.98',
    },
    {
      title: 'USB-C 충전 케이블 (2m)',
      quantity: 3,
      price: '19.99',
      total: '59.97',
    },
  ],
  subtotal: '384.94',
  tax: '38.49',
  taxRate: 0.10,
  shipping: '15.00',
  total: '438.43',
  currency: 'KRW',
  company: {
    name: 'Test Company',
    address: 'Seoul, Korea',
    taxId: '123-45-67890',
  },
};

async function main() {
  console.log('🧪 Testing PDF generation with Korean text...\n');
  
  console.log('📝 Invoice Data:');
  console.log(`- Customer: ${testData.customerName}`);
  console.log(`- Items:`);
  testData.items.forEach(item => {
    console.log(`  - ${item.title}`);
  });
  
  console.log('\n🔄 Generating PDF (locale: en)...');
  const pdfBuffer = await generateProfessionalInvoicePDF(testData, 'en');
  
  const outputPath = path.join(process.cwd(), 'test-korean-invoice.pdf');
  fs.writeFileSync(outputPath, pdfBuffer);
  
  console.log(`\n✅ PDF generated: ${outputPath}`);
  console.log(`📊 File size: ${(pdfBuffer.length / 1024).toFixed(2)} KB`);
  console.log('\n👉 Open the PDF file and check if Korean text is displayed correctly!');
}

main().catch(console.error);
