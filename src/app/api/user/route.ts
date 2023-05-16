import { db } from "@/lib/db"
import { clerkClient } from "@clerk/nextjs"

export async function POST(req: Request) {
    try {
        const { userId } = await req.json()
        const user = await clerkClient.users.getUser(userId)

        const isUserInDB = await db.get(`user:${userId}`)
        if (!isUserInDB) {
            const userToSave = {
                id: user.id,
                username: user.username,
                fullName: `${user.firstName} ${user.lastName}`,
                email: user.emailAddresses[0].emailAddress,
                image: user.profileImageUrl,
                gender: user.gender,
                birthday: user.birthday,
            }
           await Promise.all([
            db.set(`user:${userId}`, userToSave),
            db.set(`user:email:${userToSave.email}`, userId),
        ]);
        }      
        return new Response('OK')
    } catch (err) {
        console.log(err)
    }
}