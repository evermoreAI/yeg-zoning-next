import type { Metadata } from 'next'
import { Rajdhani, Inter, JetBrains_Mono } from 'next/font/google'
import { TierProvider } from '@/lib/tierContext'
import './globals.css'

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-rajdhani',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['600'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'YEG Zoning Command',
  description: 'Edmonton real estate intelligence — zoning, feasibility, investment signals',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${rajdhani.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-[#0a0c10] text-[#e8e0d0] antialiased">
        <TierProvider>{children}</TierProvider>
      </body>
    </html>
  )
}
