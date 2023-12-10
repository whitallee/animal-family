import prisma from "@/util/prisma-client";

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
                const resp = await fetch(process.env.BASE_URL + '/api/tasks/text/' + task.id + '/' + task.phoneNumber);
                const data = resp.json;
                console.log(data);
            }
        }
    }
    return new Response("OK")
}