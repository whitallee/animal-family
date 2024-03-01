export default function NotLoggedIn ({message}: {message: string}) {
    return (
        <div className="m-auto flex flex-col gap-4 items-center">
            <div className="text-center">
                {message}
            </div>
            <form method="get" action="/api/auth/signin">
              <button type="submit" className="mx-2 px-2 rounded text-zinc-300 bg-zinc-700 hover:bg-zinc-300 hover:text-zinc-900 transition">Log In</button>
            </form>
        </div>
    )
}