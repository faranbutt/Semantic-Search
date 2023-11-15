
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { client } from "@gradio/client";
import axios from "axios";
import React from "react";
export default function Home() {
  const inputFileRef = React.createRef();
  const [file,setFile] = useState(null);
  const [result,setResult] = useState('');
  const [query,setQuery] = useState('');
  const [collection,setCollection] = useState('');
  const formData = new FormData();
  const handleFileChange = (event:any) => {
    // console.log(event.target.files[0])
    setFile(event.target.files[0]);
    // const inputFile:any = inputFileRef.current;
    // const exampleFile = inputFile.files[0];
    // formData.append("pdfFile", exampleFile);
    // console.log(formData)
    
  }
  const SendFile = async() => {
    console.log("File Recieved: ",file)
    console.log("Query Recieved: ",query)
    console.log("Collection Recieved: ",collection)
    formData.append('query', query);
    formData.append('pdf_file', file);
    formData.append('collection_name', collection);
    console.log("FORM",formData)
    try{
    //   const url = 'https://teamtonic-herechatbackend.hf.space/--replicas/djdp8/';
    //   const data = {
    //     data: [query, formData, collection]
    //   };
    //  const response = await axios.post(url, data.data, {
    //     headers: {
    //       'Content-Type': 'application/json'
    //     }
    //   })
    const response = await axios.post('https://teamtonic-herechatbackend.hf.space/--replicas/djdp8/combined_interface', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const responseData = response.data;
      console.log(response)
    }catch(error){
      console.error('Error:', error);
    }
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
        <div className='flex flex-col'>
          <h1 className='text-gray-400 text-5xl md:text-7xl font-bold'>Here <span className='text-blue-600 dark:text-blue-500'> .Chat</span></h1>
          <h2 className="text-sm">Semantic Search your document in over 100 languages</h2>
        </div>
      
        <div className=''>
          <div className="">
            <div className="flex flex-col justify-center items-center gap-4">
              <div className="flex justify-center gap-4">
              <div>
                <label htmlFor="" className="font-bold text-3xl">Enter Query</label>
                <Input type='text' onChange={(e)=>setQuery(e.target.value)}/>
              </div>
              <div>
                <label htmlFor="" className="font-bold text-3xl">Enter Document</label>
                <Input type='file' ref={inputFileRef} onChange={handleFileChange}/>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">TXT, DOCX, PPTX, JPG, PNG, HTML or PDF</p>
              </div>
              <div>
                <label htmlFor="" className="font-bold text-3xl">Collection</label>
                <Input type='text' onChange={(e) => setCollection(e.target.value)}/>
              </div>
              </div>
              <div>
                <Button className='border-2 border-blue-500 bg-white text-blue-500 font-bold hover:text-white hover:bg-blue-500' disabled={!file} onClick={SendFile} >Submit</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
      </div>
    </>
  );
}
