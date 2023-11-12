import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { Input } from "@mui/material";
import Button from "@mui/material";
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
      <div className="w-screen h-screen border-[20px] border-blue-500 border-xl p-7">
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
          <div className="">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Upload file</label>
            <input className="p-2 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="file_input_help" id="file_input" type="file"/>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">SVG, PNG, JPG or GIF (MAX. 800x400px).</p>
              
          </div>
        </div>
      </div>
    </div>
      </div>
    </>
  );
}
