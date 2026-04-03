import { ObjectId } from "mongodb"

// Project types
export type ProjectCategory = 
  | "Web Development" 
  | "Data Science" 
  | "Developer Tools" 
  | "Education" 
  | "Fun & Games"

export interface Project {
  _id?: ObjectId
  id: string
  title: string
  description: string
  fullDescription?: string
  image: string
  images?: string[]
  technologies: string[]
  category: ProjectCategory
  date: string
  liveUrl?: string
  githubUrl?: string
  featured: boolean
  createdAt?: Date
  updatedAt?: Date
}

// Skill types
export interface Skill {
  _id?: ObjectId
  name: string
  icon: string
  category: "web" | "ml"
  order?: number
  createdAt?: Date
  updatedAt?: Date
}

// Skill level types
export interface SkillLevel {
  _id?: ObjectId
  name: string
  level: number
  order?: number
  createdAt?: Date
  updatedAt?: Date
}

// Experience types
export interface Experience {
  _id?: ObjectId
  title: string
  company: string
  companyUrl?: string
  date: string
  description: string
  technologies: string[]
  order?: number
  createdAt?: Date
  updatedAt?: Date
}

// Personal info types
export interface PersonalInfo {
  _id?: ObjectId
  name: string
  title: string
  tagline: string
  email: string
  location: string
  bio: string
  resumeUrl?: string
  avatar?: string
  whatsapp?: string
  updatedAt?: Date
}

// Stats types
export interface Stat {
  _id?: ObjectId
  value: string
  label: string
  order?: number
  createdAt?: Date
  updatedAt?: Date
}

// Social links types
export interface SocialLink {
  _id?: ObjectId
  name: string
  url: string
  icon: string
  order?: number
  createdAt?: Date
  updatedAt?: Date
}

// Contact message types
export interface ContactMessage {
  _id?: ObjectId
  name: string
  email: string
  subject?: string
  message: string
  read: boolean
  createdAt: Date
  updatedAt?: Date
}

// Admin types
export interface Admin {
  _id?: ObjectId
  username: string
  email: string
  password: string
  createdAt: Date
  updatedAt?: Date
}

// Navigation links
export interface NavLink {
  name: string
  href: string
}

// Session types
export interface AdminSession {
  adminId: string
  username: string
  email: string
  exp: number
}
