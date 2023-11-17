import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/util/prisma-client";

export default async function AboutAnimal ({params: { animal }}: {params: {animal: string}}) {
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

    const email: any = session?.user?.email

    const animalObject = await prisma.animal.findFirst({
        where: {
            name: decodeURI(animal[0]),
            id: parseInt(animal[1])
        },
    })

    const userObject = await prisma.user.findFirst({
        where: {
            email: email
        }
    })

    //console.log(animalObject, userObject);

    if (userObject?.id !== animalObject?.userId) {
        return (
            <div className="text-center">You are not authorized to view this animal.</div>
        )
    }

    return (
        <div className="text-center">
            <h1 className="text-xl">{animalObject?.name}</h1>
            <h2 className="text-zinc-500 italic">{animalObject?.species}</h2>
            {animalObject?.enclosureId ? <h2>In Enclosure {animalObject.enclosureId}</h2>: ""}
        </div>
    )
}