"use client"

import Link from 'next/link'
import { useAuth, SignOutButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button"
import { MailIcon, SunIcon, MoonIcon } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const { isSignedIn } = useAuth()

  return (
    <header className="px-4 lg:px-6 h-14 flex items-center border-b">
      <Link className="flex items-center justify-center" href="/">
        <MailIcon className="h-6 w-6" />
        <span className="ml-2 text-lg font-semibold">Briefly</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/#features">Features</Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/#pricing">Pricing</Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/#faq">FAQ</Link>
        </Button>
        {isSignedIn ? (
          <>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <SignOutButton>
              <Button variant="ghost" size="sm">Sign out</Button>
            </SignOutButton>
          </>
        ) : (
          <>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/sign-up">Sign Up</Link>
            </Button>
          </>
        )}
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
        </Button>
      </nav>
    </header>
  )
}