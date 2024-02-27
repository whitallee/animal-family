import { Trash, MoreVertical, SquarePen, BoxSelect, CheckSquare } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import Link from 'next/link';
import { stringJoin } from '@/lib/utils';
import { AnimalObjectType, EnclosureObjectType } from '@/lib/types';
import { deleteAnimal, deleteEnclosure } from '@/lib/server-actions';

export default async function FamilySubjectMoreInfo({ subjectObject }: {subjectObject: AnimalObjectType | EnclosureObjectType}) {
    //console.log(typeof(subjectObject.enclosureFamily));
    //
    return(
        <DropdownMenu>
            <DropdownMenuTrigger className="rounded aspect-square px-2 hover:bg-zinc-600 transition"><MoreVertical className="h-4"/></DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel><span>{subjectObject.name}</span></DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    {/* @ts-ignore : enclosureFamily doesn't exist on type AnimalObjectType*/}
                    {(typeof(subjectObject.enclosureFamily) === "undefined") ?
                        <Link className="w-full rounded flex justify-between items-center px-2 hover:bg-zinc-600 hover:text-white transition" href={stringJoin(["/edit/animal/", subjectObject.name.toString(), "/", subjectObject.id.toString()])}>Edit<SquarePen className="h-4"/></Link>
                    :
                        <Link className="w-full rounded flex justify-between items-center px-2 hover:bg-zinc-600 hover:text-white transition" href={stringJoin(["/edit/enclosure/", subjectObject.name.toString(), "/", subjectObject.id.toString()])}>Edit<SquarePen className="h-4"/></Link>
                    }
                </DropdownMenuItem>
                <DropdownMenuItem className="flex space-between">
                    {/* @ts-ignore : enclosureFamily doesn't exist on type AnimalObjectType*/}
                    {(typeof(subjectObject.enclosureFamily) === "undefined") ?
                        <form action={deleteAnimal}  className="w-full">
                            <input type="hidden" id="animalId" name="animalId" value={subjectObject.id}/>
                            <button type="submit" className="w-full rounded flex justify-between items-center px-2 hover:bg-zinc-600 hover:text-white transition"><>Remove</><Trash className="h-4"/></button>
                        </form>
                    :
                        <form action={deleteEnclosure}  className="w-full">
                            <input type="hidden" id="enclosureId" name="enclosureId" value={subjectObject.id}/>
                            <button type="submit" className="w-full rounded flex justify-between items-center px-2 hover:bg-zinc-600 hover:text-white transition"><>Remove</><Trash className="h-4"/></button>
                        </form>
                    }
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};