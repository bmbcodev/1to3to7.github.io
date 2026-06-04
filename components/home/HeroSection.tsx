"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Linkedin, Instagram, Twitter, Globe } from "lucide-react";
import { FollowButton } from "@/components/ui/FollowButton";
import { cn } from "@/lib/utils";
import type { SocialLink } from "@/types";

interface HeroSectionProps {
  logoUrl?: string;
  profileImageUrl?: string;
  socialLinks?: SocialLink[];
}

const iconMap: Record<string, React.ReactNode> = {
  linkedin: <Linkedin className="w-5 h-5" />,
  instagram: <Instagram className="w-5 h-5" />,
  twitter: <Twitter className="w-5 h-5" />,
  globe: <Globe className="w-5 h-5" />,
};

const stagger = {
  animate: {
    transition: { staggerChildren: 0.1, delayChildren: 0.3 },
  },
};

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export function HeroSection({ logoUrl, profileImageUrl, socialLinks }: HeroSectionProps) {
  return (
    <motion.section
      variants={stagger}
      initial="initial"
      animate="animate"
      className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-20"
    >
      {logoUrl && (
        <motion.div variants={fadeUp} className="mb-4">
          <Image
            src={logoUrl}
            alt="BIA CO Logo"
            width={80}
            height={80}
            className="object-contain opacity-80"
          />
        </motion.div>
      )}

      <motion.div
        variants={fadeUp}
        className="relative mb-8"
      >
        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-2 border-gold/50 p-1 animate-pulse-glow">
          <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-gold/20 to-purple/20">
            {profileImageUrl ? (
              <Image
                src={profileImageUrl}
                alt="BIZIMANA FILS"
                width={160}
                height={160}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl font-heading text-gold">
                BF
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <motion.h1
        variants={fadeUp}
        className="text-4xl sm:text-5xl md:text-7xl font-heading font-bold bg-gradient-to-r from-gold via-yellow-300 to-gold bg-clip-text text-transparent mb-4 text-center"
      >
        BIZIMANA FILS
      </motion.h1>

      <motion.div variants={fadeUp} className="mb-4 h-10 overflow-hidden">
        <p className="text-xl sm:text-2xl md:text-3xl font-heading text-gold/80 font-light italic relative">
          <span className="inline-block overflow-hidden whitespace-nowrap border-r-2 border-gold animate-typewriter">
            Bwangu Nk&rsquo;Intore
          </span>
        </p>
      </motion.div>

      <motion.p
        variants={fadeUp}
        className="text-sm sm:text-base text-gray-300 font-body text-center max-w-2xl mb-8"
      >
        Electric Vehicle Technician &middot; AI Engineer &middot; Web Developer &middot; Kigali, Rwanda
      </motion.p>

      <motion.div variants={fadeUp} className="mb-8">
        <FollowButton large />
      </motion.div>

      {socialLinks && socialLinks.length > 0 && (
        <motion.div variants={fadeUp} className="flex items-center gap-4">
          {socialLinks
            .filter((l) => l.is_active)
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gold transition-colors duration-300 hover:scale-110"
                title={link.platform}
              >
                {link.icon && iconMap[link.icon.toLowerCase()] ? (
                  iconMap[link.icon.toLowerCase()]
                ) : (
                  <Globe className="w-5 h-5" />
                )}
              </a>
            ))}
        </motion.div>
      )}
    </motion.section>
  );
}
