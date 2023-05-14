import { NextAuthOptions } from "next-auth";
import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import { db } from "./db";
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from 'next-auth/providers/facebook'
import CredentialsProvider from "next-auth/providers/credentials"
import { fetchRedis } from "@/helpers/redis"
import axios from "axios";

type Provider = 'google' | 'facebook' | 'credentials'


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

const API = process.env.NODE_ENV === 'production' ? "/api/login" : "http://localhost:3000/api/login"

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
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email", placeholder: "Noakirel@example.com" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                try {
                    const res = await axios.post(API, credentials)
                    // console.log(res)
                    const user = res.data
                    console.log(user)
                    if ( user ) return user
                    else return null
                } catch (err) {
                    // console.log('huge error')
                    console.log(err)
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {

            const dbUserfromProviders = await fetchRedis('get', `user:${token.id}`) as string | null

            if (!dbUserfromProviders) {
                if (user) token.id = user!.id
                return token
            }

            const dbUser = JSON.parse(dbUserfromProviders) as User

            return {
                id: dbUser.id,
                name: dbUser.name,
                email: dbUser.email,
                picture: dbUser.image ? dbUser.image :  `https://robohash.org/${dbUser.id}`,
                username:dbUser.username,
                country:dbUser.country,
                street:dbUser.street,
                notification:dbUser.notification,
                provider:dbUser.provider
            }
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id
                session.user.name = token.name
                session.user.email = token.email
                session.user.image = token.picture
                session.user.username = token.username
                session.user.country = token.country
                session.user.street = token.street
                session.user.notification = token.notification
                session.user.provider = token.picture?.startsWith("https://lh3.googleusercontent.com") ? "Google" : ""
            }

            return session
        },
        redirect() {
            return '/dashboard'
        }
    }
}


