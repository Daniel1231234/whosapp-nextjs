import { NextAuthOptions } from "next-auth";
import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import { db } from "./db";
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from 'next-auth/providers/facebook';
import { fetchRedis } from "@/helpers/redis"

type Provider = 'google' | 'facebook'


function getProviderCredentials(providerName: Provider) {
    const clientId = providerName === 'google' ? process.env.GOOGLE_CLIENT_ID : process.env.FACEBOOK_CLIENT_ID
    const clientSecret = providerName === 'google' ? process.env.GOOGLE_CLIENT_SECRET : process.env.FACEBOOK_CLIENT_SECRET

    if (!clientId || clientId.length === 0) {
        throw new Error(`Missing ${providerName.toUpperCase()}_CLIENT_ID`)
    }

    if (!clientSecret || clientSecret.length === 0) {
        throw new Error(`Missing ${providerName.toUpperCase()}_CLIENT_SECRET`)
    }

    return { clientId, clientSecret }

}



export const authOptions: NextAuthOptions = {
    adapter: UpstashRedisAdapter(db),
    session: {
        strategy: 'jwt'
    },
    pages: {
        signIn: '/login'
    },
    providers: [
        GoogleProvider({
            clientId: getProviderCredentials('google').clientId,
            clientSecret: getProviderCredentials('google').clientSecret
        }),
        FacebookProvider({
            clientId: getProviderCredentials('facebook').clientId,
            clientSecret: getProviderCredentials('facebook').clientSecret
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            const dbUserRes = await fetchRedis('get', `user:${token.id}`) as string | null

            if (!dbUserRes) {
                if (user) token.id = user!.id
                return token
            }

            const dbUser = JSON.parse(dbUserRes) as User

            return {
                id: dbUser.id,
                name: dbUser.name,
                email: dbUser.email,
                picture: dbUser.image
            }
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id
                session.user.name = token.name
                session.user.email = token.email
                session.user.image = token.picture
            }

            return session
        },
        redirect() {
            return '/dashboard'
        }
    }
}


