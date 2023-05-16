
import MainChat from "@/components/chatGPT/MainChat";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { GptMessageType, gptMessageArraySchema } from "@/lib/validation/message";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

async function getChatMessages(chatId: string) {
  const firstMessage = {
    id:'abcdefg',
    role:'gpt',
    text:"היי! אני ג'פטה, איך אני יכול לעזור לך היום?",
    createdAt:Date.now()
  }
  try {
    const res: string[] = await fetchRedis(
      "zrange",
      `chat:${chatId}:messages`,
      0,
      -1
    );
    const dbMessages = res.map((msg) => JSON.parse(msg) as Message);
    const reversedDbMessages = dbMessages.reverse();
    const messages = gptMessageArraySchema.parse(reversedDbMessages);
    const msgsWithFirstMsg = [...messages, firstMessage]
    return msgsWithFirstMsg as GptMessageType[]
  } catch (err) {
    notFound();
  }
}

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) return notFound();
  const chatId = `gpt-${session.user.id}`

  const initialMessages = await getChatMessages(chatId) as GptMessageType[]

  return (
    <>
      <MainChat initialMessages={initialMessages} chatId={chatId} />
    </>
  );
};

export default Page;
