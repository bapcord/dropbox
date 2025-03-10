import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Two-factor authentication | Dropbox',
  description: 'Enter your two-factor authentication code to access your Dropbox account',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white">{children}</body>
    </html>
  )
} 