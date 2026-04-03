"use client"

import { useEffect, useRef, useState } from "react"
import { SectionHeading } from "@/components/ui/section-heading"
import { skillLevels } from "@/data/personal-info"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

type FilterType = "All" | "Web" | "ML"

// Categorize skills
const webSkills = ["JavaScript", "React", "TypeScript", "HTML/CSS", "Node.js"]
const mlSkills = ["Python", "Machine Learning", "Data Analysis"]

function SkillBar({ name, level, delay }: { name: string; level: number; delay: number }) {
  const [isVisible, setIsVisible] = useState(false)
  const [animatedLevel, setAnimatedLevel] = useState(0)
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (barRef.current) {
      observer.observe(barRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        const duration = 1500
        const steps = 60
        const stepDuration = duration / steps
        let current = 0
        
        const countTimer = setInterval(() => {
          current += level / steps
          if (current >= level) {
            setAnimatedLevel(level)
            clearInterval(countTimer)
          } else {
            setAnimatedLevel(Math.floor(current))
          }
        }, stepDuration)
        
        return () => clearInterval(countTimer)
      }, delay)
      return () => clearTimeout(timer)
    }
  }, [isVisible, level, delay])

  // Determine if this is a web or ML skill
  const isMLSkill = mlSkills.includes(name)

  return (
    <motion.div 
      ref={barRef} 
      className="space-y-3"
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: delay / 1000 }}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-foreground font-medium">{name}</span>
          {isMLSkill && (
            <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-chart-4/20 text-chart-4">
              ML
            </span>
          )}
        </div>
        <span className="text-primary font-mono text-sm">{animatedLevel}%</span>
      </div>
      <div className="h-4 lg:h-5 bg-muted rounded-full overflow-hidden">
        <motion.div
          className={cn(
            "h-full rounded-full",
            isMLSkill 
              ? "bg-gradient-to-r from-chart-4 to-chart-4/70" 
              : "bg-gradient-to-r from-primary to-primary/70"
          )}
          initial={{ width: 0 }}
          animate={{ width: isVisible ? `${level}%` : 0 }}
          transition={{ duration: 1.5, delay: delay / 1000, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  )
}

export function SkillProgressSection() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("All")

  const filteredSkills = skillLevels.filter((skill) => {
    if (activeFilter === "All") return true
    if (activeFilter === "Web") return webSkills.includes(skill.name)
    if (activeFilter === "ML") return mlSkills.includes(skill.name)
    return true
  })

  const filters: { value: FilterType; label: string }[] = [
    { value: "All", label: "All Skills" },
    { value: "Web", label: "Web Development" },
    { value: "ML", label: "Machine Learning" },
  ]

  return (
    <section id="skills" className="py-24 md:py-32">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-center lg:text-left"
          >
            <SectionHeading title="Skills & Expertise" />
          </motion.div>

          <motion.p 
            className="text-muted-foreground mb-8 leading-relaxed text-center lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Here are the technologies I work with on a daily basis. My proficiency 
            levels reflect years of hands-on experience building real-world applications.
          </motion.p>

          {/* Filter Buttons */}
          <motion.div
            className="flex flex-wrap justify-center lg:justify-start gap-3 mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
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

          <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
            {filteredSkills.map((skill, index) => (
              <SkillBar
                key={skill.name}
                name={skill.name}
                level={skill.level}
                delay={index * 150}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
