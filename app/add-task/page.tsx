import Link from "next/link"
import prisma from "@/util/prisma-client"
import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"

async function createTask(data: FormData) {

  "use server"

    const session = await getServerSession(authOptions);
    const taskSubject = data.get("taskSubject")?.valueOf()
    const taskName = data.get("taskName")?.valueOf()
    const email: any = session?.user?.email

    const userAnimalsEnclosures = await prisma.user.findFirst({
        where: {
            email: email,
        },
        include: {
            animals: true,
            Enclosure: true,
        }
    })

    if (typeof(userAnimalsEnclosures?.animals) === "undefined") {
        redirect("/tasks")
    }

    if (typeof(taskSubject) !== "string" || taskSubject.length === 0) {
        redirect("/add-task")
    }
    else if (typeof(taskName) !== "string" || taskName.length === 0) {
        redirect("/add-task")
    }

    //check if taskSubject is an animal or enclosure, then add the related subject to the task
    for await (const animal of userAnimalsEnclosures?.animals){
        if (taskSubject === animal.name) {
            await prisma.toDoItem.create({ data: {
                animalId: animal.id,
                task: taskName,
                userEmail: email
            }})
            redirect("/tasks")
        }
    }

    for await (const enclosure of userAnimalsEnclosures?.Enclosure){
        if (taskSubject === enclosure.name) {
            await prisma.toDoItem.create({ data: {
                enclosureId: enclosure.id,
                task: taskName,
                userEmail: email
            }})
            redirect("/tasks")
        }
    }
}


export default async function AddAnimal() {

    const session = await getServerSession(authOptions);

    if(!session) {
        return (
            <>
                <div className="text-center">
                  Must be logged in to add a task.
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
    
    const enclosureOptions = userAnimalsEnclosures?.Enclosure.map(enclosure =>
        <option className="text-zinc-700" key={enclosure.name} value={enclosure.name}>{enclosure.name}</option>
    )

  return (
    <main className="flex flex-col items-center justify-center m-auto">
      <div className="text-4xl text-zinc-600 m-8">Create a Task</div>
      <form action={createTask} className="flex flex-col gap-8">
        <select required defaultValue="default" name="taskSubject" id="taskSubject" className="rounded text-zinc-900 p-0.5">
            <option disabled value="default" className="text-zinc-500">(Select an animal or enclosure)</option>
            <optgroup label="Animals">
                {animalOptions}
            </optgroup>
            <optgroup label="Enclosures">
                {enclosureOptions}
            </optgroup>
        </select>
        <input required autoFocus type="text" placeholder="Enter your task" name="taskName" className="rounded text-black px-2 h-fit"></input>
        <div className="flex justify-evenly">
            <Link href=".">Cancel</Link>
            <button type="submit" className="px-2 rounded text-zinc-100 bg-zinc-700 hover:bg-zinc-300 hover:text-zinc-900 transition">Add Task</button>
        </div>
      </form>
    </main>
  )
}