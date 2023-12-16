const SERVICE_PLAN_ID = '8abfc9af367048d2b86f6a76845d03a7';
const API_TOKEN = '1b8088b0811945c5b1763559384d961e';
const SINCH_NUMBER = '+12085686709';

import prisma from "@/util/prisma-client"
import fetch from 'node-fetch';

export async function GET (request: Request, {params: { textInfo }}: { params: {textInfo: string }}) {
  console.log(textInfo); //LOG
    const taskObject = await prisma.task.findFirst({
        where: {
            id: parseInt(decodeURI(textInfo[0])),
            phoneNumber: decodeURI(textInfo[1])
        }
    })
    let subjectName;
    if (taskObject?.animalId) {
        const animal = await prisma.animal.findFirst({where: {id: taskObject.animalId}});
        subjectName = animal?.name;
    }
    else if (taskObject?.enclosureId) {
        const enclosure = await prisma.enclosure.findFirst({where: {id: taskObject.enclosureId}});
        subjectName = enclosure?.name;
    }
    const taskInfo = {
        subjectName: subjectName,
        taskName: taskObject?.task
    }
    const TO_NUMBER = taskObject?.phoneNumber

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
        body: taskInfo.taskName + ": " + taskInfo.subjectName + " - Animal Family"
      })
    }
  );

  const data = await resp.json();
  console.log(data);
  return new Response("OK");
}