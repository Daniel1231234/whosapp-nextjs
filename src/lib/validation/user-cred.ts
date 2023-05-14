import { z } from 'zod'

export const userCredSchema = z.object({
    email: z.string().email(),
    name: z.string(),
    password: z.string()
})


