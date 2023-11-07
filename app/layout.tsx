import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import SessionProvider from '@/components/SessionProvider'
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

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
          <main className='flex flex-col items-center gap-8 min-h-screen bg-zinc-900'>
            <NavMenu/>
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  )
}
