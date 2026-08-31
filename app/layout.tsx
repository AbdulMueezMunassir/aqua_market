import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import { TopNavBar } from '@/components/common/TopNavBar'
import { BottomNavBar } from '@/components/common/BottomNavBar'
import { Footer } from '@/components/common/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Aqua Market Premium Aquarium Marketplace',
  description: 'Discover premium aquarium fish, plants, and accessories for your aquatic world.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="light">
      <body className={inter.className}>
        <AuthProvider>
          <TopNavBar />
          <main className="min-h-screen pt-24 pb-16 md:pb-0">
            {children}
          </main>
          <Footer />
          <BottomNavBar />
        </AuthProvider>
      </body>
    </html>
  )
}