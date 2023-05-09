import { fetchRedis } from "@/helpers/redis"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"


export async function POST(req: Request) {
    try {
        const body = await req.json()
        const session = await getServerSession(authOptions)

        if (!session) {
            return new Response('Unauthorized', { status: 401 })
        }
        
        await Promise.all([
            db.set(`user:email`, body.email),
            db.set(`user:name`, body.name)
        ])
        return new Response("OK");
    } catch (err) {
        return new Response("Invalid request", { status: 400 });
    }
}