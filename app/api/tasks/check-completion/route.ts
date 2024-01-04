const SERVICE_PLAN_ID = '8abfc9af367048d2b86f6a76845d03a7';
const API_TOKEN = '1b8088b0811945c5b1763559384d961e';
const SINCH_NUMBER = '+12085686709';

import prisma from "@/util/prisma-client";
import { NextResponse } from "next/server";

export const revalidate = 0;

export async function GET (request: Request) {
    const today = new Date();
    const tasks = await prisma.task.findMany({where: {complete: true}});
    const millisecondsPerDay = 86400000;
    for await (const task of tasks) {
        if (task.complete && task.repeatDayInterval) {
            const daysPassed = (today.getTime() - task.lastCompleted.getTime())/millisecondsPerDay;
            if (daysPassed >= task.repeatDayInterval) {
                await prisma.task.update({
                    data: {
                        complete: false
                    },
                    where: {
                        id: task.id
                    }
                })

                console.log(task.task + " is reset");

                //SINCH SMS API info setup
                const TO_NUMBER = task.phoneNumber;
                let subjectName;
                if (task?.animalId) {
                    const animal = await prisma.animal.findFirst({where: {id: task.animalId}});
                    subjectName = animal?.name;
                }
                else if (task?.enclosureId) {
                    const enclosure = await prisma.enclosure.findFirst({where: {id: task.enclosureId}});
                    subjectName = enclosure?.name;
                };

                //SINCH SMS API call
                const resp = await fetch(
                    'https://us.sms.api.sinch.com/xms/v1/' + SERVICE_PLAN_ID + '/batches',
                    {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + API_TOKEN
                    },
                    body: JSON.stringify({
                        from: SINCH_NUMBER,
                        to: [TO_NUMBER],
                        body: task.task + ": " + subjectName + " - Animal Family"
                    })
                    }
                );

                const data = await resp.json();
                console.log(data);
            };
        };
    };
    return NextResponse.json('OK');
};