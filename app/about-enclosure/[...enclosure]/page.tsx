import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/util/prisma-client";

export default async function AboutAnimal ({params: { enclosure }}: {params: {enclosure: string}}) {
    const session = await getServerSession(authOptions);

    if(!session){
        return (
            <>
                <div className="text-center">
                    Must be logged in to view animal info.
                </div>
                <form method="get" action="/api/auth/signin">
                  <button type="submit" className="mx-2 px-2 rounded text-zinc-300 bg-zinc-700 hover:bg-zinc-300 hover:text-zinc-900 transition">Log In</button>
                </form>
            </>
        )
    }

    // const email: any = session?.user?.email

    // const userAnimalsEnclosures = await prisma.user.findFirst({
    //     where: {
    //         email: email
    //     },
    //     include: {
    //         animals: true,
    //         Enclosure: true,
    //     }
    // })

    return (
        <>{decodeURI(enclosure)}</>
    )
}