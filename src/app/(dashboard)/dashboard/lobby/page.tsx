import SignInVideo from "@/components/video/SignUpVideo"
import { getServerSession } from "next-auth"
import { notFound } from "next/navigation"




const Page = async () => {

    const session = await getServerSession()
    if (!session) return notFound()

    return (
        <div>
            <SignInVideo userName={session.user.name} userId={session.user.id} />
        </div>
    )
}

export default Page