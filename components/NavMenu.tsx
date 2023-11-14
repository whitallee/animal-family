'use client'
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

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
            <ul className="flex sm:gap-8 gap-4 text-center ml-4">
                <Link className={pathname == "/" ? "active bg-zinc-700 navLink" : "hover:bg-zinc-700 navLink"} href="/"><li>My Animal Family</li></Link>
                <Link className={pathname == "/add-animal" ? "active bg-zinc-700 navLink" : "hover:bg-zinc-700 navLink"} href="/add-animal"><li>Add Animal</li></Link>
                <Link className={pathname == "/add-enclosure" ? "active bg-zinc-700 navLink" : "hover:bg-zinc-700 navLink"} href="/add-enclosure"><li>Add Enclosure</li></Link>
            </ul>
        </div>
    )
}