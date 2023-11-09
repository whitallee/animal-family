'use client'
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

function AuthButton() {
    const { data: session } = useSession()

    if (session) {
        return (
            <div>
                {session?.user?.email}
                <button className="mx-2 px-2 rounded text-zinc-300 hover:bg-zinc-700" onClick={() => signOut()}>Sign Out</button>
            </div>
        )
    }
    //else
    return (
        <div>
            Not signed in ---
            <button className="font-bold px-2 rounded hover:bg-zinc-700" onClick={() => signIn()}>Sign In</button>
        </div>
    )
}

export default function NavMenu() {

    const pathname = usePathname()
    const linkClasses = "rounded px-2"

    return (
        <div className="bg-zinc-500 px-4 py-2 w-full h-fit flex justify-between sticky top-0">
            <AuthButton/>
            <ul className="flex gap-8">
                <Link className={pathname == "/" ? "active bg-zinc-700 btn" : "hover:bg-zinc-700 btn" + linkClasses} href="/"><li>My Animal Family</li></Link>
                <Link className={pathname == "/add-animal" ? "active bg-zinc-700 btn" : "hover:bg-zinc-700 btn"} href="/add-animal"><li>Add Animal</li></Link>
            </ul>
        </div>
    )
}