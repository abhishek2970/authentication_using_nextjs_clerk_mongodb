import { Webhook } from "svix";
import { headers } from "next/headers";
import { createOrUpdateUser, deleteUser } from "@/lib/actions/user";

const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

export async function POST(req: Request) {
  const payload = await req.text();
  const headerPayload = headers();

  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const wh = new Webhook(WEBHOOK_SECRET!);

  let evt: any;
  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Invalid webhook", { status: 400 });
  }

  const { id, email_addresses, first_name, last_name } = evt.data;

  if (evt.type === "user.created" || evt.type === "user.updated") {
    try {
      await createOrUpdateUser({
        id,
        email: email_addresses?.[0]?.email_address,
        firstName: first_name,
        lastName: last_name,
      });
      return new Response("User processed", { status: 200 });
    } catch (error) {
      console.error("Error processing user data:", error);
      return new Response("Error saving user", { status: 500 });
    }
  }

  if (evt.type === "user.deleted") {
    try {
      await deleteUser(id);
      return new Response("User deletion processed", { status: 200 });
    } catch (error) {
      console.error("Error processing user deletion:", error);
      return new Response("Error deleting user", { status: 500 });
    }
  }

  return new Response("Webhook received", { status: 200 });
}
