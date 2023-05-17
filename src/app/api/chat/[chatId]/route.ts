import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { pusherServer } from '@/lib/pusher';
import { toPusherKey } from '@/lib/utils';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

interface ParamsProps {
    params: { chatId: string }
}

export async function DELETE(request: Request, { params }: ParamsProps) {
    try {
        const chatId = params.chatId
        const session = await getServerSession(authOptions)
        if (!session) return new Response('Unauthorized', { status: 401 })

        const [userId1, userId2] = chatId.split("--");
        const friendId = session.user.id === userId1 ? userId2 : userId1

        if (session.user.id !== userId1 && session.user.id !== userId2) {
            return new Response("Unauthorized", { status: 401 });
        }

        pusherServer.trigger(toPusherKey(`user:${friendId}:friends`), 'remove_friend', chatId)

        // const deletedItemsCount = await db.del(`chat:${chatId}`)
        // if (deletedItemsCount < 1) return new Response("Problem saving to DB", { status: 400 });

        return NextResponse.json('OK')
    } catch (err) {
        if (err instanceof Error) {
            return new Response(err.message, { status: 500 });
          }
      
          return new Response("Internal Server Error", { status: 500 });
     }

}