import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Monad Vote Mini App',
  description: 'A voting mini app for Farcaster on Monad testnet',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="fc:frame" content='{"version":"next","imageUrl":"/og-image.png","button":{"title":"Vote Now","action":{"type":"launch_frame","url":"/","name":"Monad Vote"}}}' />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
} 