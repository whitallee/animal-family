export default function TextBubble({msg}: {msg: string}){
    return(
        <div className="flex">
            
            <div className="bg-blue-600 h-[30px] w-[60px] md:h-[36px] md:w-[72px] rounded-2xl fixed -translate-x-[calc(60px-10px)] md:-translate-x-[calc(72px-12px)] translate-y-[30px] md:translate-y-[36px]"></div>
            <div className="bg-[#18181a] h-[60px] w-[60px] md:h-[72px] md:w-[72px] rounded-2xl fixed -translate-x-[60px] md:-translate-x-[72px]"></div>
            <div className="text-xl md:text-4xl bg-blue-600 p-4 rounded-3xl">{msg}</div>
        </div>
    )
}