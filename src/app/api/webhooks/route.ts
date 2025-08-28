import { NextResponse } from "next/server";
import { Webhook } from "svix";
import type { WebhookEvent } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const payload = await req.text();
  const svixHeaders = {
    "svix-id": req.headers.get("svix-id")!,
    "svix-timestamp": req.headers.get("svix-timestamp")!,
    "svix-signature": req.headers.get("svix-signature")!,
  };

  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return new NextResponse("Missing Clerk webhook secret", { status: 500 });
  }

  const wh = new Webhook(webhookSecret);

  let evt: WebhookEvent;
  try {
    evt = wh.verify(payload, svixHeaders) as WebhookEvent;
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  const { type, data } = evt;

  if (type === "user.created") {
    console.log("User created:", data.id);
    // TODO: save user in DB
  }

  if (type === "user.deleted") {
    console.log("User deleted:", data.id);
    // TODO: remove user from DB
  }

  return NextResponse.json({ success: true, eventId: data.id });
}
