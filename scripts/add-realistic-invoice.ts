import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const shop = 'sonsapp-dev.myshopify.com';
  const orderId = 'gid://shopify/Order/6414832369853';
  const orderNumber = '1008';

  // Delete existing invoice if exists
  await prisma.invoice.deleteMany({
    where: { shop, orderNumber },
  });

  // Realistic line items
  const lineItems = [
    {
      title: 'Premium Wireless Headphones',
      quantity: 2,
      price: '149.99',
      total: '299.98',
    },
    {
      title: 'USB-C Charging Cable (2m)',
      quantity: 3,
      price: '19.99',
      total: '59.97',
    },
    {
      title: 'Phone Case - Ultra Clear',
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

  // Create realistic invoice
  const invoice = await prisma.invoice.create({
    data: {
      shop,
      orderId,
      orderNumber,
      invoiceNumber: `INV-${orderNumber}`,
      customerName: 'John Smith',
      customerEmail: 'john.smith@example.com',
      customerAddress: '123 Business St, Suite 100\nSeoul, 06234\nSouth Korea',
      subtotal,
      taxAmount,
      taxRate,
      shippingAmount,
      totalAmount: total,
      currency: 'USD',
      lineItems: JSON.stringify(lineItems),
      emailSent: false,
    },
  });

  console.log('🎉 Realistic invoice created:', invoice.invoiceNumber);
  console.log('📦 Products:', lineItems.length);
  console.log('💰 Subtotal:', subtotal, invoice.currency);
  console.log('📊 Tax (10%):', taxAmount, invoice.currency);
  console.log('🚚 Shipping:', shippingAmount, invoice.currency);
  console.log('✅ Total:', total, invoice.currency);
  console.log('\n📄 Invoice ID:', invoice.id);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
