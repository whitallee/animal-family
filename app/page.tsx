import { getServerSession } from "next-auth"
import { authOptions } from "./api/auth/[...nextauth]/route";
import prisma from "@/util/prisma-client";
import { redirect } from "next/navigation";
import { TrashIcon } from "lucide-react";
import Link from "next/link";
import { stringJoin } from "@/lib/utils";
import { MoreVerticalIcon } from "lucide-react";
import { EditIcon } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"

  //Doesnt work in dropdown
  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"

  //Doesnt work in dropdown
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  
  

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
            enclosures: true,
        }
    })

    //creating non-enclosure array
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
            <li key={animal.id} className="flex place-content-between items-center gap-4 py-3 px-8">
                <span><strong><Link href={stringJoin(["/about/animal/", animal.name.toString(), "/", animal.id.toString()])}>{animal.name}</Link></strong><span className="text-zinc-500 italic"> - {animal.species}</span></span>
                <div className="flex">
                    <DropdownMenu>
                        <DropdownMenuTrigger className="rounded aspect-square px-2 hover:bg-zinc-600 transition"><MoreVerticalIcon className="h-4"/></DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel><span>{animal.name}</span></DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Link className="w-full rounded flex justify-between items-center px-2 hover:bg-zinc-600 hover:text-white transition" href={stringJoin(["/edit/animal/", animal.name.toString(), "/", animal.id.toString()])}>Edit<EditIcon className="h-4"/></Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <form action={deleteAnimal} className="w-full">
                                    <input type="hidden" id="animalId" name="animalId" value={animal.id}/>
                                    <button type="submit" className="w-full rounded flex justify-between items-center px-2 hover:bg-zinc-600 hover:text-white transition"><>Remove</><TrashIcon className="h-4"/></button>
                                </form>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </li>
        );

    //creating enclosure array with animals attached
    let enclosureAnimals: {id: number, name: string, enclosureAnimalList: {id: number, name: string, species: string}[]}[] = []
    userAnimalsEnclosures?.enclosures?.forEach(enclosure => {
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
                <div className="flex justify-between items-center pt-2 px-4">
                    <strong><Link href={stringJoin(["/about/enclosure/", enclosure.name.toString(), "/", enclosure.id.toString()])}>{enclosure.name}</Link></strong>
                    <div className="flex">
                            <DropdownMenu>
                                <DropdownMenuTrigger className="rounded aspect-square px-2 hover:bg-zinc-600 transition"><MoreVerticalIcon className="h-4"/></DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel><span className="">{enclosure.name}</span></DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <Link className="w-full rounded flex justify-between items-center px-2 hover:bg-zinc-600 hover:text-white transition" href={stringJoin(["/edit/enclosure/", enclosure.name.toString(), "/", enclosure.id.toString()])}>Edit<EditIcon className="h-4"/></Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="flex space-between">
                                        <form action={deleteEnclosure}  className="w-full">
                                            <input type="hidden" id="enclosureId" name="enclosureId" value={enclosure.id}/>
                                            <button type="submit" className="w-full rounded flex justify-between items-center px-2 hover:bg-zinc-600 hover:text-white transition"><>Remove</><TrashIcon className="h-4"/></button>
                                        </form>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                </div>
                <div className="w-full border border-zinc-500 rounded mt-2"></div>
                <ul>
                    {enclosure.enclosureAnimalList.map(animal =>
                        <li key={animal.id} className="flex place-content-between items-center gap-8 py-3 pr-4 pl-8">
                        <span><Link href={stringJoin(["/about/animal/", animal.name.toString(), "/", animal.id.toString()])}>{animal.name}</Link><span className="text-zinc-500 italic"> - {animal.species}</span></span>
                        <div className="flex">
                            <DropdownMenu>
                                <DropdownMenuTrigger className="rounded aspect-square px-2 hover:bg-zinc-600 transition"><MoreVerticalIcon className="h-4"/></DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel><span>{animal.name}</span></DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <Link className="w-full rounded flex justify-between items-center px-2 hover:bg-zinc-600 hover:text-white transition" href={stringJoin(["/edit/animal/", animal.name.toString(), "/", animal.id.toString()])}>Edit<EditIcon className="h-4"/></Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="flex space-between">
                                        <form action={deleteAnimal}  className="w-full">
                                            <input type="hidden" id="animalId" name="animalId" value={animal.id}/>
                                            <button type="submit" className="w-full rounded flex justify-between items-center px-2 hover:bg-zinc-600 hover:text-white transition"><>Remove</><TrashIcon className="h-4"/></button>
                                        </form>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
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
            <h1 className="text-4xl text-zinc-600">My Animal Family</h1>
            <ul>
                {animalListItems}
                {enclosureAnimalListItems}
            </ul>
        </>
    )
}