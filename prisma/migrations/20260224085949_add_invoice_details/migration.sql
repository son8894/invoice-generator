-- AlterTable
ALTER TABLE "CompanySettings" ADD COLUMN "paymentTerms" TEXT;

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN "customerAddress" TEXT;
ALTER TABLE "Invoice" ADD COLUMN "lineItems" TEXT;
ALTER TABLE "Invoice" ADD COLUMN "shippingAmount" TEXT;
ALTER TABLE "Invoice" ADD COLUMN "subtotal" TEXT;
ALTER TABLE "Invoice" ADD COLUMN "taxAmount" TEXT;
ALTER TABLE "Invoice" ADD COLUMN "taxRate" TEXT;
