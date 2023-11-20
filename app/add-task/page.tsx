import Link from "next/link"
import prisma from "@/util/prisma-client"
import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"

async function createTask(data: FormData) {

  "use server"

    const session = await getServerSession(authOptions);
    const petName = data.get("petName")?.valueOf()
    const species = data.get("species")?.valueOf()
    const email: any = session?.user?.email

    if (typeof(petName) !== "string" || petName.length === 0) {
        redirect("/add-animal")
    }
    else if (typeof(species) !== "string" || species.length === 0) {
        redirect("/add-animal")
    }

    await prisma.animal.create({ data: {
        name: petName,
        species: species,
        User: {
            connect: {
                email: email,
            }
        }}})

    redirect("/")
}


export default async function AddAnimal() {

    const session = await getServerSession(authOptions);

    if(!session) {
        return (
            <>
                <div className="text-center">
                  Must be logged in to add an animal to your family.
                </div>
                <form method="get" action="/api/auth/signin">
                  <button type="submit" className="mx-2 px-2 rounded text-zinc-300 bg-zinc-700 hover:bg-zinc-300 hover:text-zinc-900 transition">Log In</button>
                </form>
            </>
        )
    }

    const email = session?.user?.email

    const userAnimalsEnclosures = await prisma.user.findFirst({
        where: {
            email: email,
        },
        include: {
            animals: true,
            Enclosure: true,
        }
    })

    const animalOptions = userAnimalsEnclosures?.animals.map(animal =>
            <option className="text-zinc-700" key={animal.name} value={animal.name}>{animal.name}</option>
        )

  return (
    <main className="flex flex-col items-center justify-center m-auto">
      <form action={createTask} className="flex flex-col gap-4">
        <input required autoFocus type="text" placeholder="Enter your task" name="taskName" className="rounded text-black px-2"></input>
        <label className="mt-6" htmlFor="taskS+ubject">Choose an animal or enclosure:</label>
        <select required name="taskSubject" id="taskSubject" className="rounded text-zinc-400 p-0.5 mb-6">
            <option selected disabled>(Select one)</option>
            {animalOptions}
        </select>
        <div className="flex justify-evenly">
            <Link href=".">Cancel</Link>
            <button type="submit" className="px-2 rounded text-zinc-100 bg-zinc-700 hover:bg-zinc-300 hover:text-zinc-900 transition">Add Task</button>
        </div>
      </form>
    </main>
  )
}