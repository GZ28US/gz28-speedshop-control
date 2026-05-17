import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GZ28US Financial CONTROL',
  description: 'Financial management system for GZ28US',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}