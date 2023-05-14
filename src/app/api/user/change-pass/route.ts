import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import * as bcrypt from "bcrypt";
import { fetchRedis } from "@/helpers/redis";

export async function POST(req:Request) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized!", { status: 400 });
  const userRAW = await fetchRedis("get", `user:${session.user.id}`) as string;
  const user = JSON.parse(userRAW) as User;

  const { currPassword } = await req.json();

  const isMatch = await bcrypt.compare(currPassword, user.password);

  if (isMatch) {
    return new Response("OK");
  } else {
    return new Response("Not match!", { status: 400 });
  }
}
