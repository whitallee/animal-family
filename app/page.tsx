import { getServerSession } from "next-auth"
import { authOptions } from "./api/auth/[...nextauth]/route";
import prisma from "@/util/prisma-client";
import { redirect } from "next/navigation";
import { TrashIcon } from "lucide-react";
import Link from "next/link";

function join(arrayStr: string[]) {
    let joined: string = "";
    arrayStr.forEach(str => {
        joined = joined + str;        
    });
    return (joined)
}

async function deleteAnimal(data: FormData) {
  "use server"
// @ts-ignore ignores 'animalId' type of 'string | Object | undefined'
  const animalId: number = parseInt(data.get("animalId")?.valueOf())

  await prisma.animal.delete({ 
      where: {
        id: animalId
      }})

  redirect("/")
}

async function deleteEnclosure(data: FormData) {
    "use server"
  // @ts-ignore ignores 'enclosureId' type of 'string | Object | undefined'

  //need to make animal enclosureId null
    const enclosureId: number = parseInt(data.get("enclosureId")?.valueOf())
    console.log(enclosureId);

    await prisma.animal.updateMany({
        where: {
            enclosureId: enclosureId,
        },
        data: {
            enclosureId: null,
        }
    })
  
    await prisma.enclosure.delete({
        where: {
          id: enclosureId,
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
                  <button type="submit" className="mx-2 px-2 rounded text-zinc-300 bg-zinc-700 hover:bg-zinc-300 hover:text-zinc-900 transition">Log In</button>
                </form>
            </>
        )
    }

    const email: any = session?.user?.email

    const userAnimalsEnclosures = await prisma.user.findFirst({
        where: {
            email: email
        },
        include: {
            animals: true,
            Enclosure: true,
        }
    })

    //creating empty arrays for sperating enclosure and non-enclosure animals
    let noEnclosureAnimals: {id: number, name: string, species: string}[] = []
    userAnimalsEnclosures?.animals.forEach(animal => {
        if (!animal.enclosureId) {
            noEnclosureAnimals.push({
                name: animal.name,
                species: animal.species,
                id: animal.id,
            })
        }
    });

    const animalListItems = noEnclosureAnimals.map(animal => 
            <li key={animal.id} className="flex place-content-between items-center gap-8 py-4 px-8">
                <span><strong><Link href={join(["/about/", animal.name.toString(), "/", animal.id.toString()])}>{animal.name}</Link>: </strong><span className="text-zinc-500 italic">{animal.species}</span></span>
                <form action={deleteAnimal}>
                  <input type="hidden" id="animalId" name="animalId" value={animal.id}/>
                  <button type="submit" className="rounded aspect-square px-2 hover:bg-zinc-600 transition"><TrashIcon className="h-4"/></button>
                </form>
            </li>
        );

    //creating enclosure array with animals attached
    let enclosureAnimals: {id: number, name: string, enclosureAnimalList: {id: number, name: string, species: string}[]}[] = []
    userAnimalsEnclosures?.Enclosure?.forEach(enclosure => {
         let enclosureFamily = userAnimalsEnclosures.animals.filter((animal) => animal.enclosureId === enclosure.id)
         let enclosureObject = {
            id: enclosure.id,
            name: enclosure.name,
            enclosureAnimalList: enclosureFamily,
         }
         enclosureAnimals.push(enclosureObject)
    })

    const enclosureAnimalListItems = enclosureAnimals.map(enclosure =>
            <li key={enclosure.id} className="border-solid border-zinc-500 border-2 rounded-xl m-4">
                <div className="flex gap-2 items-center pt-2 pl-4">
                    <strong><Link href={join(["/about-enclosure/", enclosure.name.toString(), "/", enclosure.id.toString()])}>{enclosure.name}</Link></strong>
                    <form action={deleteEnclosure}>
                    <input type="hidden" id="enclosureId" name="enclosureId" value={enclosure.id}/>
                    <button type="submit" className="rounded aspect-square px-2 hover:bg-zinc-600 transition"><TrashIcon className="h-4"/></button>
                    </form>
                </div>
                <div className="w-full border border-zinc-500 rounded mt-2"></div>
                <ul>
                    {enclosure.enclosureAnimalList.map(animal =>
                        <li key={animal.id} className="flex place-content-between items-center gap-8 py-4 pr-4 pl-8">
                        <span><Link href={join(["/about/", animal.name.toString(), "/", animal.id.toString()])}>{animal.name}</Link>: <span className="text-zinc-500 italic">{animal.species}</span></span>
                        <form action={deleteAnimal}>
                          <input type="hidden" id="animalId" name="animalId" value={animal.id}/>
                          <button type="submit" className="rounded aspect-square px-2 hover:bg-zinc-600 transition"><TrashIcon className="h-4"/></button>
                        </form>
                        </li>
                    )}
                </ul>
            </li>
        );

    if (animalListItems?.length === 0 && enclosureAnimalListItems?.length === 0){
        return (
            <div className="text-center">
                You don't have any animals or enclosure in your family yet, add one to see your family.
            </div>
        )
    }

    return (
        <>
            <ul>
                {animalListItems}
                {enclosureAnimalListItems}
            </ul>
        </>
    )
}