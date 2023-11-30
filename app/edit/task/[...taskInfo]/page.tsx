import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/util/prisma-client";
import Link from "next/link";
import { redirect } from "next/navigation";

async function editTaskName (data: FormData) {
    "use server"
    const session = await getServerSession(authOptions);
    const taskName = data.get("taskName")?.valueOf()
    const taskId = data.get("taskId")?.valueOf()
    const email: any = session?.user?.email

    if (typeof(taskName) !== "string" || taskName.length === 0) {
        redirect("/")
    }
    else if (typeof(taskId) !== "string" || taskId.length === 0) {
        redirect("/")
    }

    await prisma.toDoItem.update({
        data: {
            task: taskName,
        },
        where: {
            id: parseInt(taskId)
        }
    })

    redirect("/tasks")

}

export default async function EditTask ({params: { taskInfo }}: {params: {taskInfo: string}}) {
    const session = await getServerSession(authOptions);

    if(!session){
        return (
            <>
                <div className="text-center">
                    Must be logged in to edit this Task.
                </div>
                <form method="get" action="/api/auth/signin">
                  <button type="submit" className="mx-2 px-2 rounded text-zinc-300 bg-zinc-700 hover:bg-zinc-300 hover:text-zinc-900 transition">Log In</button>
                </form>
            </>
        )
    }

    const email: any = session?.user?.email

    const taskObject = await prisma.toDoItem.findFirst({
        where: {
            task: decodeURI(taskInfo[0]),
            id: parseInt(taskInfo[1])
        },
    })

    const userObject = await prisma.user.findFirst({
        where: {
            email: email
        },
        include: {
            ToDoItem: true,
        }
    })

    //const enclosureName: string | undefined = userObject?.Enclosure.find(enclosure => enclosure.id === animalObject?.enclosureId)?.name

    if (userObject?.email !== taskObject?.userEmail) {
        return (
            <div className="text-center">You are not authorized to edit this Task.</div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center m-auto">
            <div className="text-4xl text-zinc-600 m-8">Edit "{taskObject?.task}" Task</div>
            <form action={editTaskName} className="flex flex-col gap-8">
                <input required autoFocus type="text" placeholder="Task" defaultValue={taskObject?.task} name="taskName" className="rounded text-black px-2"></input>
                <input type="hidden" id="taskId" name="taskId" value={taskObject?.id.toString()}></input>
                <div className="flex justify-evenly">
                    <Link href="/">Cancel</Link>
                    <button type="submit" className="px-2 rounded text-zinc-100 bg-zinc-700 hover:bg-zinc-300 hover:text-zinc-900 transition">Update Task</button>
                </div>
            </form>
        </div>
    )
}