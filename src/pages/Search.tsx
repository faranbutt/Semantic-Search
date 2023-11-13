import Link from "next/link"
export default function Search(){
    return(
        <div className="w-screen pr-7">
            <div className='flex justify-end m-10'>
                <div className='bg-blue-500 text-sm rounded-xl text-white px-4 py-2'>
                    <Link href={'/'}>Upload Document</Link>
                </div>
            </div>
            <div>
                Search Document
            </div>
        </div>
    )
}