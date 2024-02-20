import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import prisma from '@/util/prisma-client';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { stringJoin } from '@/lib/utils';
import { Trash, MoreVertical, SquarePen, BoxSelect, CheckSquare, MessageCircle, MessageCircleOff} from 'lucide-react';
import { completeTask } from '@/lib/server-actions';
import TaskMoreInfo from '@/components/TaskMoreInfo';
import { TaskObjectType } from '@/lib/types';

import { Poppins } from 'next/font/google'
const poppins = Poppins({ weight: ["300"], subsets: ["latin"] })



export default async function Tasks() {
    const session = await getServerSession(authOptions);
    const email: any = session?.user?.email;

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
    };

    const userObject = await prisma.user.findFirst({
        where: {
            email: email
        },
        include: {
            animals: true,
            enclosures: true,
            tasks: true,
        }
    })

    if (userObject?.tasks.length === 0) {
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

    //Completed Tasks
    let completedTasks: TaskObjectType[] = [];
    userObject?.tasks.filter(task => (task.complete)).forEach(task => {completedTasks.push(task)});
    const today = new Date;
    const completedTaskItems = completedTasks.map(task => 
        <li key={task.id} className="flex place-content-between items-center gap-8 py-4 px-8">
            <div className='flex items-center opacity-50'>
                <CheckSquare className='h-6'/>
            </div>
            <s className='opacity-50 flex w-full justify-between'><strong className='flex items-center'>{task.task}</strong><span className='text-zinc-500 italic px-2 flex items-center justify-center'> &#8212; </span><span className="text-zinc-500 italic flex items-center text-right">{task.subjectName}</span></s>
            <TaskMoreInfo taskObject={task} />
        </li>
    );


    //Animal Tasks
    let animalTasks: TaskObjectType[] = []
    userObject?.tasks.filter(task => (!!!task.complete)).forEach(task => {
        if (task.animalId) {
            animalTasks.push(task)
        }
    });
    const animalTaskItems = animalTasks.map(task => 
            <li key={task.id} className="flex place-content-between items-center gap-8 py-4 px-8">
                <form className='flex items-center' action={completeTask}>
                    <input type="hidden" id="taskId" name="taskId" value={task.id}/>
                    <button type="submit"><BoxSelect className='h-6'/></button>
                </form>
                <span className='flex w-full justify-between'><strong className='flex items-center'>{task.task}</strong><span className='text-zinc-500 italic px-2 flex items-center'> &#8212; </span><span className="text-zinc-500 italic flex items-center text-right">{task.subjectName}</span></span>
                <TaskMoreInfo taskObject={task} />
            </li>
    );

    //Enclosure Tasks
    let enclosureTasks: TaskObjectType[] = []
    userObject?.tasks.filter(task => (!!!task.complete)).forEach(task => {
        if (task.enclosureId) {
            enclosureTasks.push(task)
        }
    });
    const enclosureTaskItems = enclosureTasks.map(task => 
            <li key={task.id} className="flex place-content-between items-center gap-8 py-4 px-8">
                <form className='flex items-center' action={completeTask}>
                    <input type="hidden" id="taskId" name="taskId" value={task.id}/>
                    <button type="submit"><BoxSelect className='h-6'/></button>
                </form>
                <span className='flex w-full justify-between'><strong className='flex items-center'>{task.task}</strong><span className='text-zinc-500 italic px-2 flex justify-center items-center'> &#8212; </span><span className="text-zinc-500 italic flex items-center text-right">{task.subjectName}</span></span>
                <TaskMoreInfo taskObject={task} />
            </li>
    );

    return (
        <>
            <div className='text-4xl text-zinc-500'><div className={poppins.className}>My Tasks</div></div>
            <ul>
                {animalTaskItems}
                {enclosureTaskItems}
                {completedTaskItems}
            </ul>
        </>
    )
}