"use client"

import { Github, Linkedin, Twitter, Instagram } from "lucide-react"
import { socialLinks, personalInfo } from "@/data/personal-info"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  instagram: Instagram,
}

export function SocialSidebar() {
  return (
    <>
      {/* Left sidebar - Social links */}
      <div className="hidden lg:flex fixed left-8 bottom-0 flex-col items-center gap-6 after:content-[''] after:w-px after:h-24 after:bg-muted-foreground/30">
        {socialLinks.map((link) => {
          const Icon = iconMap[link.icon]
          return (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary hover:-translate-y-1 transition-all"
              aria-label={link.name}
            >
              {Icon && <Icon className="h-5 w-5" />}
            </a>
          )
        })}
      </div>

      {/* Right sidebar - Email */}
      <div className="hidden lg:flex fixed right-8 bottom-0 flex-col items-center gap-6 after:content-[''] after:w-px after:h-24 after:bg-muted-foreground/30">
        <a
          href={`mailto:${personalInfo.email}`}
          className="text-muted-foreground hover:text-primary hover:-translate-y-1 transition-all text-xs tracking-widest"
          style={{ writingMode: "vertical-rl" }}
        >
          {personalInfo.email}
        </a>
      </div>
    </>
  )
}
