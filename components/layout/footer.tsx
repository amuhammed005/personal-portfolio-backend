import Link from "next/link"
import { Github, Linkedin, Twitter, Instagram } from "lucide-react"
import { socialLinks, personalInfo } from "@/data/personal-info"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  instagram: Instagram,
}

const navigationLinks = [
  { name: "Home", href: "#" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
]

const resourceLinks = [
  { name: "Resume", href: personalInfo.resumeUrl },
  { name: "Privacy Policy", href: "/privacy" },
]

export function Footer() {
  return (
    <footer className="py-16 border-t border-border bg-card/50">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <Link
              href="/"
              className="text-2xl font-bold text-foreground hover:text-primary transition-colors inline-block mb-4"
            >
              DamsTech<span className="text-primary">.</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Crafting beautiful digital experiences with code and creativity.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Navigation</h4>
            <ul className="space-y-3">
              {navigationLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    target={link.href.startsWith("http") || link.href.endsWith(".pdf") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") || link.href.endsWith(".pdf") ? "noopener noreferrer" : undefined}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Connect</h4>
            <div className="flex items-center gap-4">
              {socialLinks.map((link) => {
                const Icon = iconMap[link.icon]
                return (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-primary/10"
                    aria-label={link.name}
                  >
                    {Icon && <Icon className="h-5 w-5" />}
                  </a>
                )
              })}
            </div>
            <p className="text-muted-foreground text-sm mt-4">
              {personalInfo.email}
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Designed & Built by DamsTech
          </p>
          <p className="text-xs text-muted-foreground/60">
            {new Date().getFullYear()} DamsTech. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
