'use client'

import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { initializeApp } from 'firebase/app'

const {
  NEXT_PUBLIC_APIKEY,
  NEXT_PUBLIC_AUTHDOMAIN,
  NEXT_PUBLIC_PROJECTID,
  NEXT_PUBLIC_STORAGEBUCKET,
  NEXT_PUBLIC_MESSAGINGSENDERID,
  NEXT_PUBLIC_APPID,
  NEXT_PUBLIC_MEASUREMENTID
} = process.env

export default function Providers({ children }: { children: React.ReactNode }) {
  const firebaseConfig = {
    apiKey: 'AIzaSyAvfsnLwGDlws53gwGtYmEh7J_qIdrNSgQ',
    authDomain: 'hospedajegol-booking.firebaseapp.com',
    projectId: 'hospedajegol-booking',
    storageBucket: 'hospedajegol-booking.appspot.com',
    messagingSenderId: '480951778537',
    appId: '1:480951778537:web:e1e7cf9a0e98ea11064478',
    measurementId: 'G-990XX6SY9W'
    /* apiKey: NEXT_PUBLIC_APIKEY,
    authDomain: NEXT_PUBLIC_AUTHDOMAIN,
    projectId: NEXT_PUBLIC_PROJECTID,
    storageBucket: NEXT_PUBLIC_STORAGEBUCKET,
    messagingSenderId: NEXT_PUBLIC_MESSAGINGSENDERID,
    appId: NEXT_PUBLIC_APPID,
    measurementId: NEXT_PUBLIC_MEASUREMENTID */
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
