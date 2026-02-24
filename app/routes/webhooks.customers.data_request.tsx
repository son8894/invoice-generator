import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { topic, shop, session, admin, payload } = await authenticate.webhook(request);

  if (!admin) {
    // The admin context isn't returned if the webhook fired after a shop was uninstalled.
    throw new Response();
  }

  // GDPR: customers/data_request
  // Handle customer data access request
  console.log(`Received ${topic} webhook for ${shop}`);
  
  try {
    const customerId = payload.customer?.id;
    const customerEmail = payload.customer?.email;
    
    // Log the data request
    console.log(`Customer data request: ${customerId} (${customerEmail})`);
    
    // TODO: Implement data export logic
    // For now, we just acknowledge the webhook
    // In production, you would:
    // 1. Gather all customer data from your database
    // 2. Create a data export file
    // 3. Send it to the customer or make it available for download
    
    return new Response("Webhook processed", { status: 200 });
  } catch (error) {
    console.error(`Error processing ${topic}:`, error);
    return new Response("Error processing webhook", { status: 500 });
  }
};
