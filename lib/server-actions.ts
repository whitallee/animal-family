import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/util/prisma-client';
import { redirect } from 'next/navigation';

export async function completeTask(data: FormData) {
    "use server"
  // @ts-ignore ignores 'animalId' type of 'string | Object | undefined'
    const taskId: number = parseInt(data.get("taskId")?.valueOf())
    const session = await getServerSession(authOptions)
    const email: any = session?.user?.email
  
    await prisma.task.update({
        data: {
            complete: true,
            lastCompleted: new Date(),
        },
        where: {
          id: taskId,
          userEmail: email
        }})
  
    redirect("/tasks")
}

export async function unCompleteTask(data: FormData) {
    "use server"
  // @ts-ignore ignores 'animalId' type of 'string | Object | undefined'
    const taskId: number = parseInt(data.get("taskId")?.valueOf())
    const session = await getServerSession(authOptions)
    const email: any = session?.user?.email
  
    await prisma.task.update({ 
        data: {
            complete: false,
        },
        where: {
          id: taskId,
          userEmail: email
        }})
  
    redirect("/tasks")
}

export async function enableText(data: FormData) {
    "use server"
  // @ts-ignore ignores 'animalId' type of 'string | Object | undefined'
    const taskId: number = parseInt(data.get("taskId")?.valueOf());
    const session = await getServerSession(authOptions);
    const email: any = session?.user?.email;

    const userInfo = await prisma.user.findFirst({where: {email: email}});
    if (!userInfo?.phoneNumber) {
        redirect("verification/add-phone");
    }

    await prisma.task.update({ 
        data: {
            textEnabled: true,
        },
        where: {
          id: taskId,
          userEmail: email
        }});
  
    redirect("/tasks");
};

export async function disableText(data: FormData) {
    "use server"
  // @ts-ignore ignores 'animalId' type of 'string | Object | undefined'
    const taskId: number = parseInt(data.get("taskId")?.valueOf())
    const session = await getServerSession(authOptions)
    const email: any = session?.user?.email
  
    await prisma.task.update({ 
        data: {
            textEnabled: false,
        },
        where: {
          id: taskId,
          userEmail: email
        }})
  
    redirect("/tasks")
};

export async function deleteTask(data: FormData) {
    "use server"
  // @ts-ignore ignores 'animalId' type of 'string | Object | undefined'
    const taskId: number = parseInt(data.get("taskId")?.valueOf())
    const session = await getServerSession(authOptions)
    const email: any = session?.user?.email
  
    await prisma.task.delete({ 
        where: {
          id: taskId,
          userEmail: email
        }})
  
    redirect("/tasks")
};