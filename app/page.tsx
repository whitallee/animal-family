import { getServerSession } from "next-auth"
import { authOptions } from "./api/auth/[...nextauth]/route";
import prisma from "@/util/prisma-client";
import { redirect } from "next/navigation";

async function deleteAnimal(data: FormData) {
  "use server"
// @ts-ignore ignores 'animalId' type of 'string | Object | undefined'
  const animalId: string = data.get("animalId")?.valueOf()

  await prisma.animal.delete({ 
      where: {
        id: parseInt(animalId)
      }})

  redirect("/")
}

export default async function MyFamily() {

    const session = await getServerSession(authOptions);

    if(!session){
        return (
            <>
                <div className="text-center">
                    Must be logged in to view your animal family.
                </div>
                <form method="get" action="/api/auth/signin">
                  <button type="submit" className="mx-2 px-2 rounded text-zinc-300 bg-zinc-700 hover:bg-zinc-300 hover:text-zinc-900">Log In</button>
                </form>
            </>
        )
    }

    const email: any = session?.user?.email

    const animals = await prisma.user.findFirst({
        where: {
            email: email
        },
        include: {
            animals: true
        }
    })

    const animalList = animals?.animals.map(animal => 
            <li key={animal.id} className="text-zinc-500 flex place-content-between items-center gap-8 py-4 px-4">
                <span><strong className="dark:text-white text-black">{animal.name}: </strong>{animal.species}</span>
                <form action={deleteAnimal}>
                  <input type="hidden" id="animalId" name="animalId" value={animal.id}/>
                  <button type="submit" className="rounded aspect-square px-2 hover:bg-zinc-600">&#128465;</button>
                </form>
            </li>
        );

    if (animalList?.length === 0){
        return (
            <div className="text-center">
                You don't have any animals in your family yet, add an animal to see your family.
            </div>
        )
    }

    return (
        <>
            <ul>{animalList}</ul>
        </>
    )
}