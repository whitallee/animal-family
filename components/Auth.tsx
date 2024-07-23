'use client'

import { signIn, signOut, useSession } from "next-auth/react";

export default function Auth() {
    const { data: session } = useSession()

    if (session) {
        return (
            <div className="m-4 shadow-lg font-bold rounded-2xl border-[var(--green)] border-[3px] p-3">
                Signed in as {session?.user?.name}
                {/* <button className="rounded text-zinc-400 hover:bg-zinc-700" onClick={() => signOut()}>Sign Out</button> */}
            </div>
        )
    }
    //else
    return (
        <div className="p-4">
            <button className="shadow-lg font-bold rounded-2xl border-[var(--green)] border-[3px] hover:bg-zinc-700 transition p-3" onClick={() => signIn()}>Sign Up Now</button>
        </div>
    )
}