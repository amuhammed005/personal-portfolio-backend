"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Spinner } from "../ui/spinner";
import { Skeleton } from "../ui/skeleton";
// Commented out: Static data import no longer needed since we're fetching from API
// import { allProjects } from "@/data/projects"

import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Folder, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useFetch } from "@/hooks/useFetch";
import { ErrorState } from "../error-state";
// Commented out: Type is now defined below instead of imported
// import { Project } from "@/data/projects"

// Added: Project type definition that was missing
type Project = {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  category: string;
  featured: boolean;
  githubUrl?: string;
  liveUrl?: string;
};

type FilterType = "All" | "Web Development" | "Data Science";

export function ProjectsSection() {
  // IMPORTANT: All hooks must be called before any conditional returns
  // This ensures React hooks are called in the same order on every render

  // Filter state for project categories
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");

  // Commented out: No longer needed since we're using useFetch hook for state management
  // const [allProjects, setAllProjects] = useState<Project[]>([])
  // const [loading, setLoading] = useState(true)
  // const [error, setError] = useState<string | null>(null)

  // Fetch projects from API - this hook manages loading, error, and data states
  const {
    data: projects,
    loading,
    error,
    refetch,
  } = useFetch<Project[]>("/api/admin/projects");

  // Handle loading state - show spinner while fetching data
  if (loading) return (
    // <div className="flex flex-col items-center justify-center py-16 text-center">
    //   <Spinner />
    // </div>
    <section className="py-24 md:py-32">
      <div className="container mx-auto px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* ✅ Skeleton placeholders */}
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </section>
  ); 

  // Handle error state - show error message with retry option
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  // Handle empty state - show message when no projects are returned
  if (!projects || projects.length === 0) {
    return <ErrorState message="No projects found." />;
  }

  // Filter projects based on selected category
  // Added optional chaining (?.) for safety, though we already check for null above
  const filteredProjects = projects?.filter((project) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Web Development") {
      // Web Development filter includes multiple related categories
      return [
        "Web Development",
        "Developer Tools",
        "Education",
        "Fun & Games",
      ].includes(project.category);
    }
    // Data Science filter shows only Data Science projects
    return project.category === "Data Science";
  });

  // Separate projects into featured and non-featured for different display styles
  const featuredProjects = filteredProjects?.filter((p) => p.featured);
  const otherProjects = filteredProjects?.filter((p) => !p.featured);

  // Available filter options
  const filters: FilterType[] = ["All", "Web Development", "Data Science"];

  return (
    <section id="projects" className="py-24 md:py-32">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          {/* Section heading with fade-in animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-center lg:text-left"
          >
            <SectionHeading title="Featured Projects" />
          </motion.div>

          {/* Filter Buttons - allows users to filter projects by category */}
          <motion.div
            className="flex flex-wrap justify-center lg:justify-start gap-3 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                  // Active filter gets primary styling, Data Science gets special chart-4 color
                  activeFilter === filter
                    ? filter === "Data Science"
                      ? "bg-chart-4 text-primary-foreground"
                      : "bg-primary text-primary-foreground"
                    : "bg-card border border-border hover:border-primary/50 text-muted-foreground hover:text-foreground",
                )}
              >
                {filter}
                {/* Add ML badge to Data Science filter */}
                {filter === "Data Science" && (
                  <span className="ml-2 px-1.5 py-0.5 text-xs rounded bg-background/20">
                    ML
                  </span>
                )}
              </button>
            ))}
          </motion.div>

          {/* Featured Projects - Large card layout with alternating image positions */}
          <div className="space-y-24 mb-24">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.title}
                className={`relative grid md:grid-cols-12 gap-4 items-center ${
                  // Alternate text alignment for visual interest
                  index % 2 === 1 ? "md:text-right" : ""
                }`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {/* Project Image - alternates left/right position */}
                <motion.div
                  className={`md:col-span-7 ${
                    index % 2 === 1 ? "md:col-start-6" : ""
                  } relative group`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Link
                    href={`/projects/${project.id}`}
                    className="block relative aspect-video rounded-lg overflow-hidden"
                  >
                    {/* Overlay that fades on hover */}
                    <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors duration-300 z-10" />
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  </Link>
                </motion.div>

                {/* Project Info - alternates left/right position opposite to image */}
                <motion.div
                  className={`md:col-span-6 ${
                    index % 2 === 1
                      ? "md:col-start-1 md:row-start-1"
                      : "md:col-start-6"
                  } md:row-start-1 relative z-10`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  {/* Project category badges */}
                  <div
                    className={`flex items-center gap-2 mb-2 ${index % 2 === 1 ? "md:justify-end" : ""}`}
                  >
                    <p className="text-primary font-mono text-sm">
                      Featured Project
                    </p>
                    {/* Show Data Science badge for DS projects */}
                    {project.category === "Data Science" && (
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-chart-4/20 text-chart-4 border border-chart-4/30">
                        Data Science
                      </span>
                    )}
                  </div>

                  {/* Project title with hover effect */}
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    <Link
                      href={`/projects/${project.id}`}
                      className="hover:text-primary transition-colors"
                    >
                      {project.title}
                    </Link>
                  </h3>

                  {/* Project description in elevated card */}
                  <div className="bg-card p-6 rounded-lg shadow-lg mb-4">
                    <p className="text-muted-foreground leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Technologies used in the project */}
                  <ul
                    className={`flex flex-wrap gap-3 mb-4 text-sm font-mono text-muted-foreground ${
                      index % 2 === 1 ? "md:justify-end" : ""
                    }`}
                  >
                    {project.technologies.map((tech) => (
                      <li key={tech}>{tech}</li>
                    ))}
                  </ul>

                  {/* Project links - GitHub, live demo, and details */}
                  <div
                    className={`flex items-center gap-4 ${
                      index % 2 === 1 ? "md:justify-end" : ""
                    }`}
                  >
                    {/* Only show GitHub link if URL exists */}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground hover:text-primary transition-colors"
                        aria-label="GitHub Repository"
                      >
                        <Github className="h-5 w-5" />
                      </a>
                    )}
                    {/* Only show live demo link if URL exists */}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground hover:text-primary transition-colors"
                        aria-label="Live Demo"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </a>
                    )}
                    {/* Link to detailed project page */}
                    <Link
                      href={`/projects/${project.id}`}
                      className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium"
                    >
                      View Details <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Other Projects Section Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl font-semibold text-foreground">
              Other Noteworthy Projects
            </h3>
          </motion.div>

          {/* Other Projects - Grid of smaller cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherProjects.map((project, index) => (
              <motion.div
                key={project.title}
                className="group bg-card rounded-lg p-6 hover:translate-y-[-8px] transition-all duration-300 border border-border/50 hover:border-primary/50"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Card header with folder icon and links */}
                <div className="flex items-center justify-between mb-6">
                  <motion.div
                    initial={{ rotate: -20, opacity: 0 }}
                    whileInView={{ rotate: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
                  >
                    <Folder className="h-10 w-10 text-primary" />
                  </motion.div>
                  {/* External links for GitHub and live demo */}
                  <div className="flex gap-3">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                        aria-label="GitHub Repository"
                      >
                        <Github className="h-5 w-5" />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                        aria-label="Live Demo"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Project title with Data Science badge */}
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    <Link href={`/projects/${project.id}`}>
                      {project.title}
                    </Link>
                  </h4>
                  {/* Compact DS badge for Data Science projects */}
                  {project.category === "Data Science" && (
                    <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-chart-4/20 text-chart-4">
                      DS
                    </span>
                  )}
                </div>

                {/* Project description - clamped to 3 lines */}
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {project.description}
                </p>

                {/* Technologies list - limited to first 4 items */}
                <ul className="flex flex-wrap gap-2 text-xs font-mono text-muted-foreground mb-4">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <li key={tech}>{tech}</li>
                  ))}
                </ul>

                {/* Link to project details page */}
                <Link
                  href={`/projects/${project.id}`}
                  className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium"
                >
                  View Details <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* View More Button - links to GitHub profile */}
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Button asChild variant="outline" size="lg">
              <a
                href="https://github.com/damstech"
                target="_blank"
                rel="noopener noreferrer"
              >
                View More on GitHub
              </a>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
