"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { AdminSidebar } from "./admin-sidebar"
import { AdminHeader } from "./admin-header"
import { Loader2 } from "lucide-react"

interface AdminShellProps {
  children: React.ReactNode
  title: string
}

export function AdminShell({ children, title }: AdminShellProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/admin/auth/session")
        const data = await response.json()

        if (!data.authenticated) {
          router.push("/damstech-admin-portal/login")
          return
        }

        setIsAuthenticated(true)
      } catch {
        router.push("/damstech-admin-portal/login")
      } finally {
        setIsLoading(false)
      }
    }

    // Skip auth check for login page
    if (pathname === "/damstech-admin-portal/login") {
      setIsLoading(false)
      setIsAuthenticated(true)
      return
    }

    checkAuth()
  }, [pathname, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader title={title} />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
