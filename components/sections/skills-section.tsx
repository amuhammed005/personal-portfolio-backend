"use client"

import { useState } from "react"
import { webDevSkills, mlSkills } from "@/data/skills"
import { SectionHeading } from "@/components/ui/section-heading"
import { SkillCard } from "@/components/cards/skill-card"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

type FilterType = "All" | "Web" | "ML"

export function SkillsSection() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("All")

  // Duplicate skills arrays for infinite scroll effect
  const duplicatedWebDevSkills = [...webDevSkills, ...webDevSkills]
  const duplicatedMlSkills = [...mlSkills, ...mlSkills]

  const filters: { value: FilterType; label: string }[] = [
    { value: "All", label: "All Tech" },
    { value: "Web", label: "Web Development" },
    { value: "ML", label: "Machine Learning" },
  ]

  const showWebDev = activeFilter === "All" || activeFilter === "Web"
  const showML = activeFilter === "All" || activeFilter === "ML"

  return (
    <section id="tech-arsenal" className="py-24 md:py-32 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-center lg:text-left mb-6"
          >
            <SectionHeading title="Tech Arsenal" />
          </motion.div>
          
          <motion.p 
            className="text-muted-foreground max-w-2xl mb-8 text-center lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Here are the technologies and tools I work with on a daily basis.
            I&apos;m always learning and exploring new technologies to stay up-to-date
            with the ever-evolving tech landscape.
          </motion.p>

          {/* Filter Buttons */}
          <motion.div
            className="flex flex-wrap justify-center lg:justify-start gap-3 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                  activeFilter === filter.value
                    ? filter.value === "ML" 
                      ? "bg-chart-4 text-primary-foreground"
                      : "bg-primary text-primary-foreground"
                    : "bg-card border border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
                )}
              >
                {filter.label}
                {filter.value === "ML" && (
                  <span className="ml-2 px-1.5 py-0.5 text-xs rounded bg-background/20">
                    AI
                  </span>
                )}
              </button>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Web Development Section */}
      {showWebDev && (
        <>
          <div className="container mx-auto px-6 mb-4">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 justify-center lg:justify-start">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Web Development
              </h3>
            </div>
          </div>

          {/* Web Dev Scrolling container */}
          <div className="relative">
            {/* Gradient overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-background to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-background to-transparent z-10 pointer-events-none" />

            {/* Scrolling track */}
            <div className="animate-scroll flex gap-6 w-max py-4">
              {duplicatedWebDevSkills.map((skill, index) => (
                <SkillCard
                  key={`webdev-${skill.name}-${index}`}
                  skill={skill}
                  isCenter={index === Math.floor(webDevSkills.length / 2)}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Machine Learning Section */}
      {showML && (
        <>
          <div className="container mx-auto px-6 mt-12 mb-4">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 justify-center lg:justify-start">
                <span className="w-2 h-2 rounded-full bg-chart-4" />
                Machine Learning & Data Science
              </h3>
            </div>
          </div>

          {/* ML Scrolling in opposite direction */}
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-background to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-background to-transparent z-10 pointer-events-none" />

            <div
              className="animate-scroll flex gap-6 w-max py-4"
              style={{ animationDirection: "reverse", animationDuration: "35s" }}
            >
              {duplicatedMlSkills.map((skill, index) => (
                <SkillCard
                  key={`ml-${skill.name}-${index}`}
                  skill={skill}
                  isCenter={index === Math.floor(mlSkills.length / 2)}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  )
}
