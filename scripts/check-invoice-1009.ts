import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const invoice = await prisma.invoice.findFirst({
    where: { invoiceNumber: 'INV-1009' },
  });

  console.log('INV-1009 Data:');
  console.log(JSON.stringify(invoice, null, 2));
  
  if (invoice?.lineItems) {
    console.log('\n📦 Line Items:');
    const items = typeof invoice.lineItems === 'string' 
      ? JSON.parse(invoice.lineItems)
      : invoice.lineItems;
    
    items.forEach((item: any, index: number) => {
      console.log(`${index + 1}. ${item.title}`);
      
      // Check for Korean characters
      const hasKorean = /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/.test(item.title);
      console.log(`   Korean detected: ${hasKorean ? '✅ YES' : '❌ NO'}`);
    });
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
