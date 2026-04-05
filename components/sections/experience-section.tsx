"use client"

// import { experience } from "@/data/experience"
import { SectionHeading } from "@/components/ui/section-heading"
import { ExternalLink } from "lucide-react"
import { motion } from "framer-motion"
import { useFetch } from "@/hooks/useFetch"
import { ErrorState } from "../error-state"
import { Experience } from "@/lib/types"
import { Skeleton } from "../ui/skeleton"

export function ExperienceSection() {
  const {data: experience, loading, error, refetch} = useFetch<Experience[]>("/api/experience")

  if (loading) {
    // Handle loading state - show skeleton loaders while fetching data
    // <div className="flex flex-col items-center justify-center py-16 text-center">
    //   <Spinner />
    // </div>
    return (
      <section id="experience" className="py-24 md:py-32">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Heading */}
          <div className="mb-10 text-center lg:text-left">
            <Skeleton className="h-8 w-48 mx-auto lg:mx-0" />
          </div>

          {/* Experience list */}
          <div className="space-y-10">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-3">
                {/* Title + date */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <Skeleton className="h-5 w-40" /> {/* Job title */}
                  <Skeleton className="h-4 w-24" /> {/* Date */}
                </div>

                {/* Company */}
                <Skeleton className="h-4 w-56" />

                {/* Description lines */}
                <div className="space-y-2 pt-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[90%]" />
                  <Skeleton className="h-4 w-[80%]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  
  // Handle error state - show error message with retry option
    if (error) return <ErrorState message={error} onRetry={refetch} />;
  
    // Handle empty state - show message when no projects are returned
    if (!experience || experience.length === 0) {
      return <ErrorState message="No experience found." />;
    }
 
  return (
    <section id="experience" className="py-24 md:py-32">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-center lg:text-left"
          >
            <SectionHeading title="Experience" />
          </motion.div>

          <div className="max-w-3xl lg:max-w-full">
          {experience?.map((job, index) => (
            <motion.div
              key={index}
              className="relative pl-8 pb-12 last:pb-0 border-l border-border group"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              {/* Timeline dot */}
              <motion.div 
                className="absolute left-0 top-0 -translate-x-1/2 w-3 h-3 rounded-full bg-primary group-hover:scale-125 transition-transform"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.15 + 0.2 }}
              />

              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <h3 className="text-lg font-semibold text-foreground">
                    {job.title}{" "}
                    <span className="text-primary">
                      @{" "}
                      <a
                        href={job.companyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline inline-flex items-center gap-1"
                      >
                        {job.company}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </span>
                  </h3>
                  <span className="text-sm text-muted-foreground font-mono">
                    {job.date}
                  </span>
                </div>

                <p className="text-muted-foreground leading-relaxed">
                  {job.description}
                </p>

                <motion.div 
                  className="flex flex-wrap gap-2 pt-2"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 + 0.3 }}
                >
                  {job.technologies.map((tech, techIndex) => (
                    <motion.span
                      key={tech}
                      className="px-3 py-1 text-xs font-mono rounded-full bg-primary/10 text-primary"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.15 + 0.3 + techIndex * 0.05 }}
                    >
                      {tech}
                    </motion.span>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          ))}
          </div>
        </div>
      </div>
    </section>
  )
}
