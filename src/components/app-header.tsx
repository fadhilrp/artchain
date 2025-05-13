"use client"

import Link from "next/link"
import { ShieldCheck, Menu, X, Settings, ClipboardList, Coins, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { ModeToggle } from "@/components/mode-toggle"

export function AppHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="border-b bg-white dark:bg-gray-950">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/app" className="flex items-center gap-2 font-bold text-xl">
          <ShieldCheck className="h-6 w-6 text-teal-600" />
          <span>ArtChain</span>
        </Link>

        {/* Mobile menu button */}
        <button
          className="md:hidden flex items-center"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/app" className="text-sm font-medium hover:text-teal-600 transition-colors">
            Dashboard
          </Link>
          <Link href="/app/upload" className="text-sm font-medium hover:text-teal-600 transition-colors">
            Upload Art
          </Link>
          <Link href="/app/my-art" className="text-sm font-medium hover:text-teal-600 transition-colors">
            My Artwork
          </Link>
          <Link href="/app/verification" className="text-sm font-medium hover:text-teal-600 transition-colors">
            <ClipboardList className="h-4 w-4 inline mr-1" />
            Verification
          </Link>
          <Link href="/app/rewards" className="text-sm font-medium hover:text-teal-600 transition-colors">
            <Coins className="h-4 w-4 inline mr-1" />
            Rewards
          </Link>
          <Link href="/app/api-demo" className="text-sm font-medium hover:text-teal-600 transition-colors">
            <Code className="h-4 w-4 inline mr-1" />
            API Demo
          </Link>
          <Link
            href="/app/settings/ai-validation"
            className="text-sm font-medium hover:text-teal-600 transition-colors"
          >
            <Settings className="h-4 w-4 inline mr-1" />
            AI Settings
          </Link>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <Button variant="outline" size="sm">
              Log Out
            </Button>
          </div>
        </nav>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white dark:bg-gray-950 border-b z-50 md:hidden">
            <nav className="flex flex-col p-4 space-y-4">
              <Link
                href="/app"
                className="text-sm font-medium hover:text-teal-600 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/app/upload"
                className="text-sm font-medium hover:text-teal-600 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Upload Art
              </Link>
              <Link
                href="/app/my-art"
                className="text-sm font-medium hover:text-teal-600 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                My Artwork
              </Link>
              <Link
                href="/app/verify-queue"
                className="text-sm font-medium hover:text-teal-600 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <ClipboardList className="h-4 w-4 inline mr-1" />
                Verification
              </Link>
              <Link
                href="/app/rewards"
                className="text-sm font-medium hover:text-teal-600 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Coins className="h-4 w-4 inline mr-1" />
                Rewards
              </Link>
              <Link
                href="/app/api-demo"
                className="text-sm font-medium hover:text-teal-600 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Code className="h-4 w-4 inline mr-1" />
                API Demo
              </Link>
              <Link
                href="/app/settings/ai-validation"
                className="text-sm font-medium hover:text-teal-600 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Settings className="h-4 w-4 inline mr-1" />
                AI Settings
              </Link>
              <div className="flex items-center justify-between pt-2 border-t">
                <ModeToggle />
                <Button variant="outline" size="sm">
                  Log Out
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
