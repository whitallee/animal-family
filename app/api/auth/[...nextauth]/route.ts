import NextAuth from "next-auth/next";
import { authOptions } from "@/lib/utils";

export const handler = NextAuth(authOptions);

export const GET = handler.handlers.GET;
export const POST = handler.handlers.POST;