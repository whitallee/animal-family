import { Trash, MoreVertical, SquarePen, BoxSelect, CheckSquare, MessageCircle, MessageCircleOff} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import Link from 'next/link';
import { stringJoin } from '@/lib/utils';
import { TaskObjectType } from '@/lib/types';
import { completeTask, unCompleteTask, disableText, enableText, deleteTask } from '@/lib/server-actions';

export default function TaskMoreInfo ({taskObject}: {taskObject: TaskObjectType}) {
    const today = new Date;
    return(
        <DropdownMenu>
            <DropdownMenuTrigger className="rounded aspect-square px-2 hover:bg-zinc-600 transition"><MoreVertical className="h-4"/></DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel><span className="">Edit {taskObject.subjectName}'s Task</span></DropdownMenuLabel>
                <DropdownMenuSeparator />
                {!!!taskObject.complete ?
                    <DropdownMenuItem>
                        <form className='w-full' action={completeTask}>
                            <input type="hidden" id="taskId" name="taskId" value={taskObject.id}/>
                            <button type="submit" className="w-full rounded flex justify-between items-center px-2 hover:bg-zinc-600 hover:text-white transition">Mark as Complete<CheckSquare className='h-4'/></button>
                        </form>
                    </DropdownMenuItem>
                :
                    <DropdownMenuItem>
                        <form className='w-full' action={unCompleteTask}>
                            <input type="hidden" id="taskId" name="taskId" value={taskObject.id}/>
                            <button type="submit" className="w-full rounded flex justify-between items-center px-2 hover:bg-zinc-600 hover:text-white transition">Mark as Complete<CheckSquare className='h-4'/></button>
                        </form>
                    </DropdownMenuItem>
                }
                <DropdownMenuItem>
                    <Link className="w-full rounded flex justify-between items-center px-2 hover:bg-zinc-600 hover:text-white transition" href={stringJoin(["/edit/task/", taskObject.task, "/", taskObject.id.valueOf.toString()])}>Edit<SquarePen className="h-4"/></Link>
                </DropdownMenuItem>
                {taskObject.repeatDayInterval && taskObject.textEnabled ?
                    //Text option for disabling
                    <DropdownMenuItem>
                        <form className='w-full' action={disableText}>
                            <input type="hidden" id="taskId" name="taskId" value={taskObject.id}/>
                            <button type="submit" className="w-full rounded flex justify-between items-center px-2 hover:bg-zinc-600 hover:text-white transition">Disable Texting<MessageCircleOff className='h-4'/></button>
                        </form>
                    </DropdownMenuItem>
                : taskObject.repeatDayInterval && !!!taskObject.textEnabled ?
                    //Text option for enabling
                    <DropdownMenuItem>
                        <form className='w-full' action={enableText}>
                            <input type="hidden" id="taskId" name="taskId" value={taskObject.id}/>
                            <button type="submit" className="w-full rounded flex justify-between items-center px-2 hover:bg-zinc-600 hover:text-white transition">Enable Texting<MessageCircle className='h-4'/></button>
                        </form>
                    </DropdownMenuItem>
                :
                    //No text option for non-repeating tasks
                    <></>
                }
                <DropdownMenuItem>
                <form action={deleteTask} className="w-full">
                    <input type="hidden" id="taskId" name="taskId" value={taskObject.id}/>
                    <button type="submit" className="w-full rounded flex justify-between items-center px-2 hover:bg-zinc-600 hover:text-white transition">Remove<Trash className="h-4"/></button>
                </form>
            </DropdownMenuItem>
            {taskObject.repeatDayInterval ?
                <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem disabled>
                    {/* @ts-ignore ignores 'task.lastCompleted' could be 'null' */}
                    {(((today.getTime() - taskObject.lastCompleted.getTime())/86400000) < 1) ?
                        //@ts-ignore
                        <div className='w-full'>Last completed {(((today.getTime() - taskObject.lastCompleted.getTime())/86400000) * 24).toFixed(0)} hours ago</div>
                    //@ts-ignore
                    : ((((today.getTime() - taskObject.lastCompleted.getTime())/86400000) >= 1) && (((today.getTime() - taskObject.lastCompleted.getTime())/86400000) < 14)) ?
                        //@ts-ignore
                        <div className='w-full'>Last completed {((today.getTime() - taskObject.lastCompleted.getTime())/86400000).toFixed(0)} days ago</div>
                    :
                        //@ts-ignore
                        <div className='w-full'>Last completed on {taskObject.lastCompleted.getMonth() + 1}/{taskObject.lastCompleted?.getDate()}/{taskObject.lastCompleted.getFullYear()}</div>
                    }
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled>
                        <div className='w-full'>Repeats every {taskObject.repeatDayInterval > 1 ? taskObject.repeatDayInterval + ' days' : 'day'}</div>
                    </DropdownMenuItem>
                </>
            :
                <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem disabled>
                        <div>This is not a repeating task</div>
                    </DropdownMenuItem>
                </>
            }
            </DropdownMenuContent>
        </DropdownMenu>
    )
}