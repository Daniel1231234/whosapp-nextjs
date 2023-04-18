import { z } from "zod";

export const messageSchema = z.object({
    id:z.string(),
    senderId:z.string(),
    text:z.string(),
    createdAt:z.number()
})

export const messageArrSchema = z.array(messageSchema)

export type Message = z.infer<typeof messageSchema>