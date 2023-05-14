import { fetchRedis } from "@/helpers/redis";
import { signJwtAccessToken } from "@/lib/jwt";
import { AxiosError } from "axios";
import * as bcrypt from 'bcrypt'

interface RequestBody {
  email: string
  password: string
}

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json();
    const userId = await fetchRedis('get', `user:email:${body.email}`)
    if (!userId) return new Response("Something went wrong", { status: 400 });

    if (userId) {
      const user = await fetchRedis('get', `user:${userId}`)
      const parsedUser = JSON.parse(user)

      if (parsedUser && (await bcrypt.compare(body.password, parsedUser.password))) {
        const { password, ...userWithoutPass } = parsedUser
        const accessToken = signJwtAccessToken(userWithoutPass)
        const result = {
          ...userWithoutPass,
          accessToken,
        };
        return new Response(JSON.stringify(result));
      }
    }
  } catch (err) {
    if (err instanceof AxiosError) {
      
      return new Response(err.response?.data)
    }
    
    return new Response("Something went wrong", { status: 400 });
  }

}
