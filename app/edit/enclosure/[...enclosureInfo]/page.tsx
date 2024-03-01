import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/utils";
import prisma from "@/util/prisma-client";
import Link from "next/link";
import { redirect } from "next/navigation";
import NotLoggedIn from "@/components/NotLoggedIn";

async function editEnclosureNameAnimals (data: FormData) {
    "use server"
    const session = await getServerSession(authOptions);
    const enclosureName = data.get("enclosureName")?.valueOf();
    const enclosureId = data.get("enclosureId")?.valueOf();
    const email: any = session?.user?.email;

    if (typeof(enclosureName) !== "string" || enclosureName.length === 0) {
        redirect("/")
    }
    else if (typeof(enclosureId) !== "string" || enclosureId.length === 0) {
        redirect("/")
    };

    await prisma.enclosure.update({
        data: {
            name: enclosureName,
        },
        where: {
            id: parseInt(enclosureId)
        }
    });

    await prisma.task.updateMany({
        data: {
            subjectName: enclosureName
        },
        where: {
            enclosureId: parseInt(enclosureId)
        }
    });

    redirect("/")

}

export default async function EditEnclosure ({params: { enclosureInfo }}: {params: {enclosureInfo: string}}) {
    const session = await getServerSession(authOptions);

    if(!session){
        return (<NotLoggedIn message="Must be logged in to edit this enclosure."/>)
    }

    const email: any = session?.user?.email

    const enclosureObject = await prisma.enclosure.findFirst({
        where: {
            name: decodeURI(enclosureInfo[0]),
            id: parseInt(enclosureInfo[1])
        },
    })

    const userObject = await prisma.user.findFirst({
        where: {
            email: email
        },
        include: {
            enclosures: true,
            animals: true,
        }
    })

    //const enclosureName: string | undefined = userObject?.Enclosure.find(enclosure => enclosure.id === animalObject?.enclosureId)?.name

    if (userObject?.email !== enclosureObject?.userEmail) {
        return (
            <div className="text-center">You are not authorized to edit this Enclosure.</div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center m-auto">
            <div className="text-4xl text-zinc-600 m-8">Edit {enclosureObject?.name}</div>
            <form action={editEnclosureNameAnimals} className="flex flex-col gap-8">
                <input required autoFocus type="text" placeholder="Enclosure Name" defaultValue={enclosureObject?.name} name="enclosureName" className="rounded text-black px-2"></input>
                <input type="hidden" id="enclosurelId" name="enclosureId" value={enclosureObject?.id.toString()}></input>
                <div className="flex justify-evenly">
                    <Link href="/">Cancel</Link>
                    <button type="submit" className="px-2 rounded text-zinc-100 bg-zinc-700 hover:bg-zinc-300 hover:text-zinc-900 transition">Update Enclosure</button>
                </div>
            </form>
        </div>
    )
}