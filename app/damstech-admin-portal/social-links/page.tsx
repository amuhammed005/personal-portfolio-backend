"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AdminShell } from "@/components/admin/admin-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
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
import { Skeleton } from "@/components/ui/skeleton"
import {
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Loader2,
  Link as LinkIcon,
  ExternalLink,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  Mail,
} from "lucide-react"
import { socialLinkSchema, type SocialLinkInput } from "@/lib/validations"

interface SocialLink extends SocialLinkInput {
  _id: string
}

// Icon mapping for preview
const iconMap: Record<string, React.ReactNode> = {
  github: <Github className="h-5 w-5" />,
  linkedin: <Linkedin className="h-5 w-5" />,
  twitter: <Twitter className="h-5 w-5" />,
  instagram: <Instagram className="h-5 w-5" />,
  youtube: <Youtube className="h-5 w-5" />,
  mail: <Mail className="h-5 w-5" />,
  email: <Mail className="h-5 w-5" />,
}

export default function SocialLinksPage() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null)
  const [deletingLink, setDeletingLink] = useState<SocialLink | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<SocialLinkInput>({
    resolver: zodResolver(socialLinkSchema),
    defaultValues: {
      name: "",
      url: "",
      icon: "",
      order: 0,
    },
  })

  const fetchData = async () => {
    try {
      const response = await fetch("/api/admin/social-links")
      const data = await response.json()
      setSocialLinks(data || [])
    } catch (error) {
      console.error("Failed to fetch social links:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (isDialogOpen && editingLink) {
      form.reset(editingLink)
    } else if (!isDialogOpen) {
      form.reset({ name: "", url: "", icon: "", order: 0 })
      setEditingLink(null)
    }
  }, [isDialogOpen, editingLink, form])

  const onSubmit = async (data: SocialLinkInput) => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/admin/social-links", {
        method: editingLink ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          editingLink ? { ...data, _id: editingLink._id } : data
        ),
      })

      if (!response.ok) throw new Error("Failed to save social link")

      await fetchData()
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error saving social link:", error)
      alert("Failed to save social link")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingLink) return
    try {
      await fetch(`/api/admin/social-links?id=${deletingLink._id}`, {
        method: "DELETE",
      })
      await fetchData()
    } catch (error) {
      console.error("Error deleting social link:", error)
    } finally {
      setDeletingLink(null)
    }
  }

  const getIconPreview = (iconName: string) => {
    const lowerIcon = iconName.toLowerCase()
    return iconMap[lowerIcon] || <LinkIcon className="h-5 w-5" />
  }

  return (
    <AdminShell title="Social Links">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Social Media Links</h2>
            <p className="text-sm text-muted-foreground">
              Manage the social media links displayed on your portfolio sidebar
            </p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Link
          </Button>
        </div>

        {/* Preview Card */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LinkIcon className="h-5 w-5" />
              Preview
            </CardTitle>
            <CardDescription>
              How your social links will appear in the sidebar
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-10 rounded-lg" />
                ))}
              </div>
            ) : socialLinks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <LinkIcon className="mb-4 h-12 w-12 text-muted-foreground/50" />
                <p className="text-muted-foreground">
                  No social links yet. Add your first social link.
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link._id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                    title={link.name}
                  >
                    {getIconPreview(link.icon)}
                  </a>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Links Table */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle>Manage Links</CardTitle>
            <CardDescription>
              All your social media links and their configurations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Icon</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                    </TableRow>
                  ))
                ) : socialLinks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                      No social links yet. Add one using the button above.
                    </TableCell>
                  </TableRow>
                ) : (
                  socialLinks.map((link) => (
                    <TableRow key={link._id}>
                      <TableCell className="font-medium">{link.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getIconPreview(link.icon)}
                          <span className="text-xs text-muted-foreground">{link.icon}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-primary hover:underline"
                        >
                          <span className="max-w-[200px] truncate">{link.url}</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </TableCell>
                      <TableCell>{link.order || 0}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingLink(link)
                                setIsDialogOpen(true)
                              }}
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeletingLink(link)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Social Link Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingLink ? "Edit Social Link" : "Add New Social Link"}</DialogTitle>
            <DialogDescription>
              {editingLink
                ? "Update the social link details."
                : "Add a new social media link to your portfolio."}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., GitHub, LinkedIn" {...field} />
                    </FormControl>
                    <FormDescription>
                      Display name for the social link
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://github.com/username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., github, linkedin, twitter" {...field} />
                    </FormControl>
                    <FormDescription>
                      Use lowercase icon names: github, linkedin, twitter, instagram, youtube, mail
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Order</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>
                      Lower numbers appear first
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingLink ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingLink} onOpenChange={() => setDeletingLink(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Social Link</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the &quot;{deletingLink?.name}&quot; link?
              This action cannot be undone.
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
