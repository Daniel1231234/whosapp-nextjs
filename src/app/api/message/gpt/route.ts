import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { openai } from "@/lib/openai";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { gptMessage } from "@/types/typings";
import { AxiosError } from "axios";
import { nanoid } from "nanoid";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return new Response("Unauthorized", { status: 401 });
        const { message, chatId }: { message: string; chatId: string } =
            await req.json();

        const timestamp = Date.now();

        const newMessage: gptMessage = {
            id: nanoid(),
            role: "user",
            text: message,
            createdAt: timestamp,
        };

        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: message }],
        });
        const gptResponse = response.data.choices[0].message?.content;

        if (!gptResponse) return new Response("Something went wrong with the response")
        const gptTimeStamp = Date.now();

        const resMessage: gptMessage = {
            id: nanoid(),
            role: "gpt",
            text: gptResponse,
            createdAt: gptTimeStamp,
        };

        const twoMessages = [newMessage, resMessage];

        pusherServer.trigger(
            toPusherKey(`chat:${chatId}`),
            "incoming-message",
            twoMessages
        );

        await Promise.all([
            db.zadd(`chat:${chatId}:messages`, {
                score: timestamp,
                member: JSON.stringify(newMessage),
            }),
            db.zadd(`chat:${chatId}:messages`, {
                score: gptTimeStamp,
                member: JSON.stringify(resMessage),
            }),
        ]);

        return new Response("OK", { status: 200 });
    } catch (err) {
        if (err instanceof AxiosError) {
            console.log("axios scope => ", err);
            return new Response(err.response?.data, { status: 400 });
        }
        console.log("err => ", err);
        return new Response("Something went wrong", { status: 500 });
    }
}
