"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AdminShell } from "@/components/admin/admin-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Slider } from "@/components/ui/slider"
import { Plus, MoreHorizontal, Pencil, Trash2, Search, Loader2 } from "lucide-react"
import { skillSchema, skillLevelSchema, type SkillInput, type SkillLevelInput } from "@/lib/validations"

interface Skill extends SkillInput {
  _id: string
}

interface SkillLevel extends SkillLevelInput {
  _id: string
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [skillLevels, setSkillLevels] = useState<SkillLevel[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // Skill dialog state
  const [isSkillDialogOpen, setIsSkillDialogOpen] = useState(false)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [deletingSkill, setDeletingSkill] = useState<Skill | null>(null)
  const [isSubmittingSkill, setIsSubmittingSkill] = useState(false)

  // Skill Level dialog state
  const [isSkillLevelDialogOpen, setIsSkillLevelDialogOpen] = useState(false)
  const [editingSkillLevel, setEditingSkillLevel] = useState<SkillLevel | null>(null)
  const [deletingSkillLevel, setDeletingSkillLevel] = useState<SkillLevel | null>(null)
  const [isSubmittingSkillLevel, setIsSubmittingSkillLevel] = useState(false)

  const skillForm = useForm<SkillInput>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: "",
      icon: "",
      category: "web",
      order: 0,
    },
  })

  const skillLevelForm = useForm<SkillLevelInput>({
    resolver: zodResolver(skillLevelSchema),
    defaultValues: {
      name: "",
      level: 50,
      order: 0,
    },
  })

  const fetchData = async () => {
    try {
      const response = await fetch("/api/admin/skills")
      const data = await response.json()
      setSkills(data.skills || [])
      setSkillLevels(data.skillLevels || [])
    } catch (error) {
      console.error("Failed to fetch skills:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Reset form when dialog opens/closes or when editing item changes
  useEffect(() => {
    if (isSkillDialogOpen && editingSkill) {
      skillForm.reset(editingSkill)
    } else if (!isSkillDialogOpen) {
      skillForm.reset({ name: "", icon: "", category: "web", order: 0 })
      setEditingSkill(null)
    }
  }, [isSkillDialogOpen, editingSkill, skillForm])

  useEffect(() => {
    if (isSkillLevelDialogOpen && editingSkillLevel) {
      skillLevelForm.reset(editingSkillLevel)
    } else if (!isSkillLevelDialogOpen) {
      skillLevelForm.reset({ name: "", level: 50, order: 0 })
      setEditingSkillLevel(null)
    }
  }, [isSkillLevelDialogOpen, editingSkillLevel, skillLevelForm])

  // Submit handlers
  const onSubmitSkill = async (data: SkillInput) => {
    setIsSubmittingSkill(true)
    try {
      const response = await fetch("/api/admin/skills", {
        method: editingSkill ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          editingSkill
            ? { type: "skill", _id: editingSkill._id, ...data }
            : { type: "skill", ...data }
        ),
      })

      if (!response.ok) throw new Error("Failed to save skill")

      await fetchData()
      setIsSkillDialogOpen(false)
    } catch (error) {
      console.error("Error saving skill:", error)
      alert("Failed to save skill")
    } finally {
      setIsSubmittingSkill(false)
    }
  }

  const onSubmitSkillLevel = async (data: SkillLevelInput) => {
    setIsSubmittingSkillLevel(true)
    try {
      const response = await fetch("/api/admin/skills", {
        method: editingSkillLevel ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          editingSkillLevel
            ? { type: "skillLevel", _id: editingSkillLevel._id, ...data }
            : { type: "skillLevel", ...data }
        ),
      })

      if (!response.ok) throw new Error("Failed to save skill level")

      await fetchData()
      setIsSkillLevelDialogOpen(false)
    } catch (error) {
      console.error("Error saving skill level:", error)
      alert("Failed to save skill level")
    } finally {
      setIsSubmittingSkillLevel(false)
    }
  }

  const handleDeleteSkill = async () => {
    if (!deletingSkill) return
    try {
      await fetch(`/api/admin/skills?id=${deletingSkill._id}&type=skill`, {
        method: "DELETE",
      })
      await fetchData()
    } catch (error) {
      console.error("Error deleting skill:", error)
    } finally {
      setDeletingSkill(null)
    }
  }

  const handleDeleteSkillLevel = async () => {
    if (!deletingSkillLevel) return
    try {
      await fetch(`/api/admin/skills?id=${deletingSkillLevel._id}&type=skillLevel`, {
        method: "DELETE",
      })
      await fetchData()
    } catch (error) {
      console.error("Error deleting skill level:", error)
    } finally {
      setDeletingSkillLevel(null)
    }
  }

  const filteredSkills = skills.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredSkillLevels = skillLevels.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <AdminShell title="Skills">
      <div className="flex flex-col gap-6">
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs defaultValue="skills">
          <TabsList>
            <TabsTrigger value="skills">Technology Skills</TabsTrigger>
            <TabsTrigger value="levels">Skill Levels</TabsTrigger>
          </TabsList>

          {/* Technology Skills Tab */}
          <TabsContent value="skills" className="flex flex-col gap-4">
            <div className="flex justify-end">
              <Button onClick={() => setIsSkillDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Skill
              </Button>
            </div>

            <div className="rounded-lg border border-border/50 bg-card/50">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Icon</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead className="w-12.5"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                      </TableRow>
                    ))
                  ) : filteredSkills.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                        {searchQuery ? "No skills found." : "No skills yet. Add your first skill!"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSkills.map((skill) => (
                      <TableRow key={skill._id}>
                        <TableCell className="font-medium">{skill.name}</TableCell>
                        <TableCell className="font-mono text-sm text-muted-foreground">
                          {skill.icon}
                        </TableCell>
                        <TableCell>
                          <Badge variant={skill.category === "web" ? "default" : "secondary"}>
                            {skill.category === "web" ? "Web Dev" : "ML/AI"}
                          </Badge>
                        </TableCell>
                        <TableCell>{skill.order || 0}</TableCell>
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
                                  setEditingSkill(skill)
                                  setIsSkillDialogOpen(true)
                                }}
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setDeletingSkill(skill)}
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
            </div>
          </TabsContent>

          {/* Skill Levels Tab */}
          <TabsContent value="levels" className="flex flex-col gap-4">
            <div className="flex justify-end">
              <Button onClick={() => setIsSkillLevelDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Skill Level
              </Button>
            </div>

            <div className="rounded-lg border border-border/50 bg-card/50">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead className="w-12.5"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                      </TableRow>
                    ))
                  ) : filteredSkillLevels.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                        {searchQuery ? "No skill levels found." : "No skill levels yet. Add your first skill level!"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSkillLevels.map((skillLevel) => (
                      <TableRow key={skillLevel._id}>
                        <TableCell className="font-medium">{skillLevel.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-2 w-24 overflow-hidden rounded-full bg-secondary">
                              <div
                                className="h-full bg-primary"
                                style={{ width: `${skillLevel.level}%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {skillLevel.level}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{skillLevel.order || 0}</TableCell>
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
                                  setEditingSkillLevel(skillLevel)
                                  setIsSkillLevelDialogOpen(true)
                                }}
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setDeletingSkillLevel(skillLevel)}
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
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Skill Form Dialog */}
      <Dialog open={isSkillDialogOpen} onOpenChange={setIsSkillDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSkill ? "Edit Skill" : "Add New Skill"}</DialogTitle>
            <DialogDescription>
              {editingSkill ? "Update the skill details." : "Add a new technology skill."}
            </DialogDescription>
          </DialogHeader>

          <Form {...skillForm}>
            <form onSubmit={skillForm.handleSubmit(onSubmitSkill)} className="flex flex-col gap-4">
              <FormField
                control={skillForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., React, Python" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={skillForm.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon (Simple Icons name)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., react, python, typescript" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={skillForm.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="web">Web Development</SelectItem>
                        <SelectItem value="ml">Machine Learning / AI</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={skillForm.control}
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsSkillDialogOpen(false)}
                  disabled={isSubmittingSkill}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmittingSkill}>
                  {isSubmittingSkill && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingSkill ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Skill Level Form Dialog */}
      <Dialog open={isSkillLevelDialogOpen} onOpenChange={setIsSkillLevelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSkillLevel ? "Edit Skill Level" : "Add New Skill Level"}</DialogTitle>
            <DialogDescription>
              {editingSkillLevel ? "Update the skill level details." : "Add a new skill level with proficiency."}
            </DialogDescription>
          </DialogHeader>

          <Form {...skillLevelForm}>
            <form onSubmit={skillLevelForm.handleSubmit(onSubmitSkillLevel)} className="flex flex-col gap-4">
              <FormField
                control={skillLevelForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., JavaScript, Data Analysis" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={skillLevelForm.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Proficiency Level: {field.value}%</FormLabel>
                    <FormControl>
                      <Slider
                        min={0}
                        max={100}
                        step={5}
                        value={[field.value]}
                        onValueChange={(values) => field.onChange(values[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={skillLevelForm.control}
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsSkillLevelDialogOpen(false)}
                  disabled={isSubmittingSkillLevel}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmittingSkillLevel}>
                  {isSubmittingSkillLevel && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingSkillLevel ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Skill Confirmation */}
      <AlertDialog open={!!deletingSkill} onOpenChange={() => setDeletingSkill(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Skill</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deletingSkill?.name}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSkill}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Skill Level Confirmation */}
      <AlertDialog open={!!deletingSkillLevel} onOpenChange={() => setDeletingSkillLevel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Skill Level</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deletingSkillLevel?.name}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSkillLevel}
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
