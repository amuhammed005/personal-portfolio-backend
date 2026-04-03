import { z } from "zod"

// Project validation
export const projectSchema = z.object({
  id: z.string().min(1, "ID is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  fullDescription: z.string().optional(),
  image: z.string().min(1, "Image is required"),
  images: z.array(z.string()).optional(),
  technologies: z.array(z.string()).min(1, "At least one technology is required"),
  category: z.enum([
    "Web Development",
    "Data Science",
    "Developer Tools",
    "Education",
    "Fun & Games",
  ]),
  date: z.string().min(1, "Date is required"),
  liveUrl: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
  featured: z.boolean(),
})

// Skill validation
export const skillSchema = z.object({
  name: z.string().min(1, "Name is required"),
  icon: z.string().min(1, "Icon is required"),
  category: z.enum(["web", "ml"]),
  order: z.number().optional(),
})

// Skill level validation
export const skillLevelSchema = z.object({
  name: z.string().min(1, "Name is required"),
  level: z.number().min(0).max(100),
  order: z.number().optional(),
})

// Experience validation
export const experienceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  company: z.string().min(1, "Company is required"),
  companyUrl: z.string().url().optional().or(z.literal("")),
  date: z.string().min(1, "Date is required"),
  description: z.string().min(1, "Description is required"),
  technologies: z.array(z.string()),
  order: z.number().optional(),
})

// Personal info validation
export const personalInfoSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().min(1, "Title is required"),
  tagline: z.string().min(1, "Tagline is required"),
  email: z.string().email("Invalid email"),
  location: z.string().min(1, "Location is required"),
  bio: z.string().min(1, "Bio is required"),
  resumeUrl: z.string().optional(),
  avatar: z.string().optional(),
  whatsapp: z.string().optional(),
})

// Stats validation
export const statSchema = z.object({
  value: z.string().min(1, "Value is required"),
  label: z.string().min(1, "Label is required"),
  order: z.number().optional(),
})

// Social link validation
export const socialLinkSchema = z.object({
  name: z.string().min(1, "Name is required"),
  url: z.string().url("Invalid URL"),
  icon: z.string().min(1, "Icon is required"),
  order: z.number().optional(),
})

// Contact message validation
export const contactMessageSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  subject: z.string().optional(),
  message: z.string().min(1, "Message is required"),
})

// Login validation
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
})

// Admin password change
export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export type ProjectInput = z.infer<typeof projectSchema>
export type SkillInput = z.infer<typeof skillSchema>
export type SkillLevelInput = z.infer<typeof skillLevelSchema>
export type ExperienceInput = z.infer<typeof experienceSchema>
export type PersonalInfoInput = z.infer<typeof personalInfoSchema>
export type StatInput = z.infer<typeof statSchema>
export type SocialLinkInput = z.infer<typeof socialLinkSchema>
export type ContactMessageInput = z.infer<typeof contactMessageSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type PasswordChangeInput = z.infer<typeof passwordChangeSchema>
