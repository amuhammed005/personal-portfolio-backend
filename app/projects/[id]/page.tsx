"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { ExternalLink, Github, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { allProjects } from "@/data/projects"
import { formatDate } from "@/lib/format-date";
import { motion } from "framer-motion";
import { useFetch } from "@/hooks/useFetch";
import { Skeleton } from "@/components/ui/skeleton";
import { Project } from "@/lib/types";
import { ErrorState } from "@/components/error-state";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectDetailPage({ params }: ProjectPageProps) {
  const { id } = use(params);
  const router = useRouter();

  const {
    data: projects,
    error,
    loading,
    refetch,
  } = useFetch<Project[]>("/api/projects");

  const project = projects?.find((p) => p.id === id);

  // Handle loading state - show spinner while fetching data
  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Back button */}
          <Skeleton className="h-5 w-40 mb-8" />

          {/* Title */}
          <Skeleton className="h-10 w-3/4 mb-4" />

          {/* Subtitle */}
          <Skeleton className="h-5 w-1/2 mb-10" />

          {/* Image */}
          <Skeleton className="w-full h-72 md:h-96 rounded-lg mb-12" />

          {/* Content + Sidebar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-4">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />

              <Skeleton className="h-6 w-48 mt-8" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-20 rounded-md" />
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />

              <Skeleton className="h-10 w-full mt-6" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={refetch} />;
  }

  if (!loading && !project) {
    notFound();
  }

  // Get related projects from the same category first, then others
  const relatedProjects = projects
    ?.filter((p) => p.id !== project?.id)
    .sort((a, b) => (a.category === project?.category ? -1 : 1))
    .slice(0, 2);

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Back Button */}
        <motion.button
          onClick={() => router.push("/#projects")}
          className="flex items-center gap-2 text-primary hover:text-primary/80 mb-8 font-medium"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <ArrowLeft size={20} /> Back to Projects
        </motion.button>

        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <p className="text-muted-foreground text-sm">
              {project?.date ? formatDate(project.date) : ""}
            </p>
            {project?.category === "Data Science" && (
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-chart-4/20 text-chart-4 border border-chart-4/30">
                Data Science
              </span>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {project?.title}
          </h1>
          <p className="text-xl text-muted-foreground">
            {project?.description}
          </p>
        </motion.div>

        {/* Image */}
        {project?.images && project?.images[0] && (
          <motion.div
            className="mb-12 rounded-lg overflow-hidden bg-secondary h-72 md:h-96 relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Image
              src={project.images[0]}
              alt={project.title}
              fill
              className="object-cover"
            />
          </motion.div>
        )}

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Main Content */}
          <motion.div
            className="md:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="prose prose-invert max-w-none">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Project Overview
              </h2>
              <p className="text-base md:text-lg text-foreground/80 leading-relaxed mb-6">
                {project?.fullDescription || project?.description}
              </p>

              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4 mt-12">
                Technologies Used
              </h3>
              <div className="flex flex-wrap gap-2 mb-8">
                {project?.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-4 py-2 bg-secondary text-foreground rounded-lg font-medium text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            className="md:col-span-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
              <h3 className="font-bold text-foreground mb-6">
                Project Details
              </h3>

              <div className="space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Category</p>
                  <p className="text-foreground font-medium">
                    {project?.category}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Date</p>
                  <p className="text-foreground font-medium">
                    {project?.date ? formatDate(project.date) : "N/A"}
                  </p>
                </div>

                <div className="flex flex-col gap-3 pt-6 border-t border-border">
                  {project?.liveUrl && (
                    <Button asChild className="w-full">
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                      >
                        <ExternalLink size={18} /> View Live
                      </a>
                    </Button>
                  )}
                  {project?.githubUrl && (
                    <Button asChild variant="outline" className="w-full">
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                      >
                        <Github size={18} /> View Code
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Projects */}
        <motion.div
          className="border-t border-border pt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h3 className="text-2xl font-bold text-foreground mb-8">
            More Projects
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedProjects?.map((relatedProject) => (
              <Link
                key={relatedProject.id}
                href={`/projects/${relatedProject.id}`}
                className="group"
              >
                <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg hover:border-primary/50 transition-all duration-300">
                  {relatedProject.images && relatedProject.images[0] && (
                    <div className="h-32 bg-border overflow-hidden relative">
                      <Image
                        src={relatedProject.images[0]}
                        alt={relatedProject.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {relatedProject.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {relatedProject.category}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
