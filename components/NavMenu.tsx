'use client'
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { MenuIcon } from "lucide-react";
  

function AuthButton() {
    const { data: session } = useSession()

    if (session) {
        return (
            <div className="flex flex-col justify-center items-start text-sm sm:text-base">
                {session?.user?.name}
                <button className="rounded text-zinc-400 hover:bg-zinc-700" onClick={() => signOut()}>Sign Out</button>
            </div>
        )
    }
    //else
    return (
        <div className="flex flex-col justify-center items-start text-sm sm:text-base px-2">
            Signed out:
            <button className="font-bold rounded hover:bg-zinc-700 transition" onClick={() => signIn()}>Sign In</button>
        </div>
    )
}

export default function NavMenu() {

    const pathname = usePathname()

    return (
        <div className="bg-zinc-500 px-4 py-2 w-full h-fit flex justify-between sticky top-0">
            <AuthButton/>
            <div className="md:hidden visible flex align-middle">
            <DropdownMenu>
                <DropdownMenuTrigger><MenuIcon/></DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel><span className="text-lg">Navigation</span></DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem><Link className={pathname == "/" ? "active bg-zinc-500 text-zinc-100 navLink text-lg" : "hover:bg-zinc-500 hover:text-zinc-100 text-zinc-900 navLink text-lg"} href="/">My Animal Family</Link></DropdownMenuItem>
                    <DropdownMenuItem><Link className={pathname == "/tasks" ? "active bg-zinc-500 text-zinc-100 navLink text-lg" : "hover:bg-zinc-500 hover:text-zinc-100 text-zinc-900 navLink text-lg"} href="/tasks">My Tasks</Link></DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel><span className="text-lg">Actions</span></DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem><Link className={pathname == "/add-animal" ? "active bg-zinc-500 text-zinc-100 navLink text-lg" : "hover:bg-zinc-500 hover:text-zinc-100 text-zinc-900 navLink text-lg"} href="/add-animal">Add Animal</Link></DropdownMenuItem>
                    <DropdownMenuItem><Link className={pathname == "/add-enclosure" ? "active bg-zinc-500 text-zinc-100 navLink text-lg" : "hover:bg-zinc-500 hover:text-zinc-100 text-zinc-900 navLink text-lg"} href="/add-enclosure">Add Enclosure</Link></DropdownMenuItem>
                    <DropdownMenuItem><Link className={pathname == "/add-task" ? "active bg-zinc-500 text-zinc-100 navLink text-lg" : "hover:bg-zinc-500 hover:text-zinc-100 text-zinc-900 navLink text-lg"} href="/add-task">Add Task</Link></DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <ul className="md:flex md:gap-8 hidden gap-4 text-center ml-4">
                <Link className={pathname == "/" ? "active bg-zinc-700 navLink" : "hover:bg-zinc-700 navLink"} href="/"><li>My Animal Family</li></Link>
                <Link className={pathname == "/tasks" ? "active bg-zinc-700 navLink" : "hover:bg-zinc-700 navLink"} href="/tasks"><li>My Tasks</li></Link>
                <div className="h-full border-2 rounded border-solid border-zinc-400"></div>
                <Link className={pathname == "/add-animal" ? "active bg-zinc-700 navLink" : "hover:bg-zinc-700 navLink"} href="/add-animal"><li>Add Animal</li></Link>
                <Link className={pathname == "/add-enclosure" ? "active bg-zinc-700 navLink" : "hover:bg-zinc-700 navLink"} href="/add-enclosure"><li>Add Enclosure</li></Link>
                <Link className={pathname == "/add-task" ? "active bg-zinc-700 navLink" : "hover:bg-zinc-700 navLink"} href="/add-task"><li>Add Task</li></Link>
            </ul>
        </div>
    )
}