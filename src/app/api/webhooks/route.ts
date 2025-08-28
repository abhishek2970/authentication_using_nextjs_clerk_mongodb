import { verifyWebhook } from '@clerk/nextjs/webhooks';
import { create } from 'domain';
import { NextRequest } from 'next/server';
import { createOrUpdateUser, deleteUser } from '@/lib/actions/user.js'

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    // Handle specific event type
    if (evt.type === 'user.created' || evt.type === 'user.updated') {
      const { id, email_addresses, first_name, last_name } = evt?.data;
      try { 
        await createOrUpdateUser(
          {
            id,
            email: email_addresses?.[0]?.email_address,
            firstName: first_name,
            lastName: last_name,
          }
        );
        return new Response('User processed', { status: 200 });
       
      } catch (error) {   
        console.error('Error processing user data:', error);
      }


      // You can add further logic here, like saving the user to your DB
    }
    if(evt.type === 'user.deleted') {
      const { id } = evt?.data;
      try {
        await deleteUser(id);

       //  console.log(`User with ID ${id} has been deleted.`);
        // For example, you might want to remove the user from your database
        return new Response('User deletion processed', { status: 200 });
      } catch (error) {
        console.error('Error processing user deletion:', error);
      }
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
