'use client'

import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { initializeApp } from 'firebase/app'

const {
  APIKEY,
  AUTHDOMAIN,
  PROJECTID,
  STORAGEBUCKET,
  MESSAGINGSENDERID,
  APPID,
  MEASUREMENTID
} = process.env

export default function Providers({ children }: { children: React.ReactNode }) {
  const firebaseConfig = {
    apiKey: APIKEY,
    authDomain: AUTHDOMAIN,
    projectId: PROJECTID,
    storageBucket: STORAGEBUCKET,
    messagingSenderId: MESSAGINGSENDERID,
    appId: APPID,
    measurementId: MEASUREMENTID
  }

  const app = initializeApp(firebaseConfig)

  return (
    <NextUIProvider>
      <NextThemesProvider
        attribute='class'
        defaultTheme='system'
        enableSystem={true}
        themes={['light', 'dark', 'modern']}
      >
        {children}
      </NextThemesProvider>
    </NextUIProvider>
  )
}
