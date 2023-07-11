import { fetchRedis } from "@/helpers/redis";
import { db } from "@/lib/db";
import * as bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid';

interface RequestBody {
    name: string
    email: string
    password: string
}

export async function POST(request: Request) {
    try {
        const body: RequestBody = await request.json();
        const userId = await fetchRedis('get', `user:email:${body.email}`)

        if (!userId) {
            const newUser = {
                id: uuidv4(),
                name: body.name,
                email: body.email,
                password: await bcrypt.hash(body.password, 10),
                image: "/avatar.png",
            }

            const { password, ...userDetails } = newUser

            await Promise.all([
                db.set(`user:${newUser.id}`, JSON.stringify(newUser)),
                db.set(`user:email:${newUser.email}`, newUser.id),
                db.sadd(`users`, JSON.stringify(userDetails))
            ]);

            return new Response("OK")
        } else {
            return new Response("This Email allready exist", { status: 400 })
        }
    } catch (error) {
        return new Response("Something went wrong with signup", { status: 500 })
    }

}
