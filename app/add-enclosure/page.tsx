import Link from "next/link"
import prisma from "@/util/prisma-client"
import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"

async function createEnclosure(data: FormData) {

  "use server"

    //console.log(data);

    const session = await getServerSession(authOptions);
    const email: any = session?.user?.email;
    const petIds = data.getAll("petIds");
    const enclosureName = data.get("enclosureName")?.valueOf();

    async function addEnclosureToAnimal(petId: number) {
        const newEnclosure = await prisma.enclosure.findFirst({
            where: {
                name: enclosureName,
                userEmail: email
            }
        })

        await prisma.animal.update({
            where: {
                id: petId,
            },
            data: {
                enclosureId: newEnclosure?.id,
            }
        })
    }

    if (typeof(enclosureName) !== "string" || enclosureName.length === 0) {
        redirect("/add-enclosure");
    }

    const userEnclosures = await prisma.user.findFirst({
        where: {
            email: email,
        },
        include: {
            Enclosure: true,
    }})

    //Redirects if the enclosure name the user chose already exists in their enclosures
    userEnclosures?.Enclosure.forEach(element => {
        if (element.name === enclosureName) {
            console.log("enclosure already exists");
            redirect("/add-enclosure")
        }
    });

    //Create new enclosure
    await prisma.enclosure.create({ data: {
        name: enclosureName,
        userEmail: email
    }})

    //If there were animals selected, it adds the animals the newly created enclosure
    if (petIds.length > 0) {
        for (let index = 0; index < petIds.length; index++) {
            if (typeof(petIds[index].valueOf()) === "object") {
                throw Error("petId cannot be an object to set its enclosure")
            }
            const petId: number = parseInt(petIds[index].valueOf().toString());
            addEnclosureToAnimal(petId)
            
        }
    }
    redirect("/");
}


export default async function AddEnclosure() {

    const session = await getServerSession(authOptions);

    if(!session) {
        return (
            <>
                <div className="text-center">
                  Must be logged in to add an enclosure your family.
                </div>
                <form method="get" action="/api/auth/signin">
                  <button type="submit" className="mx-2 px-2 rounded text-zinc-300 bg-zinc-700 hover:bg-zinc-300 hover:text-zinc-900 transition">
                    Log In
                  </button>
                </form>
            </>
        )
    }

    //call all animals for a user and return a mapped list of them that dont have enclosures yet ** for every animal
    const email: any = session?.user?.email

    const userAnimalsEnclosures = await prisma.user.findFirst({
        where: {
            email: email
        },
        include: {
            animals: true,
            Enclosure: true
        }
    })

    let animalCount = userAnimalsEnclosures?.animals.length

    if (animalCount === undefined) {
        return (
            <div className="text-center">
                  Must have animals to add an enclosure.
            </div>
        )
    }

    const animalCheckboxList = userAnimalsEnclosures?.animals.map(animal => 
        <div className="flex py-2 items-center" key={animal.id}>
            <input id={animal.id.toString()} name="petIds" value={animal.id.toString()} type="checkbox" className="rounded-lg"></input>
            <label htmlFor={animal.id.toString()}><strong className="ml-2">{animal.name}</strong>{animal.enclosureId ? <span className="text-zinc-500">: Has an enclosure</span> : <></>}</label>
        </div>
    );

  return (
    <div className="flex flex-col items-center justify-center m-auto">
        <div className="text-4xl text-zinc-600">Add an Enclosure</div>
        <span className="text-zinc-500 text-center m-4">If an animal already has an enclosure, then it will be moved to the new enclosure.</span>
        <form action={createEnclosure} className="flex flex-col gap-4 mx-4">
            <input required autoFocus type="text" placeholder="Enclosure Name" name="enclosureName" className="rounded text-black px-2"></input>
            {animalCheckboxList}
            <div className="flex justify-evenly">
                <Link href=".">Cancel</Link>
                <button type="submit" className="px-2 rounded text-zinc-100 bg-zinc-700 hover:bg-zinc-300 hover:text-zinc-900 transition">Add Enclosure</button>
            </div>
        </form>
    </div>
  )
}