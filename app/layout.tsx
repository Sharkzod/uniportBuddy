import './globals.css'
import { Inter } from 'next/font/google'
import { AuthProvider } from '../context/AuthContext'
import { AdminAuthProvider } from '../context/AdminAuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'UniportBuddy - Academic Management System',
  description: 'University of Port Harcourt Academic Portal',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <AdminAuthProvider>
            {children}
          </AdminAuthProvider>
        </AuthProvider>
      </body>
    </html>
  )
}