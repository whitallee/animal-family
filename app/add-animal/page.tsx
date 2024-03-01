import Link from "next/link"
import prisma from "@/util/prisma-client"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/utils"
import { redirect } from "next/navigation"
import NotLoggedIn from "@/components/NotLoggedIn"

async function createAnimal(data: FormData) {

  "use server"

  const session = await getServerSession(authOptions);
  const petName = data.get("petName")?.valueOf()
  const species = data.get("species")?.valueOf()
  const email: any = session?.user?.email

  if (typeof(petName) !== "string" || petName.length === 0) {
      redirect("/add-animal")
  }
  else if (typeof(species) !== "string" || species.length === 0) {
      redirect("/add-animal")
  }

  await prisma.animal.create({ data: {
      name: petName,
      species: species,
      User: {
          connect: {
              email: email,
          }
      }}})

  redirect("/")
}


export default async function AddAnimal() {

  const session = await getServerSession(authOptions);

  if(!session) {
      return (<NotLoggedIn message="Must be logged in to add an animal to your family."/>)
  }

  return (
    <div className="flex flex-col items-center justify-center m-auto">
      <div className="text-4xl text-zinc-600 m-8">Add an Animal</div>
      <form action={createAnimal} className="flex flex-col gap-8">
        <input required autoFocus type="text" placeholder="Pet Name" name="petName" className="rounded text-black px-2"></input>
        <input required type="text" placeholder="Species" name="species" className="rounded text-black px-2"></input>
        <div className="flex justify-evenly">
            <Link href=".">Cancel</Link>
            <button type="submit" className="px-2 rounded text-zinc-100 bg-zinc-700 hover:bg-zinc-300 hover:text-zinc-900 transition">Add Animal</button>
        </div>
      </form>
    </div>
  )
}