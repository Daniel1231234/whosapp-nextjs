import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { z } from "zod";

interface ParamsProps {
    params: { friendId:string }
}

export async function DELETE(req: Request, {params}:ParamsProps) {
    try {
        
        const idToRemove = params.friendId
        console.log(idToRemove)
        
        if (!idToRemove) {
            return new Response("This person does not exist", { status: 400 });
        }

        const session = await getServerSession(authOptions);

        if (!session) {
            return new Response("Unauthorized", { status: 401 });
        }

        if (idToRemove === session.user.id) {
            return new Response("You cannot remove yourself as a friend", { status: 400 });
        }

        // Check if the user is already a friend
        const isFriend = await fetchRedis("sismember", `user:${session.user.id}:friends`, idToRemove) as 0 | 1;

        if (!isFriend) {
            return new Response("This user is not your friend", { status: 400 });
        }

       await pusherServer.trigger(toPusherKey(`user:${session.user.id}:friends`), 'remove_friend', idToRemove),


        await Promise.all([
            fetchRedis("srem", `user:${session.user.id}:friends`, idToRemove),
            fetchRedis("srem", `user:${idToRemove}:friends`, session.user.id),
        ]);

        return new Response("OK");
    } catch (err) {
        if (err instanceof z.ZodError) {
            return new Response("Invalid request payload", { status: 422 });
        }

        return new Response("Invalid request", { status: 400 });
    }
}
