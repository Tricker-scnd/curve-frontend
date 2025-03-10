import '@/globals.css'
import '@/global-extensions'
import type { AppProps } from 'next/app'
import { memo } from 'react'

export default memo(function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
})
