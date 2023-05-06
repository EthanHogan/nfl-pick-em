// pages/api/user.ts
import type { NextApiRequest, NextApiResponse } from "next";
import type { UserWebhookEvent, UserJSON } from "@clerk/clerk-sdk-node";
import { Webhook } from "svix";
import { buffer } from "micro";
import { prisma } from "~/server/db";
import { TRPCError } from "@trpc/server";
import type { User } from "@prisma/client";

export const config = {
  api: {
    bodyParser: false,
  },
};

const clerkUserEventSecret =
  process.env.CLERK_USER_EVENT_WEBHOOK_SECRET ?? "Need to set this";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check if the request method is POST
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const payload = (await buffer(req)).toString();

  // Verify the webhook request using Svix
  const headers = {
    "svix-id": req.headers["svix-id"] as string,
    "svix-timestamp": req.headers["svix-timestamp"] as string,
    "svix-signature": req.headers["svix-signature"] as string,
  };

  const wh = new Webhook(clerkUserEventSecret);
  let message;
  try {
    message = wh.verify(payload, headers);
  } catch (err) {
    res.status(400).json({});
  }

  const event = message as UserWebhookEvent;

  switch (event.type) {
    case "user.created":
      await handleUserCreated(event);
      break;
    case "user.updated":
      await handleUserUpdated(event);
      break;
    case "user.deleted":
      await handleUserDeleted(event);
      break;
    default:
      console.error("Unhandled event type for event: ", event);
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
  }

  // Return a 200 status to acknowledge receipt of the webhook
  res.status(200).json({ message: "Webhook received" });
}

async function handleUserCreated(event: UserWebhookEvent) {
  console.log("User created:", event);
  const data = event.data as UserJSON;

  const canCreateUser = !(await userExists(data.id));
  if (!canCreateUser) throw new TRPCError({ code: "CONFLICT" });

  await prisma.user.create({
    data: {
      id: data.id,
      createdAt: new Date(data.created_at),
      firstName: data.first_name,
      lastName: data.last_name,
      username: data.username,
    },
  });
}

async function handleUserUpdated(event: UserWebhookEvent) {
  console.log("User updated:", event);
  const data = event.data as UserJSON;

  const canUpdate = await userExists(data.id);
  if (!canUpdate) throw new TRPCError({ code: "NOT_FOUND" });

  await prisma.user.update({
    where: {
      id: data.id,
    },
    data: {
      firstName: data.first_name,
      lastName: data.last_name,
      username: data.username,
    },
  });
}

async function handleUserDeleted(event: UserWebhookEvent) {
  console.log("User deleted:", event);
  const data = event.data as UserJSON;

  const canDelete = await userExists(data.id);
  if (!canDelete) throw new TRPCError({ code: "NOT_FOUND" });

  await prisma.user.delete({
    where: {
      id: data.id,
    },
  });
}

async function userExists(id: User["id"]) {
  return (
    (await prisma.user.findUnique({
      where: {
        id,
      },
    })) !== null
  );
}
