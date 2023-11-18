import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import prisma from '@/util/prisma-client';
import { AlignCenter } from 'lucide-react';

// async function createTask(data: FormData) {

//     "use server"
  
//       const session = await getServerSession(authOptions);
//       const petName = data.get("petName")?.valueOf()
//       const species = data.get("species")?.valueOf()
//       const email: any = session?.user?.email
  
//       if (typeof(petName) !== "string" || petName.length === 0) {
//           redirect("/add-animal")
//       }
//       else if (typeof(species) !== "string" || species.length === 0) {
//           redirect("/add-animal")
//       }
  
//       await prisma.animal.create({ data: {
//           name: petName,
//           species: species,
//           User: {
//               connect: {
//                   email: email,
//               }
//           }}})
  
//       redirect("/")
//   }
  

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
            <div className="text-center">You have no tasks.</div>
        )
    }

    return (
        <div className="text-center">
            Tasks
        </div>
    )
}