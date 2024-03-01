import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/utils";
import prisma from "@/util/prisma-client";
import Link from "next/link";
import { stringJoin } from "@/lib/utils";
import FamilySubjectMoreInfo from "@/components/FamilySubjectMoreInfo";
import { EnclosureObjectType } from "@/lib/types";

import { Poppins } from 'next/font/google'
import NotLoggedIn from "@/components/NotLoggedIn";
const poppins = Poppins({ weight: ["300"], subsets: ["latin"] })


export default async function MyFamily() {

    const session = await getServerSession(authOptions);
    const email: any = session?.user?.email;

    if(!session){
        return (<NotLoggedIn message="Must be logged in to view your animal family."/>)
    };

    const userObject = await prisma.user.findFirst({
        where: {
            email: email
        },
        include: {
            animals: true,
            enclosures: true,
            tasks: true
        }
    })

    //creating non-enclosure array
    let noEnclosureAnimals: {id: number, name: string, species: string}[] = []
    userObject?.animals.forEach(animal => {
        if (!animal.enclosureId) {
            noEnclosureAnimals.push(animal);
        };
    });

    const animalListItems = noEnclosureAnimals.map(animal => 
            <li key={animal.id} className="flex place-content-between items-center gap-4 py-3 px-8">
                <span><strong><Link href={stringJoin(["/about/animal/", animal.name.toString(), "/", animal.id.toString()])}>{animal.name}</Link></strong><span className="text-zinc-500 italic"> - {animal.species}</span></span>
                <FamilySubjectMoreInfo subjectObject={animal}/>
            </li>
        );

    //creating enclosure array with animals attached
    let enclosureAnimals: EnclosureObjectType[] = []
    userObject?.enclosures?.forEach(enclosure => {
         let family = userObject.animals.filter((animal) => animal.enclosureId === enclosure.id)
         let enclosureObject = {
            id: enclosure.id,
            name: enclosure.name,
            userEmail: enclosure.userEmail,
            enclosureFamily: family,
         }
         enclosureAnimals.push(enclosureObject)
    })

    const enclosureAnimalListItems = enclosureAnimals.map(enclosure =>
            <li key={enclosure.id} className="border-solid border-zinc-500 border-2 rounded-xl m-4">
                <div className="flex justify-between items-center pt-2 px-4">
                    <strong><Link href={stringJoin(["/about/enclosure/", enclosure.name.toString(), "/", enclosure.id.toString()])}>{enclosure.name}</Link></strong>
                    <div className="flex">
                            <FamilySubjectMoreInfo subjectObject={enclosure}/>
                        </div>
                </div>
                <div className="w-full border border-zinc-500 rounded mt-2"></div>
                <ul>
                    {enclosure.enclosureFamily.map(animal =>
                        <li key={animal.id} className="flex place-content-between items-center gap-8 py-3 pr-4 pl-8">
                        <span><Link href={stringJoin(["/about/animal/", animal.name.toString(), "/", animal.id.toString()])}>{animal.name}</Link><span className="text-zinc-500 italic"> - {animal.species}</span></span>
                        <div className="flex">
                            <FamilySubjectMoreInfo subjectObject={animal}/>
                        </div>
                        </li>
                    )}
                </ul>
            </li>
        );

    if (animalListItems?.length === 0 && enclosureAnimalListItems?.length === 0){
        return (
            <div className="text-center">
                You don't have any animals or enclosure in your family yet, add one to see your family.
            </div>
        )
    }

    return (
        <>
            <div className='text-4xl text-zinc-500'><div className={poppins.className}>My Animal Family</div></div>
            <ul>
                {animalListItems}
                {enclosureAnimalListItems}
            </ul>
        </>
    )
}