import { verifyWebhook } from '@clerk/nextjs/webhooks';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    // Handle specific event type
    if (evt.type === 'user.created') {
      console.log('userId:', evt.data.id);
      // You can add further logic here, like saving the user to your DB
    }
    if (evt.type === 'user.updated') {
        console.log('user updated');
        // You can add further logic here, like saving the user to your DB
      }
      
    // General logging for all events
    const { id } = evt.data;
    const eventType = evt.type;
    console.log(`Received webhook with ID ${id} and event type of ${eventType}`);
    console.log('Webhook payload:', evt.data);

    return new Response('Webhook received', { status: 200 });
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error verifying webhook', { status: 400 });
  }
}
