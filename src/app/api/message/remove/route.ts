import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { Message } from "@/lib/validation/message";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  try {
    const { message, chatId }: { message: Message; chatId: string } =
      await req.json();

    const session = await getServerSession(authOptions);
    if (!session) return new Response("Unauthorized", { status: 401 });
    const [userId1, userId2] = chatId.split("--");

    if (session.user.id !== userId1 && session.user.id !== userId2) {
      return new Response("Unauthorized", { status: 401 });
    }


    if (session.user.id !== message.senderId) {
      return new Response(
        '"Sorry, you are not authorized to remove this message as you are not the original sender."',
        { status: 403 }
      );
    }

    pusherServer.trigger(
      toPusherKey(`chat:${chatId}`),
      "message-removed",
      message
    );


    const deletedItemsFromDB = await db.zrem(
      `chat:${chatId}:messages`,
      JSON.stringify(message)
    )

    if (deletedItemsFromDB < 1) return new Response("Problem saving to DB", { status: 500 });

    return new Response("OK");
  } catch (err) {
    if (err instanceof Error) {
      return new Response(err.message, { status: 500 });
    }

    return new Response("Internal Server Error", { status: 500 });
  }
}

