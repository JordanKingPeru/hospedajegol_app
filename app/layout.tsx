import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Providers from './providers'
import Head from 'next/head'
// Importa el componente con el nuevo nombre
import NavBarHs from './components/navbar/NavBarHs'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Hospedaje Gol App',
  description: 'Web app para registrar a los clientes de '
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='es'>
      <body className={inter.className}>
        <Providers>
          <header className='py-6'>
          <NavBarHs />
          </header>
          <main>
            {children}
          </main>
          <footer>
          </footer>
        </Providers>
      </body>
    </html>
  )
}