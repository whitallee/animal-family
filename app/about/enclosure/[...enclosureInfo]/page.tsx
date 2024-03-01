import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/utils";
import prisma from "@/util/prisma-client";
import NotLoggedIn from "@/components/NotLoggedIn";

export default async function AboutEnclosure ({params: { enclosureInfo }}: {params: {enclosureInfo: string}}) {
    const session = await getServerSession(authOptions);

    if(!session){
        return (<NotLoggedIn message="Must be logged in to view this enclosure's info."/>)
    }

    const email: any = session?.user?.email

    const enclosureObject = await prisma.enclosure.findFirst({
        where: {
            name: decodeURI(enclosureInfo[0]),
            id: parseInt(enclosureInfo[1])
        },
    })

    const userObject = await prisma.user.findFirst({
        where: {
            email: email
        },
        include: {
            animals: true,
            enclosures: true,
        }
    })

    if (userObject?.email !== enclosureObject?.userEmail) {
        return (
            <div className="text-center">You are not authorized to view this enclosure.</div>
        )
    }

    let animalArray: string[] = []
    userObject?.animals.filter(animal => animal.enclosureId === enclosureObject?.id).forEach(animal =>
        animalArray.push(animal.name + ", ")
    )
    animalArray[animalArray.length-1] = animalArray[animalArray.length-1].slice(0, -2)

    const animalList = animalArray.map(animal =>
            <div key={animal} className="inline">{animal}</div>
    )

    return (
        <div className="text-center">
            <h1 className="text-xl">{enclosureObject?.name}</h1>
            <h2 className="text-zinc-500 italic">{animalList}</h2>
        </div>
    )
}