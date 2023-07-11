import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth/next";

export default NextAuth(authOptions)

// redis://default:4f8a0aee61e542f39e52b82a3a05b371@eu2-charmed-tomcat-30970.upstash.io:30970