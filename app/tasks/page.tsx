import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import prisma from '@/util/prisma-client';

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

    return (
        <div className="text-center">
            Tasks
        </div>
    )
}