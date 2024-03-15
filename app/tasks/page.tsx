import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/utils';
import prisma from '@/util/prisma-client';
import { BoxSelect, CheckSquare, ListPlus, ListTodo } from 'lucide-react';
import TaskMoreInfo from '@/components/TaskMoreInfo';
import { TaskObjectType } from '@/lib/types';
import { Poppins } from 'next/font/google'
import NotLoggedIn from '@/components/NotLoggedIn';
import { CompleteTaskForm } from '@/components/CompleteTaskForm';
import Link from 'next/link';

const poppins = Poppins({ weight: ["300"], subsets: ["latin"] })

export default async function Tasks() {
    const session = await getServerSession(authOptions);
    const email: any = session?.user?.email;

    if(!session) {
        return (<NotLoggedIn message='Must be logged in to view your tasks.'/>)
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
                <Link className="text-zinc-200 border-2 p-2 mb-8 rounded-2xl flex gap-4" href="/add-task">Add Task<ListTodo/></Link>
            </>
        )
    }


    //Animal Tasks
    let animalTasks: TaskObjectType[] = []
    userObject?.tasks.filter(task => (!!!task.complete)).forEach(task => {
        if (task.animalId) {
            animalTasks.push(task)
        }
    });
    const animalTaskItems = animalTasks.map(task => 
            <li key={task.id} className="flex place-content-between items-center gap-8 py-4 px-8">
                <CompleteTaskForm taskId={task.id} moreInfoVariant={false}/>
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
                <CompleteTaskForm taskId={task.id} moreInfoVariant={false}/>
                <span className='flex w-full justify-between'>
                    <strong className='flex items-center'>{task.task}</strong>
                    <span className='text-zinc-500 italic px-2 flex justify-center items-center'> &#8212; </span>
                    <span className="text-zinc-500 italic flex items-center text-right">{task.subjectName}</span>
                </span>
                <TaskMoreInfo taskObject={task} />
            </li>
    );

    //Completed Tasks
    let completedTasks: TaskObjectType[] = [];
    userObject?.tasks.filter(task => (task.complete)).forEach(task => {completedTasks.push(task)});
    const completedTaskItems = completedTasks.map(task => 
        <li key={task.id} className="flex place-content-between items-center gap-8 py-4 px-8">
            <div className='flex items-center opacity-50'>
                <CheckSquare className='h-6'/>
            </div>
            <s className='opacity-50 flex w-full justify-between'><strong className='flex items-center'>{task.task}</strong><span className='text-zinc-500 italic px-2 flex items-center justify-center'> &#8212; </span><span className="text-zinc-500 italic flex items-center text-right">{task.subjectName}</span></s>
            <TaskMoreInfo taskObject={task} />
        </li>
    );

    return (
        <div className='w-full flex flex-col items-center'>
            <div className='text-4xl text-zinc-500 flex items-center gap-4'><div className={poppins.className}>My Tasks</div><Link className="text-zinc-200 border-2 p-2 rounded-2xl hover:bg-zinc-200 hover:text-zinc-800 transition" href="/add-task"><ListPlus/></Link></div>
            <div className='flex flex-wrap justify-center'>
                <ul className=''>
                    {animalTaskItems}
                    {enclosureTaskItems}
                    {completedTaskItems}
                </ul>
            </div>
            <Link className="text-zinc-200 border-2 p-2 m-8 rounded-2xl flex gap-4 hover:bg-zinc-200 hover:text-zinc-800 transition" href="/add-task">Add Task<ListTodo/></Link>
        </div>
    )
}