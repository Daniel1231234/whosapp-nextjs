import type { NextAuthOptions } from "next-auth";
import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import { db } from "./db";
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { fetchRedis } from "@/helpers/redis"
import * as config from "../config/configuration"
import axios from "axios";

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
            clientId: config.default().googleClientId,
            clientSecret: config.default().googleClientSecret,
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: {},
                password: {},
            },
            async authorize(credentials, req) {
                try {
                    const apiUrl = process.env.VERCEL_ENV === 'production' ? `https://${process.env.VERCEL_URL}/api/login` : "http://localhost:3000/api/login";

                    const res = await axios.post(apiUrl, credentials)

                    const user = res.data
                    if (user) return user
                    else return null
                } catch (err) {
                    console.log(err)
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            const dbUserResult = (await fetchRedis('get', `user:${token.id}`)) as
                | string
                | null

            if (!dbUserResult) {
                if (user) {
                    token.id = user!.id
                }
                return token
            }

            const dbUser = JSON.parse(dbUserResult) as User

            return {
                id: dbUser.id,
                name: dbUser.name,
                email: dbUser.email,
                picture: dbUser.image,
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
        redirect({ url, baseUrl }) {
            return "/dashboard"
            // Allows relative callback URLs
            if (url.startsWith("/")) return `${baseUrl}${url}`
            // Allows callback URLs on the same origin
            else if (new URL(url).origin === baseUrl) return url
            return baseUrl
        }
    }
}


