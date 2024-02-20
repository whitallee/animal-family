import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/utils";
import prisma from "@/util/prisma-client";
import Link from "next/link";
import { redirect } from "next/navigation";

async function editAnimalNameSpecies (data: FormData) {
    "use server"
    const session = await getServerSession(authOptions);
    const petName = data.get("petName")?.valueOf();
    const species = data.get("species")?.valueOf();
    const animalId = data.get("animalId")?.valueOf();
    const email: any = session?.user?.email;

    if (typeof(petName) !== "string" || petName.length === 0) {
        redirect("/")
    }
    else if (typeof(species) !== "string" || species.length === 0) {
        redirect("/")
    }
    else if (typeof(animalId) !== "string") {
        redirect("/")
    };

    await prisma.animal.update({ data: {
        name: petName,
        species: species,
        User: {
            connect: {
                email: email,
            }
        }},
        where: {
            id: parseInt(animalId)
    }});

    await prisma.task.updateMany({ data: {
        subjectName: petName,
    },
    where: {
        animalId: parseInt(animalId),
    }});

    redirect("/");

};

export default async function EditAnimal ({params: { animalInfo }}: {params: {animalInfo: string}}) {
    const session = await getServerSession(authOptions);

    if(!session){
        return (
            <>
                <div className="text-center">
                    Must be logged in to edit this Animal.
                </div>
                <form method="get" action="/api/auth/signin">
                  <button type="submit" className="mx-2 px-2 rounded text-zinc-300 bg-zinc-700 hover:bg-zinc-300 hover:text-zinc-900 transition">Log In</button>
                </form>
            </>
        )
    };

    const email: any = session?.user?.email;

    const animalObject = await prisma.animal.findFirst({
        where: {
            name: decodeURI(animalInfo[0]),
            id: parseInt(animalInfo[1])
        },
    });

    const userObject = await prisma.user.findFirst({
        where: {
            email: email
        },
        include: {
            enclosures: true,
            animals: true,
        }
    });

    const enclosureName: string | undefined = userObject?.enclosures.find(enclosure => enclosure.id === animalObject?.enclosureId)?.name

    if (userObject?.id !== animalObject?.userId) {
        return (
            <div className="text-center">You are not authorized to edit this animal.</div>
        )
    };

    return (
        <div className="flex flex-col items-center justify-center m-auto">
            <div className="text-4xl text-zinc-600 m-8">Edit {animalObject?.name}</div>
            <form action={editAnimalNameSpecies} className="flex flex-col gap-8">
                <input required autoFocus type="text" placeholder="Pet Name" defaultValue={animalObject?.name} name="petName" className="rounded text-black px-2"></input>
                <input required type="text" placeholder="Species" defaultValue={userObject?.animals.find(animal => animal.name === animalObject?.name)?.species} name="species" className="rounded text-black px-2"></input>
                <input type="hidden" id="animalId" name="animalId" value={animalObject?.id.toString()}></input>
                <div className="flex justify-evenly">
                    <Link href="/">Cancel</Link>
                    <button type="submit" className="px-2 rounded text-zinc-100 bg-zinc-700 hover:bg-zinc-300 hover:text-zinc-900 transition">Update Animal</button>
                </div>
            </form>
        </div>
    )
};