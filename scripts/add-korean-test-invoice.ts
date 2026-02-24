import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const shop = 'sonsapp-dev.myshopify.com';
  const orderId = 'gid://shopify/Order/6414832369999';
  const orderNumber = '1009';

  // Delete existing invoice if exists
  await prisma.invoice.deleteMany({
    where: { shop, orderNumber },
  });

  // 한글 상품명 테스트
  const lineItems = [
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
    {
      title: '울트라 클리어 폰 케이스',
      quantity: 1,
      price: '24.99',
      total: '24.99',
    },
  ];

  const subtotal = '384.94';
  const taxRate = '0.10'; // 10% VAT
  const taxAmount = '38.49';
  const shippingAmount = '15.00';
  const total = '438.43';

  // Create Korean test invoice
  const invoice = await prisma.invoice.create({
    data: {
      shop,
      orderId,
      orderNumber,
      invoiceNumber: `INV-${orderNumber}`,
      customerName: '김철수',
      customerEmail: 'chulsoo.kim@example.com',
      customerAddress: '서울특별시 강남구 테헤란로 123\n서울, 06234\n대한민국',
      subtotal,
      taxAmount,
      taxRate,
      shippingAmount,
      totalAmount: total,
      currency: 'KRW',
      lineItems: JSON.stringify(lineItems),
      emailSent: false,
    },
  });

  console.log('🎉 Korean test invoice created:', invoice.invoiceNumber);
  console.log('📦 Products (한글):', lineItems.map(i => i.title).join(', '));
  console.log('💰 Total:', total, invoice.currency);
  console.log('\n📄 Invoice ID:', invoice.id);
  console.log('\n⚠️  Now download this PDF and check if Korean text renders correctly!');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
