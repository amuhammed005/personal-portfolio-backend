"use client"

import { useEffect, useState } from "react"
import { AdminShell } from "@/components/admin/admin-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Search,
  MoreHorizontal,
  Trash2,
  Mail,
  MailOpen,
  Clock,
  CheckCheck,
  MessageSquare,
  Filter,
} from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"

interface Message {
  _id: string
  name: string
  email: string
  subject?: string
  message: string
  read: boolean
  createdAt: string
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "unread" | "read">("all")
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [deletingMessage, setDeletingMessage] = useState<Message | null>(null)

  const fetchData = async () => {
    try {
      const response = await fetch("/api/admin/messages")
      const data = await response.json()
      setMessages(data || [])
    } catch (error) {
      console.error("Failed to fetch messages:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleMarkAsRead = async (message: Message) => {
    try {
      await fetch("/api/admin/messages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: message._id, read: !message.read }),
      })
      await fetchData()
    } catch (error) {
      console.error("Error updating message:", error)
    }
  }

  const handleDelete = async () => {
    if (!deletingMessage) return
    try {
      await fetch(`/api/admin/messages?id=${deletingMessage._id}`, {
        method: "DELETE",
      })
      await fetchData()
      if (selectedMessage?._id === deletingMessage._id) {
        setSelectedMessage(null)
      }
    } catch (error) {
      console.error("Error deleting message:", error)
    } finally {
      setDeletingMessage(null)
    }
  }

  const handleViewMessage = async (message: Message) => {
    setSelectedMessage(message)
    if (!message.read) {
      await handleMarkAsRead(message)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const unreadMessages = messages.filter((m) => !m.read)
      await Promise.all(
        unreadMessages.map((m) =>
          fetch("/api/admin/messages", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ _id: m._id, read: true }),
          })
        )
      )
      await fetchData()
    } catch (error) {
      console.error("Error marking all as read:", error)
    }
  }

  const filteredMessages = messages.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "unread" && !m.read) ||
      (filterStatus === "read" && m.read)

    return matchesSearch && matchesFilter
  })

  const unreadCount = messages.filter((m) => !m.read).length

  return (
    <AdminShell title="Messages">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={filterStatus}
              onValueChange={(value: "all" | "unread" | "read") =>
                setFilterStatus(value)
              }
            >
              <SelectTrigger className="w-32">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="read">Read</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" onClick={handleMarkAllAsRead}>
              <CheckCheck className="mr-2 h-4 w-4" />
              Mark All as Read ({unreadCount})
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="border-border/50 bg-card/50">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{messages.length}</p>
                <p className="text-sm text-muted-foreground">Total Messages</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/50">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
                <Mail className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{unreadCount}</p>
                <p className="text-sm text-muted-foreground">Unread</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/50">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <MailOpen className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {messages.length - unreadCount}
                </p>
                <p className="text-sm text-muted-foreground">Read</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Messages List */}
        <div className="flex flex-col gap-2">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="border-border/50 bg-card/50">
                <CardContent className="flex items-start gap-4 p-4">
                  <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
                  <div className="flex flex-1 flex-col gap-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : filteredMessages.length === 0 ? (
            <Card className="border-border/50 bg-card/50">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <MessageSquare className="mb-4 h-12 w-12 text-muted-foreground/50" />
                <p className="text-center text-muted-foreground">
                  {searchQuery || filterStatus !== "all"
                    ? "No messages found matching your criteria."
                    : "No messages yet. Contact form submissions will appear here."}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredMessages.map((message) => (
              <Card
                key={message._id}
                className={`cursor-pointer border-border/50 transition-all hover:border-primary/50 hover:bg-accent/50 ${
                  !message.read ? "bg-primary/5" : "bg-card/50"
                }`}
                onClick={() => handleViewMessage(message)}
              >
                <CardContent className="flex items-start gap-4 p-4">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-semibold ${
                      !message.read
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {message.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-medium ${
                            !message.read ? "text-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {message.name}
                        </span>
                        {!message.read && (
                          <Badge variant="secondary" className="text-xs">
                            New
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(new Date(message.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                handleMarkAsRead(message)
                              }}
                            >
                              {message.read ? (
                                <>
                                  <Mail className="mr-2 h-4 w-4" />
                                  Mark as Unread
                                </>
                              ) : (
                                <>
                                  <MailOpen className="mr-2 h-4 w-4" />
                                  Mark as Read
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                setDeletingMessage(message)
                              }}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">{message.email}</span>
                    {message.subject && (
                      <span className="font-medium text-sm text-foreground">
                        {message.subject}
                      </span>
                    )}
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {message.message}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Message Detail Dialog */}
      <Dialog
        open={!!selectedMessage}
        onOpenChange={() => setSelectedMessage(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Message from {selectedMessage?.name}</DialogTitle>
            <DialogDescription>
              Received{" "}
              {selectedMessage?.createdAt &&
                format(new Date(selectedMessage.createdAt), "PPpp")}
            </DialogDescription>
          </DialogHeader>

          {selectedMessage && (
            <div className="flex flex-col gap-4">
              <div className="grid gap-2 rounded-lg border border-border/50 bg-muted/50 p-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">From:</span>
                  <span className="text-sm text-foreground">{selectedMessage.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">Email:</span>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {selectedMessage.email}
                  </a>
                </div>
                {selectedMessage.subject && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      Subject:
                    </span>
                    <span className="text-sm text-foreground">
                      {selectedMessage.subject}
                    </span>
                  </div>
                )}
              </div>

              <div className="rounded-lg border border-border/50 bg-card p-4">
                <p className="whitespace-pre-wrap text-sm text-foreground">
                  {selectedMessage.message}
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => selectedMessage && handleMarkAsRead(selectedMessage)}
            >
              {selectedMessage?.read ? (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Mark as Unread
                </>
              ) : (
                <>
                  <MailOpen className="mr-2 h-4 w-4" />
                  Mark as Read
                </>
              )}
            </Button>
            <Button asChild>
              <a href={`mailto:${selectedMessage?.email}`}>
                <Mail className="mr-2 h-4 w-4" />
                Reply via Email
              </a>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingMessage} onOpenChange={() => setDeletingMessage(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Message</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this message from{" "}
              {deletingMessage?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminShell>
  )
}
