"use client";

import Image from "next/image";
import { personalInfo as fallbackPersonalInfo } from "@/data/personal-info";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { Download, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";
import { useFetch } from "@/hooks/useFetch";
import { PersonalInfo } from "@/lib/types";
import { Skeleton } from "../ui/skeleton";
import { ErrorState } from "../error-state";
import { useEffect, useRef, useState } from "react";
import { ShowMoreButton } from "../ui/show-more-button";

export function AboutSection() {
  const {
    data: personalInfo,
    loading,
    error,
    refetch,
  } = useFetch<PersonalInfo>("/api/about", fallbackPersonalInfo);
  const [expanded, setExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);
  const bioRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = bioRef.current;
    if (!element) return;

    const checkOverflow = () =>
      setCanExpand(element.scrollHeight > element.clientHeight + 1);

    checkOverflow();
    const observer = new ResizeObserver(checkOverflow);
    observer.observe(element);
    return () => observer.disconnect();
  }, [personalInfo?.bio]);

  if (loading) {
    return (
      <section id="about" className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="mb-10 text-center lg:text-left">
              <Skeleton className="h-8 w-40 mx-auto lg:mx-0" />
            </div>
            <div className="grid md:grid-cols-5 gap-12 items-start">
              <div className="md:col-span-3 space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
                <div className="flex gap-4 pt-6">
                  <Skeleton className="h-10 w-40 rounded-md" />
                  <Skeleton className="h-10 w-36 rounded-md" />
                </div>
              </div>
              <div className="md:col-span-2 flex justify-center md:justify-end">
                <Skeleton className="w-64 h-64 md:w-72 md:h-72 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={refetch} />;
  }

  if (!personalInfo) {
    return <ErrorState message="No personal information found." />;
  }

  const bioLines = personalInfo?.bio?.split("\n\n");

  const scrollToSkills = () => {
    const skillsSection = document.getElementById("skills");
    if (skillsSection) {
      skillsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="about" className="py-24 md:py-32">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-center lg:text-left"
          >
            <SectionHeading title="About Me" />
          </motion.div>

          <div className="grid md:grid-cols-5 gap-12 items-start">
            <motion.div
              className="md:col-span-3 space-y-4"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* single relative wrapper around ALL paragraphs — this is what
                  gets clamped/faded, instead of clamping each <p> separately */}
              <div className="relative">
                <div
                  ref={bioRef}
                  id="about-bio"
                  className={`space-y-2 overflow-hidden transition-all duration-300 ${
                    expanded ? "max-h-250" : "max-h-74"
                  }`}
                >
                  {bioLines.map((paragraph, index) => (
                    <motion.p
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                      className="text-muted-foreground leading-relaxed"
                    >
                      {paragraph}
                    </motion.p>
                  ))}
                </div>

                {/* fade sits on top of the clamped wrapper, not inside a <p> */}
                {!expanded && (
                  <div className="absolute bottom-0 left-0 w-full h-16 bg-linear-to-t from-background to-transparent" />
                )}
              </div>

              {(canExpand || expanded) && (
                <div className="flex justify-center">
                  <ShowMoreButton
                    className="mt-1"
                    expanded={expanded}
                    onClick={() => setExpanded((current) => !current)}
                    aria-controls="about-bio"
                    moreLabel="Read more about me"
                    lessLabel="Show less"
                  />
                </div>
              )}

              <motion.div
                className="flex flex-wrap gap-4 pt-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Button asChild size="lg" className="gap-2">
                  <a href={personalInfo.resumeUrl} download>
                    <Download className="h-4 w-4" />
                    Download Resume
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2"
                  onClick={scrollToSkills}
                >
                  <ArrowDown className="h-4 w-4" />
                  Learn More
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              className="md:col-span-2 flex justify-center md:justify-end"
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="relative group">
                <div className="relative w-64 h-64 md:w-72 md:h-72 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors duration-300 z-10" />
                  <Image
                    src="/images/avatar.jpg"
                    alt={personalInfo.name}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                </div>
                <div className="absolute -inset-2 border-2 border-primary rounded-lg -z-10 translate-x-4 translate-y-4 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-300" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
