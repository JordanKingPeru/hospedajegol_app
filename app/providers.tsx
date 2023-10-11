'use client'

import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { initializeApp, getApps } from 'firebase/app'
import { ViewContextProvider } from './ViewContext'

// Use TypeScript for better type safety
interface ProvidersProps {
  children: React.ReactNode
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  // Safety checks for environment variables
  const {
    NEXT_PUBLIC_APIKEY,
    NEXT_PUBLIC_AUTHDOMAIN,
    NEXT_PUBLIC_PROJECTID,
    NEXT_PUBLIC_STORAGEBUCKET,
    NEXT_PUBLIC_MESSAGINGSENDERID,
    NEXT_PUBLIC_APPID,
    NEXT_PUBLIC_MEASUREMENTID
  } = process.env

  // Firebase configuration
  const firebaseConfig = {
    apiKey: 'AIzaSyAvfsnLwGDlws53gwGtYmEh7J_qIdrNSgQ',
    authDomain: 'hospedajegol-booking.firebaseapp.com',
    projectId: 'hospedajegol-booking',
    storageBucket: 'hospedajegol-booking.appspot.com',
    messagingSenderId: '480951778537',
    appId: '1:480951778537:web:e1e7cf9a0e98ea11064478',
    measurementId: 'G-990XX6SY9W'
  }

  // Initialize Firebase only if apps don't already exist
  if (!getApps().length) {
    initializeApp(firebaseConfig)
  }

  return (
    <ViewContextProvider>
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
    </ViewContextProvider>
  )
}

export default Providers
