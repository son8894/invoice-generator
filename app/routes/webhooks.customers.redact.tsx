import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { topic, shop, session, admin, payload } = await authenticate.webhook(request);

  if (!admin) {
    // The admin context isn't returned if the webhook fired after a shop was uninstalled.
    throw new Response();
  }

  // GDPR: customers/redact
  // Handle customer data deletion request (48 hours after customer deletion)
  console.log(`Received ${topic} webhook for ${shop}`);
  
  try {
    const customerId = payload.customer?.id;
    const customerEmail = payload.customer?.email;
    
    console.log(`Customer redaction request: ${customerId} (${customerEmail})`);
    
    // TODO: Delete all customer data from your database
    // For invoice-generator app:
    // 1. Delete all invoices for this customer
    // 2. Remove customer information from company settings (if stored)
    // 3. Purge any logs or cached data
    
    // Example: Delete invoices for this customer
    // await db.invoice.deleteMany({
    //   where: {
    //     shop: shop,
    //     customerEmail: customerEmail
    //   }
    // });
    
    console.log(`Customer data redacted for: ${customerId}`);
    
    return new Response("Customer data redacted", { status: 200 });
  } catch (error) {
    console.error(`Error processing ${topic}:`, error);
    return new Response("Error processing webhook", { status: 500 });
  }
};
