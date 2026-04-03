"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  LayoutDashboard,
  FolderKanban,
  Wrench,
  Briefcase,
  User,
  MessageSquare,
  BarChart3,
  Link as LinkIcon,
  LogOut,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useState } from "react"

const sidebarLinks = [
  {
    title: "Dashboard",
    href: "/damstech-admin-portal",
    icon: LayoutDashboard,
  },
  {
    title: "Projects",
    href: "/damstech-admin-portal/projects",
    icon: FolderKanban,
  },
  {
    title: "Skills",
    href: "/damstech-admin-portal/skills",
    icon: Wrench,
  },
  {
    title: "Experience",
    href: "/damstech-admin-portal/experience",
    icon: Briefcase,
  },
  {
    title: "About",
    href: "/damstech-admin-portal/about",
    icon: User,
  },
  {
    title: "Messages",
    href: "/damstech-admin-portal/messages",
    icon: MessageSquare,
  },
  {
    title: "Stats",
    href: "/damstech-admin-portal/stats",
    icon: BarChart3,
  },
  {
    title: "Social Links",
    href: "/damstech-admin-portal/social-links",
    icon: LinkIcon,
  },
  {
    title: "Settings",
    href: "/damstech-admin-portal/settings",
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" })
    router.push("/damstech-admin-portal/login")
    router.refresh()
  }

  return (
    <div
      className={cn(
        "relative flex h-screen flex-col border-r border-border/50 bg-card/50 backdrop-blur transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-border/50 px-4">
        {!collapsed && (
          <Link href="/damstech-admin-portal" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              D
            </div>
            <span className="font-semibold text-foreground">Admin</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", collapsed && "mx-auto")}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-2 py-4">
        <nav className="flex flex-col gap-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href || 
              (link.href !== "/damstech-admin-portal" && pathname.startsWith(link.href))
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  collapsed && "justify-center px-2"
                )}
                title={collapsed ? link.title : undefined}
              >
                <link.icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{link.title}</span>}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-border/50 p-2">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
            collapsed && "justify-center px-2"
          )}
          onClick={handleLogout}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  )
}
