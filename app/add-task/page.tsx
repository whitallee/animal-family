import Link from "next/link"
import prisma from "@/util/prisma-client"
import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation" 
import { InfoIcon } from "lucide-react"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
  

async function createTask(data: FormData) {

  "use server"

    const session = await getServerSession(authOptions);
    const taskSubject = data.get("taskSubject")?.valueOf()
    const taskName = data.get("taskName")?.valueOf()
    const repeatOption = data.get("repeatOption")?.valueOf()
    const repeatInterval = data.get("repeatInterval")?.valueOf()
    const textOption = data.get("textOption")?.valueOf()
    const email: any = session?.user?.email

    const userAnimalsEnclosures = await prisma.user.findFirst({
        where: {
            email: email,
        },
        include: {
            animals: true,
            enclosures: true,
        }
    })

    if (typeof(userAnimalsEnclosures?.animals) === "undefined") {
        console.log("userAnimalsEnclosures: " + userAnimalsEnclosures);
        redirect("/add-task")
    }

    if (typeof(taskSubject) !== "string" || taskSubject.length === 0) {
        console.log("taskSubject: " + taskSubject);
        redirect("/add-task")
    }
    else if (typeof(taskName) !== "string" || taskName.length === 0) {
        console.log("taskName: " + taskName);
        redirect("/add-task")
    }

    if (typeof(repeatInterval) !== "string" || parseInt(repeatInterval) < 1) {
        console.log("repeatInterval: " + repeatInterval);
        console.log(typeof(repeatInterval));
        redirect("add-task")
    }

    //check if taskSubject is an animal or enclosure, then add the related subject to the task
    for await (const animal of userAnimalsEnclosures?.animals){
        if (taskSubject === animal.name) {
            await prisma.task.create({ data: {
                animalId: animal.id,
                task: taskName,
                userEmail: email,
                lastCompleted: new Date(),
                textEnabled: textOption ? true : false,
                phoneNumber: textOption ? userAnimalsEnclosures.phoneNumber : null,
                repeatDayInterval: repeatOption ? parseInt(repeatInterval) : null,
            }})
            redirect("/tasks")
        }
    }

    for await (const enclosure of userAnimalsEnclosures?.enclosures){
        if (taskSubject === enclosure.name) {
            await prisma.task.create({ data: {
                enclosureId: enclosure.id,
                task: taskName,
                userEmail: email,
                lastCompleted: new Date(),
                textEnabled: textOption ? true : false,
                phoneNumber: textOption ? userAnimalsEnclosures.phoneNumber : null,
                repeatDayInterval: repeatOption ? parseInt(repeatInterval) : null,
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
            enclosures: true,
        }
    })

    const animalOptions = userAnimalsEnclosures?.animals.map(animal =>
            <option className="text-zinc-700" key={animal.name} value={animal.name}>{animal.name}</option>
        )
    
    const enclosureOptions = userAnimalsEnclosures?.enclosures.map(enclosure =>
        <option className="text-zinc-700" key={enclosure.name} value={enclosure.name}>{enclosure.name}</option>
    )

  return (
    <div className="flex flex-col items-center justify-center m-auto">
        <div className="text-4xl text-zinc-600 m-8 flex items-center gap-2">
            <span>Create a Task</span>
            <Popover>
                <PopoverTrigger><InfoIcon/></PopoverTrigger>
                <PopoverContent className="text-sm">
                    Enabling "Repeat task" will mark the task "Not Completed"
                    after it has been completed for the number of days you set the interval to.<br/><br/>
                    Texting is only functional on repeating tasks and will text you when your task
                    needs to be completed again.
                </PopoverContent>
            </Popover>
        </div>
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
            <div className="flex gap-4"><input type="checkbox" id="repeatOption" name="repeatOption"></input><label htmlFor="repeatOption">Repeat this task:</label><span className="flex gap-2"><>every</><input id="repeatInterval" name="repeatInterval" className="text-zinc-900 w-[5ch] rounded pl-2" type="number" min="1" defaultValue={1}></input><>day(s)</></span></div>
            {userAnimalsEnclosures?.phoneNumber ? 
                <div className="flex gap-4"><input id="textOption" type="checkbox" name="textOption" value="true"></input><label htmlFor="textOption">Enable texting to {userAnimalsEnclosures?.phoneNumber}</label></div>
                :
                //No verified phone number available. Add a phone number to your account to enable task texting.
                <div className="flex gap-4 text-zinc-600"><input disabled id="textOption" name="textOption" type="checkbox"></input><label htmlFor="textOption">Enable Texting (not available)</label></div>}
            <div className="flex justify-evenly">
                <Link href=".">Cancel</Link>
                <button type="submit" className="px-2 rounded text-zinc-100 bg-zinc-700 hover:bg-zinc-300 hover:text-zinc-900 transition">Add Task</button>
            </div>
        </form>
    </div>
  )
}