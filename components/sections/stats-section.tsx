"use client"

import { useEffect, useRef, useState } from "react"
import { stats } from "@/data/personal-info"
import { motion, useInView } from "framer-motion"

function AnimatedNumber({ value, delay }: { value: string; delay: number }) {
  const [displayValue, setDisplayValue] = useState("0")
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  
  useEffect(() => {
    if (!isInView) return
    
    const timeout = setTimeout(() => {
      const numericValue = parseInt(value.replace(/\D/g, ""))
      const suffix = value.replace(/[0-9]/g, "")
      const duration = 2000
      const steps = 60
      const stepDuration = duration / steps
      let current = 0
      
      const timer = setInterval(() => {
        current += numericValue / steps
        if (current >= numericValue) {
          setDisplayValue(numericValue + suffix)
          clearInterval(timer)
        } else {
          setDisplayValue(Math.floor(current) + suffix)
        }
      }, stepDuration)
      
      return () => clearInterval(timer)
    }, delay)
    
    return () => clearTimeout(timeout)
  }, [value, isInView, delay])
  
  return <span ref={ref}>{displayValue}</span>
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
}

export function StatsSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          {/* Section Heading */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              By the Numbers
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A snapshot of my journey and achievements in the world of software
              development.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="group relative"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="relative bg-card border border-border rounded-xl p-6 text-center overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
                  {/* Animated background gradient */}
                  <motion.div
                    className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-transparent"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Animated corner accent */}
                  <motion.div
                    className="absolute top-0 right-0 w-24 h-24 bg-primary/20 rounded-full blur-2xl"
                    initial={{ x: 20, y: -20, opacity: 0 }}
                    whileInView={{ x: 10, y: -10, opacity: 0.5 }}
                    whileHover={{ opacity: 1, scale: 1.2 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  />

                  <div className="relative z-10">
                    <motion.div
                      className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-2"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 15,
                        delay: index * 0.15,
                      }}
                    >
                      <AnimatedNumber value={stat.value} delay={index * 150} />
                    </motion.div>
                    <motion.p
                      className="text-sm md:text-base text-muted-foreground font-medium"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.15 + 0.3 }}
                    >
                      {stat.label}
                    </motion.p>
                  </div>

                  {/* Bottom accent line */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-primary to-transparent"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    whileHover={{ scaleX: 1.1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.15 + 0.4 }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
