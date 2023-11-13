import { Html, Head, Main, NextScript } from 'next/document'
import Footer from '@/components/ui/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { Tooltip,TooltipContent,TooltipProvider,TooltipTrigger, } from '@/components/ui/tooltip';
export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className='w-screen h-screen border-[20px] border-blue-500 border-xl p-0'>
        <Main />
        <NextScript />
        <div className='mt-[100px] flex items-end justify-end pr-10'>
          <div>
            <div className='flex gap-2'>
              <Link href={'https://huggingface.co/Tonic'}><Image src={'/tonic.webp'} alt='tonic' width={70} height={70} className='rounded-full'/></Link>
              <Link href={'https://www.linkedin.com/in/faranbutt/'}><Image src={'/faran.jpg'} alt='tonic' width={70} height={70} className='rounded-full'/></Link>
              <Link href={'https://www.github.com/Hassanmustafa786'}><Image src={'/mustafa.webp'} alt='tonic' width={70} height={70} className='rounded-full'/></Link>
            
            </div>
          </div>
        </div>
      </body>
    </Html>
  )
}
