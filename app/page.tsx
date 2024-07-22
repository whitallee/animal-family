import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/utils";
import Link from "next/link";
import { PawPrint, Home } from "lucide-react";

import { Poppins } from 'next/font/google'
import WelcomeTextScroll from "@/components/WelcomeTextScroll";
const poppins = Poppins({ weight: ["300"], subsets: ["latin"] })

export default async function MyFamily() {

    const session = await getServerSession(authOptions);
    const email: any = session?.user?.email;

    return (
        <>
            <div className="w-[100svw] flex flex-col items-center justify-center gap-4 px-4">
                <h1 className={poppins.className + " text-5xl text-[#659d40] text-center"}>Animal Family</h1>
                <div className="h-[50svh] flex flex-col justify-center items-center">
                    <h2 className="text-3xl pb-4">Never forget to...
                        {/* <WelcomeTextScroll/> */}
                    </h2>
                    {/* just do a vertical carousel */}
                    <div className="i-msg-bubble text-4xl bg-blue-600 p-4 rounded-3xl">Bathe Rocco</div>
                </div>
            </div>
        </>
    )
}