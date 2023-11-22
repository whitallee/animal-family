import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import prisma from '@/util/prisma-client';
import Link from 'next/link';
import { TrashIcon } from 'lucide-react';
import { redirect } from 'next/navigation';
import { MoreVerticalIcon } from 'lucide-react';
import { stringJoin } from '@/lib/utils';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"

async function deleteTask(data: FormData) {
    "use server"
  // @ts-ignore ignores 'animalId' type of 'string | Object | undefined'
    const taskId: number = parseInt(data.get("taskId")?.valueOf())
    const session = await getServerSession(authOptions)
    const email: any = session?.user?.email
  
    await prisma.toDoItem.delete({ 
        where: {
          id: taskId,
          userEmail: email
        }})
  
    redirect("/tasks")
  }

export default async function Tasks() {
    const session = await getServerSession(authOptions)

    if(!session) {
        return (
            <>
                <div className="text-center">
                  Must be logged in to view your tasks.
                </div>
                <form method="get" action="/api/auth/signin">
                  <button type="submit" className="mx-2 px-2 rounded text-zinc-300 bg-zinc-700 hover:bg-zinc-300 hover:text-zinc-900 transition">
                    Log In
                  </button>
                </form>
            </>
        )
    }

    const email: any = session?.user?.email

    const userTasksAnimalsEnclosures = await prisma.user.findFirst({
        where: {
            email: email
        },
        include: {
            animals: true,
            Enclosure: true,
            ToDoItem: true,
        }
    })

    if (userTasksAnimalsEnclosures?.ToDoItem.length === 0) {
        return (
            <>
                <div className="text-center">You have no tasks.</div>
                <form action="/add-task">
                    <button type="submit" className="mx-2 px-2 rounded text-zinc-300 bg-zinc-700 hover:bg-zinc-300 hover:text-zinc-900 transition">
                    Add Task
                    </button>
                </form>
            </>
        )
    }

    //Animal Tasks
    let animalTasks: {id: number, task: string, animalName: string | undefined, animalId: number, complete: boolean}[] = []
    userTasksAnimalsEnclosures?.ToDoItem.forEach(task => {
        if (task.animalId) {
            animalTasks.push({
                id: task.id,
                task: task.task,
                animalName: userTasksAnimalsEnclosures.animals.find(animal => animal.id === task.animalId)?.name,
                animalId: task.animalId,
                complete: task.complete
            })
        }
    });
    const animalTaskItems = animalTasks.map(task => 
            <li key={task.id} className="flex place-content-between items-center gap-8 py-4 px-8">
                <span><strong><Link href="/">{task.task}</Link>: </strong><span className="text-zinc-500 italic">{task.animalName}</span></span>
                <div className="flex">
                    <DropdownMenu>
                        <DropdownMenuTrigger className="rounded aspect-square px-2 hover:bg-zinc-600 transition"><MoreVerticalIcon className="h-4"/></DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel><span className="">Edit {task.animalName}'s Task</span></DropdownMenuLabel>
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
    );

    //Enclosure Tasks
    let enclosureTasks: {id: number, task: string, enclosureName: string | undefined, enclosureId: number, complete: boolean}[] = []
    userTasksAnimalsEnclosures?.ToDoItem.forEach(task => {
        if (task.enclosureId) {
            enclosureTasks.push({
                id: task.id,
                task: task.task,
                enclosureName: userTasksAnimalsEnclosures.Enclosure.find(enclosure => enclosure.id === task.enclosureId)?.name,
                enclosureId: task.enclosureId,
                complete: task.complete
            })
        }
    });
    const enclosureTaskItems = enclosureTasks.map(task => 
            <li key={task.id} className="flex place-content-between items-center gap-8 py-4 px-8">
                <span><strong><Link href="/">{task.task}</Link>: </strong><span className="text-zinc-500 italic">{task.enclosureName}</span></span>
                <div className="">
                    <DropdownMenu>
                        <DropdownMenuTrigger className="rounded aspect-square px-2 hover:bg-zinc-600 transition"><MoreVerticalIcon className="h-4"/></DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel><span className="">Edit {task.enclosureName}'s Task</span></DropdownMenuLabel>
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
    );

    return (
        <>
            <div className="text-4xl text-zinc-600">My Tasks</div>
            <ul>
                {animalTaskItems}
                {enclosureTaskItems}
            </ul>
        </>
    )
}