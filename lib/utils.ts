import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/util/prisma-client";
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function stringJoin(arrayStr: string[]) {
  let joined: string = "";
  arrayStr.forEach(str => {
      joined = joined + str;        
  });
  return (joined)
}

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
      GoogleProvider({
          clientId: process.env.GOOGLE_ID ?? "",
          clientSecret: process.env.GOOGLE_SECRET ?? "",
      }),
  ],
};