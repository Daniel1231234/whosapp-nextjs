import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import * as bcrypt from 'bcrypt'


export async function POST(req: Request) {
    try {
        const body = await req.json()
        const session = await getServerSession(authOptions)

        if (!session) {
            return new Response('Unauthorized', { status: 401 })
        }

        let updatedUser

        if (body.password === "") {
            updatedUser = {
                id: session.user.id,
                name: body.name,
                email: body.email,
                image: body.image,
                username: body.username,
                country: body.country,
                street: body.street,
                notification: body.notification,
            }
        } else {
            updatedUser = {
            id: session.user.id,
            name: body.name,
            email: body.email,
            password: await bcrypt.hash(body.password, 10),
            image: body.image,
            username: body.username,
            country: body.country,
            street: body.street,
            notification: body.notification,
        };
        }


        await db.set(`user:${session.user.id}`, JSON.stringify(updatedUser))
        return new Response("OK");
    } catch (err) {
        return new Response("Invalid request", { status: 400 });
    }
}