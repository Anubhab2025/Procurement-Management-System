"use client"

import { useState } from "react"
import { LoginPage } from "@/components/login-page"
import { Layout } from "@/components/layout"
import { ProcurementProvider } from "@/contexts/procurement-context"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<{ email: string; name: string } | null>(null)

  const handleLogin = (email: string, name: string) => {
    setIsLoggedIn(true)
    setUser({ email, name })
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUser(null)
  }

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />
  }

  return (
    <ProcurementProvider>
      <Layout user={user} onLogout={handleLogout} />
    </ProcurementProvider>
  )
}
