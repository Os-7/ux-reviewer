import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navigation } from '@/components/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'UX Reviewer - AI-Powered Website Analysis',
  description: 'Analyze any website for UX issues with AI-powered insights and actionable recommendations.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
          <Navigation />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
          <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-500">
            <p>UX Reviewer - Powered by AI</p>
          </footer>
        </div>
      </body>
    </html>
  )
}
