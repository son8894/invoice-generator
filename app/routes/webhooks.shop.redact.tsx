import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { topic, shop, session, admin, payload } = await authenticate.webhook(request);

  if (!admin) {
    // The admin context isn't returned if the webhook fired after a shop was uninstalled.
    throw new Response();
  }

  // GDPR: shop/redact
  // Handle shop data deletion request (48 hours after shop deletion/uninstall)
  console.log(`Received ${topic} webhook for ${shop}`);
  
  try {
    const shopId = payload.shop_id;
    const shopDomain = payload.shop_domain;
    
    console.log(`Shop redaction request: ${shopId} (${shopDomain})`);
    
    // TODO: Delete ALL shop data from your database
    // For invoice-generator app:
    // 1. Delete all invoices for this shop
    // 2. Delete company settings
    // 3. Delete sessions
    // 4. Purge any logs, cached data, or files
    
    // Example: Delete all data for this shop
    await db.invoice.deleteMany({
      where: { shop: shop }
    });
    
    await db.companySettings.deleteMany({
      where: { shop: shop }
    });
    
    await db.session.deleteMany({
      where: { shop: shop }
    });
    
    console.log(`All shop data redacted for: ${shop}`);
    
    return new Response("Shop data redacted", { status: 200 });
  } catch (error) {
    console.error(`Error processing ${topic}:`, error);
    return new Response("Error processing webhook", { status: 500 });
  }
};
