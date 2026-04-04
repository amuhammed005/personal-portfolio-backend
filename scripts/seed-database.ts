// This script seeds the MongoDB database with initial data
// Run with: npx tsx scripts/seed-database.ts
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { MongoClient } from "mongodb"
import bcrypt from "bcryptjs"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017"

const projectsData = [
  {
    id: "bookstore-app",
    title: "Online Bookstore Application",
    description:
      "A full-stack web application for browsing and managing books, built with modern frontend and backend technologies.",
    fullDescription:
      "This project is a full-stack bookstore application developed using Vite, Tailwind CSS, Node.js, and Express. The application allows users to browse books and interact with dynamically loaded content through a responsive interface. The backend handles API requests, manages data, and supports application logic. The project demonstrates integration between frontend and backend systems, RESTful API design, and building scalable web applications with a clean user interface.",
    image: "/images/projects/bookstore.png",
    images: ["/images/projects/bookstore.png"],
    technologies: ["Vite", "React", "Tailwind CSS", "Node.js", "Express"],
    category: "Web Development",
    date: "2025-03-10",
    liveUrl: "https://book-store-app-mern-umber.vercel.app/",
    githubUrl: "https://github.com/damstech/bookstore-app",
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "election-system",
    title: "Multi-Election Voting System",
    description:
      "A web-based voting system that supports multiple elections with secure vote handling and result tracking.",
    fullDescription:
      "This project is a full-stack election system designed to support multiple voting processes within a single platform. It includes features such as user authentication, vote validation to ensure one vote per user, and an admin dashboard for monitoring election results. Built with React, Node.js, and Express, the system demonstrates secure data handling, backend logic implementation, and user-focused design for real-world applications.",
    image: "/images/projects/election.png",
    images: ["/images/projects/election.png"],
    technologies: ["React", "Node.js", "Express", "MongoDB"],
    category: "Web Development",
    date: "2025-06-15",
    liveUrl: "https://election-system-mern-dqcj.vercel.app/",
    githubUrl: "https://github.com/damstech/election-system",
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "movie-app",
    title: "Movie Library Application",
    description:
      "A web application that fetches and displays movie data using an external API with dynamic user interaction.",
    fullDescription:
      "This project is a frontend-focused web application that integrates with an external movie API to fetch and display real-time movie data. It allows users to browse, search, and explore movie details through a responsive interface. The project highlights skills in API integration, asynchronous data handling, and dynamic UI rendering using modern JavaScript frameworks.",
    image: "/images/projects/movie.png",
    images: ["/images/projects/movie.png"],
    technologies: ["React", "API Integration", "JavaScript", "CSS"],
    category: "Web Development",
    date: "2024-11-20",
    liveUrl: "https://movie-library-seven.vercel.app/",
    githubUrl: "https://github.com/damstech/movie-app",
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Data Science & Machine Learning Projects
  {
    id: "house-price-prediction",
    title: "Housing Price Prediction (Mexico)",
    description:
      "Predict housing prices using real-world property data with regression-based machine learning models.",
    fullDescription:
      "This project focuses on building a regression-based machine learning model to estimate housing prices using a dataset of over 20,000 properties. The workflow includes data cleaning, handling missing values, feature engineering, and exploratory data analysis. The model is trained using supervised learning techniques and evaluated using standard regression metrics. Visualizations are used to understand relationships between variables such as property size and location.",
    image: "/images/projects/house-price-predict.png",
    images: ["/images/projects/house-price-predict.png"],
    technologies: [
      "Python",
      "Pandas",
      "Scikit-learn",
      "Matplotlib",
      "Regression",
    ],
    category: "Data Science",
    date: "2024-04-15",
    githubUrl: "https://github.com/damstech/house-price-prediction",
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "air-quality-analysis",
    title: "Air Quality Analysis & Time Series Forecasting",
    description:
      "Analyze and predict air pollution levels using time series modeling techniques.",
    fullDescription:
      "This project analyzes air quality data from African cities to identify pollution patterns and trends over time. It involves cleaning time-series data, visualizing pollutant levels, and building forecasting models to predict PM2.5 readings. The project demonstrates practical skills in time series analysis, data visualization, and environmental data interpretation.",
    image: "/images/projects/air-quality.png",
    images: ["/images/projects/air-quality.png"],
    technologies: ["Python", "Pandas", "Matplotlib", "Seaborn", "Time Series"],
    category: "Data Science",
    date: "2024-08-10",
    githubUrl: "https://github.com/damstech/air-quality-analysis",
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "concrete-strength-mlp",
    title: "Concrete Strength Prediction (Neural Network)",
    description:
      "Predict concrete compressive strength using a neural network model.",
    fullDescription:
      "This project implements a neural network model to predict the compressive strength of concrete based on input variables such as cement composition and curing conditions. It introduces key deep learning concepts including activation functions like ReLU and Sigmoid, and compares performance with traditional regression models. The project demonstrates foundational knowledge in neural networks and model evaluation.",
    image: "/images/projects/concrete-strength.png",
    images: ["/images/projects/concrete-strength.png"],
    technologies: [
      "Python",
      "NumPy",
      "Neural Networks",
      "MLP",
      "Deep Learning",
    ],
    category: "Data Science",
    date: "2026-01-15",
    githubUrl: "https://github.com/damstech/concrete-strength-prediction",
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "exploratory-data-analysis",
    title: "Exploratory Data Analysis & Statistical Insights",
    description:
      "Perform in-depth data exploration and statistical analysis to extract meaningful insights from datasets.",
    fullDescription:
      "This project combines multiple lab exercises focused on extracting insights from datasets using statistical methods. It includes summarizing data distributions, identifying correlations, and visualizing relationships between variables. The emphasis is on understanding data behavior before modeling.",
    image: "/images/projects/eda-stats.jpg",
    images: ["/images/projects/eda-stats.jpg"],
    technologies: [
      "Python",
      "Pandas",
      "NumPy",
      "Matplotlib",
      "Statistical Analysis",
    ],
    category: "Data Science",
    date: "2023-11-05",
    githubUrl: "https://github.com/damstech/exploratory-data-analysis",
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "predictive-modeling-regression",
    title: "Predictive Modeling with Regression Techniques",
    description:
      "Build and evaluate predictive models using various regression algorithms and techniques.",
    fullDescription:
      "This project focuses on applying regression techniques across structured datasets to predict outcomes. It includes data preprocessing, model training, evaluation, and interpretation of results. The project highlights understanding of bias-variance tradeoff and model performance metrics.",
    image: "/images/projects/regression-modeling.jpg",
    images: ["/images/projects/regression-modeling.jpg"],
    technologies: ["Python", "Scikit-learn", "Regression", "MAE", "RMSE"],
    category: "Data Science",
    date: "2023-10-15",
    githubUrl: "https://github.com/damstech/predictive-modeling",
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "data-cleaning-pipeline",
    title: "Data Cleaning & Preparation Pipeline",
    description:
      "Design robust workflows for preparing raw datasets for analysis and machine learning.",
    fullDescription:
      "This project demonstrates practical techniques for cleaning and preparing messy real-world datasets. Tasks include handling missing values, removing duplicates, correcting inconsistencies, and preparing structured datasets for machine learning. This forms the foundation of all data science workflows.",
    image: "/images/projects/data-cleaning.jpg",
    images: ["/images/projects/data-cleaning.jpg"],
    technologies: [
      "Python",
      "Pandas",
      "Data Transformation",
      "Feature Engineering",
    ],
    category: "Data Science",
    date: "2023-09-20",
    githubUrl: "https://github.com/damstech/data-cleaning-pipeline",
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

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
    title: "Software Engineer",
    company: "ManazTechnologies",
    companyUrl: "",
    date: "Oct 2024 — Dec 2025",
    description:
      "Worked as a backend-focused software engineer, contributing to the design and development of secure and scalable web systems. Implemented authentication and authorization using JWT and OAuth 2.0 to protect sensitive endpoints and manage user sessions. Developed middleware for input validation and data sanitization to improve system reliability and prevent malformed data. Designed and optimized database schemas and integrated ORM/ODM tools such as Mongoose and Sequelize for efficient data management. Authored API documentation using Swagger/OpenAPI to improve developer experience and support third-party integrations. Performed end-to-end API testing using Postman and automated validation workflows within CI/CD pipelines.",
    technologies: [
      "Node.js",
      "Express",
      "MongoDB",
      "JWT",
      "OAuth",
      "Mongoose",
      "Sequelize",
      "Swagger",
      "Postman",
      "REST APIs",
    ],
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Frontend Developer (Intern)",
    company: "ManazTechnologies",
    companyUrl: "",
    date: "May 2024 — Oct 2024",
    description:
      "Developed responsive and interactive web applications using React, Vite, and Tailwind CSS. Improved application performance by optimizing load times and rendering efficiency using modern frontend best practices. Implemented state management solutions using React Hooks, Context API, and Redux Toolkit where necessary. Integrated RESTful APIs and handled asynchronous data fetching to ensure smooth data flow. Designed reusable UI components to maintain consistency across the application and translated UI/UX designs from Figma into pixel-perfect interfaces.",
    technologies: [
      "React",
      "Vite",
      "Tailwind CSS",
      "JavaScript",
      "Redux",
      "REST APIs",
    ],
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Software Engineer (Intern)",
    company: "University of Ghana Computing Systems (UGCS)",
    companyUrl: "",
    date: "Mar 2024 — Apr 2024",
    description:
      "Gained practical experience working with Drupal-based content management systems and web development workflows. Assisted with technical documentation and supported internal system operations. Collaborated with software teams to understand system architecture and contribute to ongoing development tasks.",
    technologies: [
      "Drupal",
      "Content Management Systems",
      "Technical Documentation",
    ],
    order: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const personalInfoData = {
  name: "Adam Muhammed",
  title: "Full Stack Developer & Data Scientist",
  tagline:
    "I build accessible, pixel-perfect digital experiences and extract insights from data.",
  email: "adammuhammed5000@gmail.com",
  location: "Legon, Accra",
  bio: `Software Developer | React | Node.js | Python | Data Science | Machine Learning | Programming
As a Software Developer, I possess expertise in developing full-stack web applications by leveraging cutting-edge technologies like React, Vite, Node.js, Express.js, and Next.js. I find pleasure in designing user-centric and responsive applications and have hands-on experience with API integration and backend development.

Apart from software development, my area of interest is in Data Science and Machine Learning. I have been involved in various data-oriented projects wherein I have been responsible for data wrangling, performing EDA (Exploratory Data Analysis), and constructing models using Python.
I am deeply interested in creating systems that incorporate software development and data-driven analytics. I am available for software development, data science, and machine learning roles.`,
  resumeUrl: "/resume.pdf",
  avatar: "/images/avatar.jpg",
  whatsapp: "+233243323019",
  updatedAt: new Date(),
};

const statsData = [
  { value: "05+", label: "Years Experience", order: 1 },
  { value: "08+", label: "Projects Completed", order: 2 },
  { value: "05+", label: "Happy Clients", order: 3 },
  { value: "20+", label: "Tech Skills", order: 4 },
];

const socialLinksData = [
  {
    name: "GitHub",
    url: "https://github.com/damstech",
    icon: "github",
    order: 1,
  },
  {
    name: "LinkedIn",
    url: "https://https://www.linkedin.com/in/adam-muhammed",
    icon: "linkedin",
    order: 2,
  },
  {
    name: "Twitter",
    url: "https://x.com/codewarrior33",
    icon: "twitter",
    order: 3,
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/amuhammed005?igsh=b2ZoYzBtNjZjcmMx&utm_source=qr",
    icon: "instagram",
    order: 4,
  },
];

const skillLevelsData = [
  { name: "JavaScript", level: 80, order: 1 },
  { name: "React.js", level: 85, order: 2 },
  { name: "TypeScript", level: 65, order: 3 },
  { name: "Python", level: 85, order: 4 },
  { name: "HTML/CSS", level: 95, order: 5 },
  { name: "Node.js", level: 75, order: 6 },
  { name: "Next.js", level: 80, order: 7 },
  { name: "Machine Learning", level: 75, order: 8 },
  { name: "Data Analysis", level: 70, order: 9 },
  { name: "Deep Learning", level: 40, order: 10 },
];

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
        email: process.env.ADMIN_EMAIL || "adammuhamme5000d@damstech.dev",
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
