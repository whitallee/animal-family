"use server"

import { getServerSession } from 'next-auth';
import { authOptions } from './utils';
import prisma from '@/util/prisma-client';
import { redirect } from 'next/navigation';
import { CompleteTaskFormSchema } from './form-schema';
import { revalidatePath } from 'next/cache';
import { createSafeActionClient } from 'next-safe-action';



export async function completeTask(data: FormData) {
  //  "use server"
  // @ts-ignore ignores 'animalId' type of 'string | Object | undefined'
    const taskId: number = parseInt(data.get("taskId")?.valueOf());
    const session = await getServerSession(authOptions);
    const email: any = session?.user?.email;
  
    await prisma.task.update({
        data: {
            complete: true,
            lastCompleted: new Date(),
        },
        where: {
          id: taskId,
          userEmail: email
        }});
  
    redirect("/tasks");
};

export const safeCompleteAction = createSafeActionClient();
export const completeTaskSafely = safeCompleteAction(CompleteTaskFormSchema, async({taskId}) => {
    const session = await getServerSession(authOptions);
    const email: any = session?.user?.email;
    const completedTask = await prisma.task.update({
        data: {
            complete: true,
            lastCompleted: new Date(),
        },
        where: {
            id: taskId,
            userEmail: email
        }
    });

    if(!completedTask) return {error: "Could not complete task"};
    if(completedTask.complete){
        revalidatePath("/tasks");
        return {success: completedTask};
    }
})





export async function unCompleteTask(data: FormData) {
    "use server"
  // @ts-ignore ignores 'animalId' type of 'string | Object | undefined'
    const taskId: number = parseInt(data.get("taskId")?.valueOf());
    const session = await getServerSession(authOptions);
    const email: any = session?.user?.email;
  
    await prisma.task.update({ 
        data: {
            complete: false,
        },
        where: {
          id: taskId,
          userEmail: email
        }});
  
    redirect("/tasks");
};

export async function enableText(data: FormData) {
    "use server"
  // @ts-ignore ignores 'animalId' type of 'string | Object | undefined'
    const taskId: number = parseInt(data.get("taskId")?.valueOf());
    const session = await getServerSession(authOptions);
    const email: any = session?.user?.email;

    const userInfo = await prisma.user.findFirst({where: {email: email}});
    if (!userInfo?.phoneNumber) {
        redirect("verification/add-phone");
    };

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
    const taskId: number = parseInt(data.get("taskId")?.valueOf());
    const session = await getServerSession(authOptions);
    const email: any = session?.user?.email;
  
    await prisma.task.update({ 
        data: {
            textEnabled: false,
        },
        where: {
          id: taskId,
          userEmail: email
        }});
  
    redirect("/tasks");
};

export async function deleteTask(data: FormData) {
    "use server"
  // @ts-ignore ignores 'animalId' type of 'string | Object | undefined'
    const taskId: number = parseInt(data.get("taskId")?.valueOf());
    const session = await getServerSession(authOptions);
    const email: any = session?.user?.email;
  
    await prisma.task.delete({ 
        where: {
          id: taskId,
          userEmail: email
        }});
  
    redirect("/tasks");
};

export async function deleteAnimal(data: FormData) {
    "use server"
  // @ts-ignore ignores 'animalId' type of 'string | Object | undefined'
    const animalId: number = parseInt(data.get("animalId")?.valueOf());
    const session = await getServerSession(authOptions);
    const email: any = session?.user?.email;

    await prisma.animal.delete({ 
        where: {
          id: animalId,
          User: email
        }});
  
    redirect("/");
};

export async function deleteEnclosure(data: FormData) {
    "use server"
  // @ts-ignore ignores 'enclosureId' type of 'string | Object | undefined'
    const enclosureId: number = parseInt(data.get("enclosureId")?.valueOf());
    const session = await getServerSession(authOptions);
    const email: any = session?.user?.email;

    await prisma.animal.updateMany({
        where: {
            enclosureId: enclosureId,
            User: email
        },
        data: {
            enclosureId: null,
        }
    });

    await prisma.task.deleteMany({
        where: {
            enclosureId: enclosureId,
            userEmail: email
        }
    });
  
    await prisma.enclosure.delete({
        where: {
            id: enclosureId,
            userEmail: email
        }
    });
  
    redirect("/");
}