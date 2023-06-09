import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { messageArrSchema } from "@/lib/validation/message";
import { getServerSession } from "next-auth";
import Messages from "@/components/Messages";
import ChatInput from "@/components/ChatInput";
import Image from "next/image";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    chatId: string;
  };
}

async function getChatMessages(chatId: string) {
  try {
    const res: string[] = await fetchRedis(
      "zrange",
      `chat:${chatId}:messages`,
      0,
      -1
    );
    const dbMessages = res.map((msg) => JSON.parse(msg) as Message);
    const reversedDbMessages = dbMessages.reverse();
    const messages = messageArrSchema.parse(reversedDbMessages);
    return messages;
  } catch (err) {
    notFound();
  }
}

const Page = async ({ params }: PageProps) => {
  const { chatId } = params;
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const { user } = session;
  const [userId1, userId2] = chatId.split("--");

  const demoImg = `https://robohash.org/${session.user.id}`

  if (user.id !== userId1 && user.id !== userId2) {
    notFound();
  }

  const chatPartnerId = user.id === userId1 ? userId2 : userId1;

  const chatPartnerRaw = (await fetchRedis(
    "get",
    `user:${chatPartnerId}`
  )) as string;

  const chatPartner = JSON.parse(chatPartnerRaw) as User;
  const initialMessages = await getChatMessages(chatId);

  return (
    <div className="flex-1 justify-between flex flex-col h-full max-h-[calc(100vh - 6rem)] relative sm:px-0 ">
      <div className="flex sm:items-center justify-between py-3 dark:border-transparent border-b-2 border-gray-200">
        <div className="relative flex items-center space-x-4">
          <div className="relative ">
            <div className="relative w-8 sm:w-12 h-8 sm:h-12">
              <Image
                fill
                referrerPolicy="no-referrer"
                src={chatPartner?.image ? chatPartner?.image : demoImg}
                alt={`${chatPartner?.name} profile picture`}
                className="rounded-full"
                sizes="(max-width: 768px) 100vw,
                            (max-width: 1200px) 50vw,
                            33vw"
              />
            </div>
          </div>

          <div className="flex flex-col leading-tight">
            <div className="text-xl flex items-center">
              <span className="text-gray-700 mr-3 dark:text-gray-50 font-semibold">
                {chatPartner?.name}
              </span>
            </div>

            <span className="text-sm text-gray-600 dark:text-gray-50 ">{chatPartner?.email}</span>
          </div>
        </div>
      </div>

      <Messages
        chatId={chatId}
        initialMessages={initialMessages}
        sessionId={session.user.id}
        chatPartner={chatPartner}
        sessionImg={session.user.image}
      />
      <ChatInput chatPartner={chatPartner} chatId={chatId} />
    </div>
  );
};

export default Page;
