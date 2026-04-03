import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { SocialSidebar } from "@/components/layout/social-sidebar"
import { WhatsAppFloat } from "@/components/layout/whatsapp-float"
import { HeroSection } from "@/components/sections/hero-section"
import { AboutSection } from "@/components/sections/about-section"
import { StatsSection } from "@/components/sections/stats-section"
import { SkillProgressSection } from "@/components/sections/skill-progress-section"
import { SkillsSection } from "@/components/sections/skills-section"
import { ExperienceSection } from "@/components/sections/experience-section"
import { ProjectsSection } from "@/components/sections/projects-section"
import { ContactSection } from "@/components/sections/contact-section"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <SocialSidebar />
      <WhatsAppFloat />
      <main className="max-w-6xl mx-auto">
        <HeroSection />
        <AboutSection />
        <StatsSection />
        <SkillProgressSection />
        <ExperienceSection />
        <SkillsSection />
        <ProjectsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
