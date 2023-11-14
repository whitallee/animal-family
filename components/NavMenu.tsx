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
            <div className="text-white flex flex-col justify-center items-start text-sm sm:text-base">
                {session?.user?.email}
                <button className="rounded text-zinc-300 hover:bg-zinc-700" onClick={() => signOut()}>Sign Out</button>
            </div>
        )
    }
    //else
    return (
        <div className="text-white flex flex-col justify-center items-start text-sm sm:text-base">
            Signed out:
            <button className="font-bold rounded hover:bg-zinc-700" onClick={() => signIn()}>Sign In</button>
        </div>
    )
}

export default function NavMenu() {

    const pathname = usePathname()
    const linkClasses = "rounded px-2"

    return (
        <div className="bg-zinc-500 px-4 py-2 w-full h-fit flex justify-between sticky top-0">
            <AuthButton/>
            <div className="sm:hidden visible flex align-middle">
            <DropdownMenu>
                <DropdownMenuTrigger><MenuIcon/></DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Navigation</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem><Link className={pathname == "/" ? "active bg-zinc-700 navLink" : "hover:bg-zinc-700 text-zinc-900 navLink"} href="/">My Animal Family</Link></DropdownMenuItem>
                    <DropdownMenuItem><Link className={pathname == "/add-animal" ? "active bg-zinc-700 navLink" : "hover:bg-zinc-700 text-zinc-900 navLink"} href="/add-animal">Add Animal</Link></DropdownMenuItem>
                    <DropdownMenuItem><Link className={pathname == "/add-enclosure" ? "active bg-zinc-700 navLink" : "hover:bg-zinc-700 text-zinc-900 navLink"} href="/add-enclosure">Add Enclosure</Link></DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <ul className="sm:flex sm:gap-8 hidden gap-4 text-center ml-4">
                <Link className={pathname == "/" ? "active bg-zinc-700 navLink" : "hover:bg-zinc-700 navLink"} href="/"><li>My Animal Family</li></Link>
                <Link className={pathname == "/add-animal" ? "active bg-zinc-700 navLink" : "hover:bg-zinc-700 navLink"} href="/add-animal"><li>Add Animal</li></Link>
                <Link className={pathname == "/add-enclosure" ? "active bg-zinc-700 navLink" : "hover:bg-zinc-700 navLink"} href="/add-enclosure"><li>Add Enclosure</li></Link>
            </ul>
        </div>
    )
}