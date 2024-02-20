import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/utils";
import prisma from "@/util/prisma-client";
import Link from "next/link";
import { redirect } from "next/navigation";

async function editTaskName (data: FormData) {
    "use server"
    const session = await getServerSession(authOptions);
    const taskName = data.get("taskName")?.valueOf()
    const taskId = data.get("taskId")?.valueOf()
    const email: any = session?.user?.email
    const repeatOption = data.get("repeatOption")?.valueOf()
    const repeatInterval = data.get("repeatInterval")?.valueOf()
    const textOption = data.get("textOption")?.valueOf()
    const phoneNumber = data.get("phoneNumber")?.valueOf()

    if (typeof(taskName) !== "string" || taskName.length === 0) {
        redirect("/tasks")
    }
    else if (typeof(taskId) !== "string" || taskId.length === 0) {
        redirect("/tasks")
    }
    else if (typeof(repeatInterval) !== "string" || parseInt(repeatInterval) < 1) {
        redirect("/tasks")
    }

    await prisma.task.update({
        data: {
            task: taskName,
            textEnabled: textOption ? true : false,
            phoneNumber: textOption ? phoneNumber : null,
            repeatDayInterval: repeatOption ? parseInt(repeatInterval) : null,
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

    const taskObject = await prisma.task.findFirst({
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
            tasks: true,
        }
    })

    //const enclosureName: string | undefined = userObject?.Enclosure.find(enclosure => enclosure.id === animalObject?.enclosureId)?.name

    if (userObject?.email !== taskObject?.userEmail) {
        return (
            <div className="text-center">You are not authorized to edit this Task.</div>
        )
    }

    if (typeof(userObject?.phoneNumber) !== "string") {
        redirect("tasks");
    };

    return (
        <div className="flex flex-col items-center justify-center m-auto">
            <div className="text-4xl text-zinc-600 m-8">Edit "{taskObject?.task}" Task</div>
            <form action={editTaskName} className="flex flex-col gap-8">
                <input required autoFocus type="text" placeholder="Task" defaultValue={taskObject?.task} name="taskName" className="rounded text-black px-2"></input>
                <input type="hidden" id="taskId" name="taskId" value={taskObject?.id.toString()}></input>
                {taskObject?.repeatDayInterval ? 
                    <div className="flex gap-4"><input type="checkbox" id="repeatOption" name="repeatOption" defaultChecked></input><label htmlFor="repeatOption">Repeat this task:</label><span className="flex gap-2"><>every</><input id="repeatInterval" name="repeatInterval" className="text-zinc-900 w-[5ch] rounded pl-2" type="number" min="1" defaultValue={taskObject.repeatDayInterval}></input><>day(s)</></span></div>
                    :
                    <div className="flex gap-4"><input type="checkbox" id="repeatOption" name="repeatOption"></input><label htmlFor="repeatOption">Repeat this task:</label><span className="flex gap-2"><>every</><input id="repeatInterval" name="repeatInterval" className="text-zinc-900 w-[5ch] rounded pl-2" type="number" min="1" defaultValue={1}></input><>day(s)</></span></div>
                }
                {(userObject?.phoneNumber && !!!taskObject?.textEnabled) ? 
                    <div className="flex gap-4"><input id="textOption" type="checkbox" name="textOption" value="true"></input><label htmlFor="textOption">Enable texting to {userObject?.phoneNumber}</label></div>
                    : (userObject?.phoneNumber && taskObject?.textEnabled) ?
                    <div className="flex gap-4"><input id="textOption" type="checkbox" name="textOption" value="true" defaultChecked></input><label htmlFor="textOption">Enable texting to {userObject?.phoneNumber}</label></div>
                    :
                    //No verified phone number available. Add a phone number to your account to enable task texting.
                    <div className="flex gap-4 text-zinc-600"><input disabled id="textOption" name="textOption" type="checkbox"></input><label htmlFor="textOption">Enable Texting (not available)</label></div>
                }
                <input type="hidden" value={userObject?.phoneNumber} id="phoneNumber" name="phoneNumber"></input>
                <div className="flex justify-evenly">
                    <Link href="/tasks">Cancel</Link>
                    <button type="submit" className="px-2 rounded text-zinc-100 bg-zinc-700 hover:bg-zinc-300 hover:text-zinc-900 transition">Update Task</button>
                </div>
            </form>
        </div>
    )
}