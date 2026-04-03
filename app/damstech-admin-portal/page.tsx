"use client"

import { useEffect, useState } from "react"
import { AdminShell } from "@/components/admin/admin-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  FolderKanban,
  Wrench,
  Briefcase,
  MessageSquare,
  Mail,
  Clock,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

interface DashboardStats {
  projects: number
  skills: number
  experience: number
  messages: number
  unreadMessages: number
}

interface RecentMessage {
  _id: string
  name: string
  email: string
  subject?: string
  message: string
  read: boolean
  createdAt: string
}

interface RecentProject {
  _id: string
  id: string
  title: string
  category: string
  featured: boolean
  createdAt: string
}

const statCards = [
  {
    title: "Projects",
    key: "projects" as const,
    icon: FolderKanban,
    href: "/damstech-admin-portal/projects",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "Skills",
    key: "skills" as const,
    icon: Wrench,
    href: "/damstech-admin-portal/skills",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    title: "Experience",
    key: "experience" as const,
    icon: Briefcase,
    href: "/damstech-admin-portal/experience",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    title: "Messages",
    key: "messages" as const,
    icon: MessageSquare,
    href: "/damstech-admin-portal/messages",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
]

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentMessages, setRecentMessages] = useState<RecentMessage[]>([])
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/admin/dashboard")
        const data = await response.json()
        setStats(data.stats)
        setRecentMessages(data.recentMessages || [])
        setRecentProjects(data.recentProjects || [])
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <AdminShell title="Dashboard">
      <div className="flex flex-col gap-6">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => (
            <Link key={card.key} href={card.href}>
              <Card className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </CardTitle>
                  <div className={`rounded-lg p-2 ${card.bgColor}`}>
                    <card.icon className={`h-5 w-5 ${card.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-foreground">
                        {stats?.[card.key] || 0}
                      </span>
                      {card.key === "messages" && stats?.unreadMessages && stats.unreadMessages > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {stats.unreadMessages} unread
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Messages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Recent Messages
              </CardTitle>
              <CardDescription>Latest contact form submissions</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex flex-col gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex flex-col gap-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  ))}
                </div>
              ) : recentMessages.length === 0 ? (
                <p className="text-sm text-muted-foreground">No messages yet</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {recentMessages.map((message) => (
                    <Link
                      key={message._id}
                      href={`/damstech-admin-portal/messages`}
                      className="group flex flex-col gap-1 rounded-lg border border-border/50 p-3 transition-colors hover:bg-accent"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-foreground group-hover:text-primary">
                          {message.name}
                        </span>
                        {!message.read && (
                          <Badge variant="secondary" className="text-xs">
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="line-clamp-1 text-sm text-muted-foreground">
                        {message.subject || message.message}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Projects */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderKanban className="h-5 w-5" />
                Recent Projects
              </CardTitle>
              <CardDescription>Latest added projects</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex flex-col gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex flex-col gap-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  ))}
                </div>
              ) : recentProjects.length === 0 ? (
                <p className="text-sm text-muted-foreground">No projects yet</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {recentProjects.map((project) => (
                    <Link
                      key={project._id}
                      href={`/damstech-admin-portal/projects`}
                      className="group flex flex-col gap-1 rounded-lg border border-border/50 p-3 transition-colors hover:bg-accent"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-foreground group-hover:text-primary">
                          {project.title}
                        </span>
                        {project.featured && (
                          <Badge variant="default" className="text-xs">
                            Featured
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {project.category}
                        </Badge>
                        {project.createdAt && (
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminShell>
  )
}
