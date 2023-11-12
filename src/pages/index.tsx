import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
export default function Home() {
  const [file,setFile] = useState(null);
  const [result,setResult] = useState('');
  const handleFileChange = (event:any) => {
    setFile(event.target.files[0]);
  }
  return (
    <>
      <Head>
        <title>Here.Chat</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Semantic Search with Cohere 🗣️" />
      </Head>
      <div className="">
      <div className=''>
      <div className='flex justify-end m-10'>
        <div className='bg-blue-500 text-sm rounded-xl text-white px-4 py-2'>
          <Link href={'./Search'}>Search Document</Link>
        </div>
      </div>
      <div className='flex flex-col gap-10 justify-center items-center pt-10 h-full mx-auto'>
        <div className='flex'>
          <h1 className='text-gray-400 text-5xl md:text-7xl font-bold'>Here <span className='text-blue-600 dark:text-blue-500'> .Chat</span></h1>
        </div>
        <div className=''>
          <div className="flex gap-2">
            <div className="">
              <Input type='file' onChange={handleFileChange}/>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">TXT, DOCX, PPTX, JPG, PNG, HTML or PDF</p>
            </div>
            <Button className='border-2 border-blue-500 bg-white text-blue-500 font-bold hover:text-white hover:bg-blue-500'>Submit</Button>
          </div>
        </div>
      </div>
    </div>
      </div>
    </>
  );
}
