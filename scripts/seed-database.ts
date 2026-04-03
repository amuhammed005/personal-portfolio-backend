// This script seeds the MongoDB database with initial data
// Run with: npx tsx scripts/seed-database.ts

import { MongoClient } from "mongodb"
import bcrypt from "bcryptjs"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017"

const projectsData = [
  {
    id: "spotify-profile",
    title: "Spotify Profile Viewer",
    description: "A web app for visualizing personalized Spotify data. View your top artists, top tracks, recently played tracks, and detailed audio information about each track.",
    fullDescription: "A comprehensive web application that connects with the Spotify API to provide users with deep insights into their listening habits. Features include viewing top artists and tracks over different time ranges, recently played tracks with timestamp information, and detailed audio analysis for each track including tempo, key, and energy levels.",
    image: "/images/projects/spotify.jpg",
    images: ["/images/projects/spotify.jpg"],
    technologies: ["React", "Node.js", "Express", "Spotify API", "Styled Components"],
    category: "Web Development",
    date: "2024-03-15",
    liveUrl: "https://spotify-profile.com",
    githubUrl: "https://github.com/damstech/spotify-profile",
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "halcyon-theme",
    title: "Halcyon Theme",
    description: "A minimal, dark blue theme for VS Code, Sublime Text, Atom, iTerm, and more.",
    fullDescription: "Halcyon is a carefully crafted minimal dark theme with a beautiful blue color palette designed to reduce eye strain during long coding sessions.",
    image: "/images/projects/halcyon.jpg",
    images: ["/images/projects/halcyon.jpg"],
    technologies: ["VS Code", "Sublime Text", "Atom", "iTerm2", "npm"],
    category: "Developer Tools",
    date: "2024-01-20",
    liveUrl: "https://halcyon-theme.netlify.app",
    githubUrl: "https://github.com/damstech/halcyon-theme",
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "house-price-prediction",
    title: "House Price Prediction (Mexico)",
    description: "Predict housing prices using real-world property data from Mexico with regression-based machine learning models.",
    fullDescription: "This project focuses on building a regression-based machine learning model to estimate housing prices.",
    image: "/images/projects/house-price.jpg",
    images: ["/images/projects/house-price.jpg"],
    technologies: ["Python", "Pandas", "Scikit-learn", "Matplotlib", "Linear Regression"],
    category: "Data Science",
    date: "2024-02-15",
    githubUrl: "https://github.com/damstech/house-price-prediction",
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

const webSkillsData = [
  { name: "React", icon: "react", category: "web", order: 1 },
  { name: "Next.js", icon: "nextjs", category: "web", order: 2 },
  { name: "TypeScript", icon: "typescript", category: "web", order: 3 },
  { name: "JavaScript", icon: "javascript", category: "web", order: 4 },
  { name: "Node.js", icon: "nodejs", category: "web", order: 5 },
  { name: "Tailwind CSS", icon: "tailwind", category: "web", order: 6 },
  { name: "PostgreSQL", icon: "postgresql", category: "web", order: 7 },
  { name: "MongoDB", icon: "mongodb", category: "web", order: 8 },
]

const mlSkillsData = [
  { name: "Python", icon: "python", category: "ml", order: 1 },
  { name: "Pandas", icon: "pandas", category: "ml", order: 2 },
  { name: "NumPy", icon: "numpy", category: "ml", order: 3 },
  { name: "Scikit-learn", icon: "scikitlearn", category: "ml", order: 4 },
  { name: "TensorFlow", icon: "tensorflow", category: "ml", order: 5 },
  { name: "Matplotlib", icon: "matplotlib", category: "ml", order: 6 },
]

const experienceData = [
  {
    title: "Senior Frontend Engineer",
    company: "TechCorp",
    companyUrl: "https://techcorp.com",
    date: "2023 — Present",
    description: "Build and maintain critical components used to construct the company's frontend, across the whole product.",
    technologies: ["React", "TypeScript", "Next.js", "GraphQL", "Tailwind CSS"],
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Frontend Developer",
    company: "StartupXYZ",
    companyUrl: "https://startupxyz.com",
    date: "2021 — 2023",
    description: "Developed and shipped highly interactive web applications for diverse clients.",
    technologies: ["React", "JavaScript", "SCSS", "Node.js", "MongoDB"],
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

const personalInfoData = {
  name: "DamsTech",
  title: "Full Stack Developer & Data Scientist",
  tagline: "I build accessible, pixel-perfect digital experiences and extract insights from data.",
  email: "hello@damstech.dev",
  location: "San Francisco, CA",
  bio: "I'm a developer and data scientist passionate about crafting accessible, pixel-perfect user interfaces and extracting meaningful insights from data.",
  resumeUrl: "/resume.pdf",
  avatar: "/images/avatar.jpg",
  whatsapp: "+1234567890",
  updatedAt: new Date(),
}

const statsData = [
  { value: "5+", label: "Years Experience", order: 1 },
  { value: "25+", label: "Projects Completed", order: 2 },
  { value: "15+", label: "Happy Clients", order: 3 },
  { value: "20+", label: "Tech Skills", order: 4 },
]

const socialLinksData = [
  { name: "GitHub", url: "https://github.com/damstech", icon: "github", order: 1 },
  { name: "LinkedIn", url: "https://linkedin.com/in/damstech", icon: "linkedin", order: 2 },
  { name: "Twitter", url: "https://twitter.com/damstech", icon: "twitter", order: 3 },
  { name: "Instagram", url: "https://instagram.com/damstech", icon: "instagram", order: 4 },
]

const skillLevelsData = [
  { name: "JavaScript", level: 95, order: 1 },
  { name: "React", level: 90, order: 2 },
  { name: "TypeScript", level: 85, order: 3 },
  { name: "Python", level: 85, order: 4 },
  { name: "HTML/CSS", level: 95, order: 5 },
  { name: "Node.js", level: 80, order: 6 },
  { name: "Machine Learning", level: 75, order: 7 },
  { name: "Data Analysis", level: 80, order: 8 },
]

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI)
  
  try {
    await client.connect()
    console.log("Connected to MongoDB")
    
    const db = client.db("portfolio")
    
    // Clear existing data
    await db.collection("projects").deleteMany({})
    await db.collection("skills").deleteMany({})
    await db.collection("experience").deleteMany({})
    await db.collection("personal_info").deleteMany({})
    await db.collection("stats").deleteMany({})
    await db.collection("social_links").deleteMany({})
    await db.collection("skill_levels").deleteMany({})
    
    // Insert new data
    await db.collection("projects").insertMany(projectsData)
    console.log("Inserted projects")
    
    await db.collection("skills").insertMany([...webSkillsData, ...mlSkillsData])
    console.log("Inserted skills")
    
    await db.collection("experience").insertMany(experienceData)
    console.log("Inserted experience")
    
    await db.collection("personal_info").insertOne(personalInfoData)
    console.log("Inserted personal info")
    
    await db.collection("stats").insertMany(statsData)
    console.log("Inserted stats")
    
    await db.collection("social_links").insertMany(socialLinksData)
    console.log("Inserted social links")
    
    await db.collection("skill_levels").insertMany(skillLevelsData)
    console.log("Inserted skill levels")
    
    // Create admin user
    const adminUsername = process.env.ADMIN_USERNAME || "damstech"
    const existingAdmin = await db.collection("admins").findOne({ username: adminUsername })
    if (!existingAdmin) {
      const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || "admin123"
      const hashedPassword = await bcrypt.hash(adminPassword, 12)
      await db.collection("admins").insertOne({
        username: adminUsername,
        email: process.env.ADMIN_EMAIL || "admin@damstech.dev",
        password: hashedPassword,
        createdAt: new Date(),
      })
      console.log(`Created admin user (username: ${adminUsername}, password: ${adminPassword})`)
    }
    
    console.log("Database seeded successfully!")
    
  } catch (error) {
    console.error("Error seeding database:", error)
  } finally {
    await client.close()
  }
}

seedDatabase()
