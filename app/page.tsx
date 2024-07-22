import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/utils";
import Link from "next/link";
import { PawPrint, Home } from "lucide-react";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
  

import { Poppins } from 'next/font/google'
import TextMsgs from "@/components/TextMsgs";
import TextBubble from "@/components/TextBubble";
const poppins = Poppins({ weight: ["300"], subsets: ["latin"] })

export default async function MyFamily() {

    const session = await getServerSession(authOptions);
    const email: any = session?.user?.email;

    return (
        <>
            <div className="w-[100svw] flex flex-col items-center justify-center gap-4 px-4">
                <h1 className={poppins.className + " text-5xl text-[#659d40] text-center"}>Animal Family</h1>
                <div className="h-[50svh] flex flex-col justify-center items-center">
                    <h2 className="text-3xl pb-4">Never forget to...</h2>
                    {/* just do a vertical carousel */}
                    {/* <Carousel orientation="vertical" opts={{loop: true}} className="">
                        <CarouselContent>
                            <CarouselItem className="basis-1/2"><div className="i-msg-bubble text-4xl bg-blue-600 p-4 rounded-3xl">Bathe Rocco</div></CarouselItem>
                            <CarouselItem className="basis-1/2"><div className="i-msg-bubble text-4xl bg-blue-600 p-4 rounded-3xl">Water chang</div></CarouselItem>
                            <CarouselItem className="basis-1/2"><div className="i-msg-bubble text-4xl bg-blue-600 p-4 rounded-3xl">Clean cages</div></CarouselItem>
                            <CarouselItem className="basis-1/2"><div className="i-msg-bubble text-4xl bg-blue-600 p-4 rounded-3xl">Feed Sirius</div></CarouselItem>
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel> */}
                    <div className="i-msg-bubble text-4xl bg-blue-600 p-4 rounded-3xl">Bathe Rocco</div>
                    <TextBubble msg="Bathe Rocco"/>
                </div>
            </div>
        </>
    )
}