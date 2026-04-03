"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { personalInfo } from "@/data/personal-info"
import { ArrowDown } from "lucide-react"

const roles = [
  "Full Stack Developer",
  "Data Scientist",
  "ML Engineer",
  "Frontend Engineer",
  "UI/UX Enthusiast",
]

export function HeroSection() {
  const [currentRole, setCurrentRole] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const role = roles[currentRole]
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (displayText.length < role.length) {
            setDisplayText(role.slice(0, displayText.length + 1))
          } else {
            setTimeout(() => setIsDeleting(true), 2000)
          }
        } else {
          if (displayText.length > 0) {
            setDisplayText(displayText.slice(0, -1))
          } else {
            setIsDeleting(false)
            setCurrentRole((prev) => (prev + 1) % roles.length)
          }
        }
      },
      isDeleting ? 50 : 100
    )

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, currentRole])

  return (
    <section className="min-h-screen flex items-center justify-center relative pt-20 overflow-hidden">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.03)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.03)_1px,transparent_1px)] bg-size-[60px_60px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.06)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.06)_1px,transparent_1px)] bg-size-[120px_120px]" />
        
        {/* Animated horizontal lines */}
        <div className="absolute top-1/4 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent animate-pulse" />
        <div className="absolute top-2/4 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/15 to-transparent animate-pulse [animation-delay:0.5s]" />
        <div className="absolute top-3/4 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/10 to-transparent animate-pulse [animation-delay:1s]" />
        
        {/* Animated vertical lines */}
        <div className="absolute left-1/4 top-0 bottom-0 w-px bg-linear-to-b from-transparent via-primary/20 to-transparent animate-pulse [animation-delay:0.3s]" />
        <div className="absolute left-2/4 top-0 bottom-0 w-px bg-linear-to-b from-transparent via-primary/15 to-transparent animate-pulse [animation-delay:0.8s]" />
        <div className="absolute left-3/4 top-0 bottom-0 w-px bg-linear-to-b from-transparent via-primary/10 to-transparent animate-pulse [animation-delay:1.3s]" />

        {/* Glowing corner accents */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl">
          <p className="text-primary font-mono text-sm md:text-base mb-4 animate-fade-in">
            Hi, my name is
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4 text-balance">
            {personalInfo.name}.
          </h1>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-muted-foreground mb-6">
            <span>{displayText}</span>
            <span className="animate-blink text-primary">|</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mb-8 leading-relaxed">
            {personalInfo.tagline} Currently, I&apos;m focused on building accessible,
            human-centered products and applying machine learning to solve real-world problems.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg">
              <a href="#projects">View My Work</a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#contact">Get In Touch</a>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce z-10">
        <a
          href="#about"
          className="text-muted-foreground hover:text-primary transition-colors"
          aria-label="Scroll to about section"
        >
          <ArrowDown className="h-10 w-8" />
        </a>
      </div>
    </section>
  )
}
