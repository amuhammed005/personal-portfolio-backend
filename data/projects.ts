export type ProjectCategory = "Web Development" | "Data Science" | "Developer Tools" | "Education" | "Fun & Games"

export interface Project {
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
}

export const projects: Project[] = [
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
  },
  {
    id: "webdevblog",
    title: "Web Development Blog Platform",
    description:
      "A full-stack blog application built with Next.js, featuring an admin dashboard for content management.",
    fullDescription:
      "This project is a full-stack blog platform built using Next.js with both frontend and backend capabilities. It includes an admin dashboard for managing posts, editing content, and controlling application data. The project demonstrates modern full-stack development practices including server-side rendering, API routes, and structured content management. It is currently under development and will showcase advanced Next.js features upon completion.",
    image: "/images/projects/blog.png",
    images: ["/images/projects/blog.png"],
    technologies: ["Next.js", "React", "Node.js", "MongoDB"],
    category: "Web Development",
    date: "2026-02-10",
    liveUrl: "",
    githubUrl: "https://github.com/damstech/webdevblog",
    featured: false,
  },
];

// Data Science & Machine Learning Projects
export const dataScienceProjects: Project[] = [
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
  }
  ,
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
  },
];

// Combine all projects
export const allProjects: Project[] = [...projects, ...dataScienceProjects]

export const featuredProjects = allProjects.filter((p) => p.featured)
export const otherProjects = allProjects.filter((p) => !p.featured)

// Filter helpers
export const webDevProjects = allProjects.filter((p) => p.category === "Web Development" || p.category === "Developer Tools" || p.category === "Education" || p.category === "Fun & Games")
export const dsProjects = allProjects.filter((p) => p.category === "Data Science")
