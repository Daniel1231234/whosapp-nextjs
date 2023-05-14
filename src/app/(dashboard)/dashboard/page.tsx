import { getFriendsByUserId } from "@/helpers/get-friends-by-user-id";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { chatHrefContructor } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const demoImg = `https://robohash.org/${session.user.id}`
  const friends = getFriendsByUserId(session.user.id);
  const friendsWithLastMsg = await Promise.all(
    (
      await friends
    ).map(async (friend) => {
      const [lastMsg] = (await fetchRedis(
        "zrange",
        `chat:${chatHrefContructor(session.user.id, friend.id)}:messages`,
        -1,
        -1
      )) as string[]

      const pardesLastMsgs = JSON.parse(lastMsg)
      return {
        ...friend,
        pardesLastMsgs,
      };
    })
  );

  return (
    <div className="container dark:bg-slate-800 rounded-md py-12 ">
      <h1 className="font-bold text-5xl mb-8">Recent chats</h1>
      {friendsWithLastMsg.length === 0 ? (
        <p>No messages yes</p>
      ) : (
        friendsWithLastMsg.map((friend) => (
          <div
            key={friend.id}
            className="relative dark:border-transparent dark:bg-slate-900 bg-zinc-50 border border-zinc-200 p-3 rounded-md"
           >
            <div className="absolute  right-4 inset-y-0 flex items-center">
              <ChevronRight className="h-7 w-7 text-zinc-400" />
            </div>
            <Link
              href={`/dashboard/chat/${chatHrefContructor(
                session.user.id,
                friend.id
              )}`}
              className="relative sm:flex"
            >
              <div className="mb-4 flex-shrink-0 sm:mb-0 sm:mr-4">
                <div className="relative h-6 w-6">
                  <Image
                    fill
                    referrerPolicy="no-referrer"
                    className="rounded-full"
                    alt={`${friend.name} profile picture`}
                    src={friend.image ? friend.image : demoImg}
                    sizes="(max-width: 768px) 100vw,
                            (max-width: 1200px) 50vw,
                            33vw"
                  />
                </div>
              </div>
              <div>
                <h4 className='text-lg dark:text-slate-300 font-semibold'>{friend.name}</h4>
                <p className='mt-1 max-w-md  dark:text-zinc-400'>
                  <span className=''>
                    {friend.pardesLastMsgs.senderId === session.user.id
                      ? 'You: '
                      : ''}
                  </span>
                  {friend.pardesLastMsgs.text}
                </p>
              </div>
            </Link>
          </div>
        ))
        )}
        <div>
        </div>
    </div>
  );
};

export default Page;
