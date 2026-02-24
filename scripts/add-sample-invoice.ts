import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const shop = 'sonsapp-dev.myshopify.com';
  const orderId = '6414832369853';
  const orderNumber = '1008';

  // Check if invoice already exists
  const existing = await prisma.invoice.findFirst({
    where: { shop, orderId },
  });

  if (existing) {
    console.log('✅ Invoice already exists:', existing.invoiceNumber);
    return;
  }

  // Create sample invoice
  const invoice = await prisma.invoice.create({
    data: {
      shop,
      orderId,
      orderNumber,
      invoiceNumber: `INV-${orderNumber}`,
      customerName: 'Test Customer',
      customerEmail: 'test@example.com',
      totalAmount: '949.95',
      currency: 'USD',
      emailSent: false,
    },
  });

  console.log('🎉 Sample invoice created:', invoice.invoiceNumber);
  console.log('📄 Invoice ID:', invoice.id);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
