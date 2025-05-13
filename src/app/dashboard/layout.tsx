import type React from "react"
import { ShieldCheck } from "lucide-react"
import Link from "next/link"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <ShieldCheck className="h-6 w-6 text-teal-600" />
            <span>ArtChain</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm font-medium hover:underline underline-offset-4">
              Dashboard
            </Link>
            <Link href="/register" className="text-sm font-medium hover:underline underline-offset-4">
              Register Art
            </Link>
            <Link href="/verify" className="text-sm font-medium hover:underline underline-offset-4">
              Verify
            </Link>
            <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700">
              <span className="text-sm font-medium">U</span>
            </div>
          </nav>
        </div>
      </header>
      <main className="flex-1 bg-gray-50 dark:bg-gray-900">{children}</main>
    </div>
  )
}
