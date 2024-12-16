import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/utils";
import Link from "next/link";
import { PawPrint, Home, ChevronDown } from "lucide-react";
import Image from "next/image";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
// import Autoplay from "embla-carousel-autoplay"
  

import { Poppins } from 'next/font/google'
import TextBubble from "@/components/TextBubble";
import Auth from "@/components/Auth";
const poppins = Poppins({ weight: ["300"], subsets: ["latin"] })

export default async function MyFamily() {

    const session = await getServerSession(authOptions);
    const email: any = session?.user?.email;

    return (
        <>
            <div className="w-[100svw] flex flex-col items-center justify-center gap-4 px-4">
                <h1 className={poppins.className + " text-5xl text-[#659d40] text-center"}>Animal Family</h1>
                <div className="h-[60svh] flex flex-col justify-center items-center">
                    <h2 className="text-3xl pb-4">Never forget to...</h2>
                    <Carousel orientation="vertical">
                        <CarouselContent className="h-[76px] md:h-[88px]">
                            <CarouselItem className="px-4"><TextBubble msg="Feed Rosalina a worm"/></CarouselItem>
                            <CarouselItem className="px-4"><TextBubble msg="Spray down Kuromi"/></CarouselItem>
                            <CarouselItem className="px-4"><TextBubble msg="Cut Blueberry's nails"/></CarouselItem>
                            <CarouselItem className="px-4"><TextBubble msg="50% water change"/></CarouselItem>
                            <CarouselItem className="px-4"><TextBubble msg="Feed Guava crickets"/></CarouselItem>
                            <CarouselItem className="px-4"><TextBubble msg="Clean ferret cage"/></CarouselItem>
                        </CarouselContent>
                        {/* <CarouselPrevious />
                        <CarouselNext /> */}
                    </Carousel>
                    <Auth/>
                </div>
                <div className="w-full flex flex-col justify-center items-center">
                    <h2>Learn More</h2>
                    <ChevronDown className="w-12 h-12"/>
                </div>
                <div className="flex flex-col items-center">
                    <p className="text-xl m-6 mb-16 text-center">Keep track of all your animals, and their needs.</p>
                    <Image src={"/family-page-screenshot.png"} alt="Screenshot of the Animal Family Page" height={450} width={300} className="border-[3px] border-[var(--green)] rounded-2xl scale-110 -translate-x-8"></Image>
                    <Image src={"/task-page-screenshot.png"} alt="Screenshot of the Animal Family Page" height={450} width={300} className="border-[3px] border-[var(--green)] rounded-2xl scale-110 translate-x-8"></Image>
                    <p className="text-xl my-16">Add your animals to your Animal Family page.<br/><br/>Add their tank/enclosure/cage.<br/><br/>Add their animal care needs to your task page.<br/><br/>Turn on text alerts.<br/><br/><span className="font-bold">Take better care of your pets than your ADHD has ever let you.</span></p>
                    <Auth/>
                </div>
            </div>
        </>
    )
}