import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import SessionProvider from '@/components/SessionProvider'
import { getServerSession } from "next-auth"
import { authOptions } from '@/lib/utils'
import { Suspense } from 'react'

import NavMenu from '@/components/NavMenu'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Animal Family',
  description: 'Keep track of your countless pets',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>
          <main className='flex flex-col items-center gap-8 min-h-screen'>
            <NavMenu/>
            <Suspense fallback={<>Loading...</>}>
              {children}
            </Suspense>
          </main>
        </SessionProvider>
      </body>
    </html>
  )
}
