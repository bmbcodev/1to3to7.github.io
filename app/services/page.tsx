"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useVisitorTracker } from "@/hooks/useVisitorTracker";
import { GlassCard } from "@/components/ui/GlassCard";
import { GoldButton } from "@/components/ui/GoldButton";
import { PageTransition } from "@/components/ui/PageTransition";
import { Zap, Brain, Code, Cog, Search } from "lucide-react";

const services = [
  {
    icon: Zap,
    title: "Electric Vehicle Diagnostics & Repair",
    description:
      "Expert diagnostics and repair services for electric vehicles. From battery health analysis to motor control systems, I provide comprehensive EV maintenance solutions in Kigali.",
  },
  {
    icon: Brain,
    title: "AI Prompt Engineering & Automation",
    description:
      "Design and implement AI-powered automation solutions. Specializing in prompt engineering, workflow automation, and intelligent system integration for businesses.",
  },
  {
    icon: Code,
    title: "Web Development & UI Design",
    description:
      "Full-stack web development with modern frameworks. Creating responsive, performant, and visually stunning web applications tailored to your needs.",
  },
  {
    icon: Cog,
    title: "Automotive Technology Consulting",
    description:
      "Technical consulting for automotive technology projects. Vehicle diagnostics systems, telematics, and modern automotive tech integration.",
  },
  {
    icon: Search,
    title: "Technology Research & Innovation",
    description:
      "Deep-dive research into emerging technologies. Market analysis, feasibility studies, and innovation strategy for tech-driven initiatives.",
  },
];

export default function ServicesPage() {
  useVisitorTracker();

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-heading font-bold bg-gradient-to-r from-gold to-yellow-300 bg-clip-text text-transparent mb-4">
              Services
            </h1>
            <p className="text-gray-400 font-body max-w-2xl mx-auto">
              Leveraging expertise in electric vehicles, artificial intelligence, and web development
              to deliver innovative solutions for modern challenges.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, idx) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <GlassCard className="p-6 h-full flex flex-col">
                    <div className="w-14 h-14 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-4">
                      <Icon className="w-7 h-7 text-gold" />
                    </div>
                    <h3 className="text-lg font-heading font-semibold text-white mb-3">{service.title}</h3>
                    <p className="text-sm text-gray-400 font-body flex-1 leading-relaxed">{service.description}</p>
                    <Link href="/contact" className="mt-4">
                      <span className="text-gold text-sm font-body hover:text-yellow-300 transition-colors inline-flex items-center gap-1">
                        Get in Touch &rarr;
                      </span>
                    </Link>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
