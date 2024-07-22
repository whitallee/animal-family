export default function TextBubble({msg}: {msg: string}){
    return(
        <div>
            <div className="h-[72px] w-[72px] rounded-3xl bg-red-500 fixed"></div>
            <div className="h-[72px] w-[72px] rounded-3xl bg-green-500 fixed"></div>
            <div className="text-4xl bg-blue-600 p-4 rounded-3xl">{msg}</div>
        </div>
    )
}