import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";

export default async function VerificationSuccess({params: { phoneNumber }}: {params: {phoneNumber: string}}) {
    const session = await getServerSession(authOptions);

    return(
        <div className="flex flex-col items-center justify-center m-auto gap-8">
            <h1 className="text-center text-zinc-500 px-4 text-2xl"><span className="italic text-zinc-200">{decodeURIComponent(phoneNumber)}</span> added successfully to <span className="italic text-zinc-200">{session?.user?.name}'s</span> account.</h1>
            <div className="flex justify-evenly gap-4 px-4">
                <Link href="/" className="text-center px-2 rounded text-zinc-100 bg-zinc-700 hover:bg-zinc-300 hover:text-zinc-900 transition">Return to Home</Link>
                <Link href="/tasks" className="text-center px-2 rounded text-zinc-100 bg-zinc-700 hover:bg-zinc-300 hover:text-zinc-900 transition">Return to Tasks</Link>
                <Link href="/add-task" className="text-center px-2 rounded text-zinc-100 bg-zinc-700 hover:bg-zinc-300 hover:text-zinc-900 transition">Add Task</Link>
            </div>
        </div>
    );
};
