import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

interface PageProps {
    params: {
      conferenceId: string;
    },
    children:React.ReactNode
  }
const Page = async ({ params }: PageProps) => {
    const { conferenceId } = params;
    const session = await getServerSession(authOptions);
    if (!session) notFound();

    return <div></div>
}

export default Page