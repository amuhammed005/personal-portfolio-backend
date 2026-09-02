"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AdminShell } from "@/components/admin/admin-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Plus, MoreHorizontal, Pencil, Trash2, Loader2, BarChart3, GripVertical } from "lucide-react"
import { statSchema, type StatInput } from "@/lib/validations"

interface Stat extends StatInput {
  _id: string
}

export default function StatsPage() {
  const [stats, setStats] = useState<Stat[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingStat, setEditingStat] = useState<Stat | null>(null)
  const [deletingStat, setDeletingStat] = useState<Stat | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<StatInput>({
    resolver: zodResolver(statSchema),
    defaultValues: {
      value: "",
      label: "",
      order: 0,
    },
  })

  const fetchData = async () => {
    try {
      const response = await fetch("/api/stats")
      const data = await response.json()
      setStats(data || [])
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (isDialogOpen && editingStat) {
      form.reset(editingStat)
    } else if (!isDialogOpen) {
      form.reset({ value: "", label: "", order: 0 })
      setEditingStat(null)
    }
  }, [isDialogOpen, editingStat, form])

  const onSubmit = async (data: StatInput) => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/admin/stats", {
        method: editingStat ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          editingStat ? { ...data, _id: editingStat._id } : data
        ),
      })

      if (!response.ok) throw new Error("Failed to save stat")

      await fetchData()
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error saving stat:", error)
      alert("Failed to save stat")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingStat) return
    try {
      await fetch(`/api/admin/stats?id=${deletingStat._id}`, {
        method: "DELETE",
      })
      await fetchData()
    } catch (error) {
      console.error("Error deleting stat:", error)
    } finally {
      setDeletingStat(null)
    }
  }

  return (
    <AdminShell title="Stats">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Portfolio Statistics</h2>
            <p className="text-sm text-muted-foreground">
              Manage the statistics displayed on your portfolio homepage
            </p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Stat
          </Button>
        </div>

        {/* Stats Preview */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Preview
            </CardTitle>
            <CardDescription>
              How your stats will appear on the portfolio
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="rounded-lg border border-border/50 bg-muted/50 p-4 text-center">
                    <Skeleton className="mx-auto mb-2 h-8 w-16" />
                    <Skeleton className="mx-auto h-4 w-24" />
                  </div>
                ))}
              </div>
            ) : stats.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <BarChart3 className="mb-4 h-12 w-12 text-muted-foreground/50" />
                <p className="text-muted-foreground">
                  No stats yet. Add your first stat to display on your portfolio.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                  <div
                    key={stat._id}
                    className="rounded-lg border border-border/50 bg-linear-to-br from-muted/50 to-background p-4 text-center"
                  >
                    <div className="text-3xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats List */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle>Manage Stats</CardTitle>
            <CardDescription>
              Click on a stat to edit it or use the dropdown menu for more options
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex flex-col gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 rounded-lg border border-border/50 p-3">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-24 flex-1" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                ))}
              </div>
            ) : stats.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">
                No stats to manage. Add one using the button above.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {stats.map((stat, index) => (
                  <div
                    key={stat._id}
                    className="flex items-center gap-4 rounded-lg border border-border/50 bg-muted/30 p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <GripVertical className="h-4 w-4" />
                      <span className="w-6 text-center text-sm">{index + 1}</span>
                    </div>
                    <div className="flex flex-1 items-center gap-4">
                      <span className="font-bold text-primary">{stat.value}</span>
                      <span className="text-muted-foreground">{stat.label}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Order: {stat.order || 0}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setEditingStat(stat)
                            setIsDialogOpen(true)
                          }}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeletingStat(stat)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Stat Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingStat ? "Edit Stat" : "Add New Stat"}</DialogTitle>
            <DialogDescription>
              {editingStat
                ? "Update the stat details."
                : "Add a new statistic to display on your portfolio."}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Value</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 50+, 1M, 99%" {...field} />
                    </FormControl>
                    <FormDescription>
                      The number or value to display (can include symbols)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Label</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Projects Completed" {...field} />
                    </FormControl>
                    <FormDescription>
                      Description shown below the value
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
                  {editingStat ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingStat} onOpenChange={() => setDeletingStat(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Stat</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deletingStat?.value} - {deletingStat?.label}&quot;?
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
