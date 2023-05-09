import Editable from "@/components/Settings/Editable";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

interface PageProps {
    params: {
      userId: string;
    };
  }

  const Page = async ({params}:PageProps) => {
    const { userId } = params
    const session = await getServerSession(authOptions)
    if (!session) notFound()

    return (
        <div>
            <h1>Hello, {session.user.name}</h1>
            <Editable currEmail={session.user.email} currName={session.user.name} />
        </div>
    )
  }

  export default Page