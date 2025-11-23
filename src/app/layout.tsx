import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Next Todo | Minimal task tracker',
  description: 'A clean Next.js-styled todo list with server actions and Prisma.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body className={`${spaceGrotesk.className} bg-slate-950 text-slate-50 antialiased`}>
        {children}
      </body>
    </html>
  )
}
