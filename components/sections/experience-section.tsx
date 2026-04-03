"use client"

import { experience } from "@/data/experience"
import { SectionHeading } from "@/components/ui/section-heading"
import { ExternalLink } from "lucide-react"
import { motion } from "framer-motion"

export function ExperienceSection() {
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
          {experience.map((job, index) => (
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
