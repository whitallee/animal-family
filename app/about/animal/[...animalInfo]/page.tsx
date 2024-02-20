import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/utils";
import prisma from "@/util/prisma-client";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
import { MoreVerticalIcon, TrashIcon, EditIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { stringJoin } from "@/lib/utils";

async function deleteTask(data: FormData) {
    "use server"
  // @ts-ignore ignores 'taskId' type of 'string | Object | undefined'
    const taskId: number = parseInt(data.get("taskId")?.valueOf())
  // @ts-ignore ignores 'animalName' type of 'string | Object | undefined'
    const animalName: string = data.get("animalName")?.valueOf()
  // @ts-ignore ignores 'animalId' type of 'string | Object | undefined'
    const animalId: string = data.get("animalId")?.valueOf()
    const session = await getServerSession(authOptions)
    const email: any = session?.user?.email
  
    await prisma.task.delete({ 
        where: {
          id: taskId,
          userEmail: email
    }})
  
    redirect(stringJoin(["/about/animal/", animalName, "/", animalId]))
  }

export default async function AboutAnimal ({params: { animalInfo }}: {params: {animalInfo: string}}) {
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
            name: decodeURI(animalInfo[0]),
            id: parseInt(animalInfo[1])
        },
    })

    if (animalObject === null) {
        redirect("/")
    }

    const userObject = await prisma.user.findFirst({
        where: {
            email: email
        },
        include: {
            enclosures: true,
            tasks: true,
        }
    })

    const animalTasks = userObject?.tasks.filter(task => task.animalId === animalObject.id)

    let enclosureTasks: {
        id: number;
        enclosureId: number | null;
        animalId: number | null;
        task: string;
        complete: boolean;
        userEmail: string;
    }[] | undefined

    if (animalObject?.enclosureId) {
        enclosureTasks = userObject?.tasks.filter(task => task.enclosureId === animalObject.enclosureId)
    }

    const animalTaskItems = animalTasks?.map(task => 
        <li key={task.id} className="flex place-content-between items-center gap-8 py-4 px-8">
            <div>{task.task}</div>
            <div className="flex">
                <DropdownMenu>
                    <DropdownMenuTrigger className="rounded aspect-square px-2 hover:bg-zinc-600 transition"><MoreVerticalIcon className="h-4"/></DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel><span>Edit Task</span></DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Link className="w-full rounded flex justify-between items-center px-2 hover:bg-zinc-600 hover:text-white transition" href={stringJoin(["/edit/task/", task.task, "/", task.id.toString()])}>Edit<EditIcon className="h-4"/></Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <form action={deleteTask} className="w-full">
                                <input type="hidden" id="taskId" name="taskId" value={task.id}/>
                                <input type="hidden" id="animalName" name="animalName" value={animalObject.name}/>
                                <input type="hidden" id="animalId" name="animalId" value={animalObject.id.toString()}/>
                                <button type="submit" className="w-full rounded flex justify-between items-center px-2 hover:bg-zinc-600 hover:text-white transition">Remove<TrashIcon className="h-4"/></button>
                            </form>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </li>
    )

    const enclosureName: string | undefined = userObject?.enclosures.find(enclosure => enclosure.id === animalObject?.enclosureId)?.name

    const enclosureTaskItems = enclosureTasks?.map(task => 
        <li key={task.id} className="flex place-content-between items-center gap-8 py-4 px-8">
            <div>{task.task}<span className="italic text-zinc-500"> - {enclosureName}</span></div>
            <div className="flex">
                <DropdownMenu>
                    <DropdownMenuTrigger className="rounded aspect-square px-2 hover:bg-zinc-600 transition"><MoreVerticalIcon className="h-4"/></DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel><span>Edit Task</span></DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <form action={deleteTask} className="w-full">
                                <input type="hidden" id="taskId" name="taskId" value={task.id}/>
                                <button type="submit" className="w-full rounded flex justify-between items-center px-2 hover:bg-zinc-600 hover:text-white transition">Remove<TrashIcon className="h-4"/></button>
                            </form>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </li>
    )

    if (userObject?.id !== animalObject?.userId) {
        return (
            <div className="text-center">You are not authorized to view this animal.</div>
        )
    }

    return (
        <div className="text-center">
            <h1 className="text-xl">{animalObject?.name}</h1>
            <h2 className="text-zinc-500 italic">{animalObject?.species}</h2>
            {animalObject?.enclosureId ? <h2 className="text-zinc-500 italic">Lives in {enclosureName}</h2>: ""}
            <h2 className={(animalTasks?.length || enclosureTasks?.length) ? "text-zinc-500 italic mt-10" : "hidden"}>{animalObject.name}'s Tasks</h2>
            <ul>
                {animalTaskItems}
                {enclosureTaskItems}
            </ul>
        </div>
    )
}