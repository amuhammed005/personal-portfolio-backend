import type { Metadata } from "next"
import { Inter, Fira_Code } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
})

export const metadata: Metadata = {
  title: "Adam Muhammed | Full Stack Developer | Data Scientist",
  description:
    "Adam Muhammed is a full stack developer specializing in building exceptional digital experiences. Currently focused on building accessible, human-centered products.",
  keywords: [
    "developer",
    "portfolio",
    "full stack",
    "frontend",
    "react",
    "next.js",
    "typescript",
    "machine learning",
    "data science",
    "python",
    "software development",
    "data-driven",
    "web development",
    "programming",
    "data science",
    "deep learning",
    "ui/ux design",
    "tech enthusiast",
    "tech blogger",
    "open source contributor",
    "software engineer",
    "data analyst",
    "machine learning engineer",
    "ai developer",
    "software architect",
    "technology consultant",
    "full stack developer",
    "frontend developer",
    "backend developer",
    "react developer",
    "next.js developer",
    "typescript developer",
    "python developer",
    "data scientist",
    "machine learning engineer",
    "deep learning specialist",
    "ui/ux designer",
  ],
  authors: [{ name: "Adam Muhammed" }],
  creator: "Adam Muhammed",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://personal-portfolio-backend.versel.app",
    title: "Adam Muhammed | Full Stack Developer",
    description:
      "Adam Muhammed is a full stack developer specializing in building exceptional digital experiences.",
    siteName: "Adam Muhammed Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Adam Muhammed | Full Stack Developer",
    description:
      "Adam Muhammed is a full stack developer specializing in building exceptional digital experiences.",
    creator: "@adammuhammed",
  },
  icons: {
    icon: [
      {
        url: "/briefcase-portfolio-light.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/briefcase-portfolio-dark.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/briefcase-portfolio.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-part-2.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${firaCode.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
