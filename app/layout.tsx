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
  title: "Adam Muhammed Chen | Full Stack Developer",
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
  ],
  authors: [{ name: "Adam Muhammed" }],
  creator: "Adam Muhammed",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://alexchen.dev",
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
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

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
