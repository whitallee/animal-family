import prisma from "@/util/prisma-client";
import { NextResponse } from "next/server";

export const revalidate = 0;

export async function GET (request: Request) {
    const today = new Date();
    const tasks = await prisma.task.findMany({where: {complete: true}});
    const millisecondsPerHour = 1000 * 60 * 60;
    for await (const task of tasks) {
        if (task.complete && task.repeatDayInterval) {
            const hoursPassed = (today.getTime() - task.lastCompleted.getTime())/millisecondsPerHour;
            //repeats an hour earlier than previously completed
            if (hoursPassed >= (task.repeatDayInterval - 1)) {
                await prisma.task.update({
                    data: {
                        complete: false
                    },
                    where: {
                        id: task.id
                    }
                })

                console.log(task.task + " is reset");

                //Text each reset task
                if (task.phoneNumber && task.textEnabled) {
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
                        'https://us.sms.api.sinch.com/xms/v1/' + process.env.SERVICE_PLAN_ID + '/batches',
                        {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: 'Bearer ' + process.env.API_TOKEN
                        },
                        body: JSON.stringify({
                            from: process.env.SINCH_NUMBER,
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
    };
    return NextResponse.json('OK');
};