import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className='w-screen h-screen border-[20px] border-blue-500 border-xl p-7'>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
