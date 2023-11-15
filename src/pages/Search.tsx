import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
export default function Search(){
    return(
        <div className="w-screen pr-7">
            <div className='flex justify-end m-10'>
                <div className='bg-blue-500 text-sm rounded-xl text-white px-4 py-2'>
                    <Link href={'/'}>Upload Document</Link>
                </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-5">
                <div className="text-5xl font-bold text-gray-400">Search <span className="text-blue-500">Document</span></div>
                <div className="flex gap-4">
                    <Input type="search" className="w-80"/>
                    <Button className="border-2 border-blue-500 bg-white text-blue-500 font-bold hover:text-white hover:bg-blue-500">Search</Button>
                    
                </div>
                <div>
                    <Textarea placeholder="Response." disabled rows={5} cols={50}/>
                </div>
            </div>
        </div>
    )
}