import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 pt-32 pb-20">
        <Link
          href="/"
          className="flex items-center gap-2 text-primary hover:text-primary/80 mb-8 font-medium"
        >
          <ArrowLeft size={20} /> Back to Home
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
          Privacy Policy
        </h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-muted-foreground text-lg mb-8">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Introduction</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Welcome to DamsTech. I respect your privacy and am committed to protecting your personal data. 
              This privacy policy will inform you about how I look after your personal data when you visit 
              my website and tell you about your privacy rights.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Information I Collect</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              When you use my contact form, I may collect the following information:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              <li>Your name</li>
              <li>Your email address</li>
              <li>Any other information you choose to provide in your message</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">How I Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              I use the information you provide solely to respond to your inquiries and communicate 
              with you about potential projects or opportunities. I do not sell, trade, or otherwise 
              transfer your information to third parties.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Cookies</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              This website uses minimal cookies necessary for functionality, such as remembering 
              your theme preference. No tracking or advertising cookies are used.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about this privacy policy, please contact me at{" "}
              <a href="mailto:hello@damstech.dev" className="text-primary hover:underline">
                hello@damstech.dev
              </a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
