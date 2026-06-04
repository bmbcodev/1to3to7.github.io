"use client";

import { usePathname } from "next/navigation";
import { Github, Linkedin, Instagram, Twitter } from "lucide-react";

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/login")) return null;

  return (
    <footer className="relative z-10 border-t border-gold/10 bg-bg/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-heading font-bold bg-gradient-to-r from-gold to-yellow-300 bg-clip-text text-transparent mb-3">
              BIA CO
            </h3>
            <p className="text-gray-400 text-sm font-body">
              Bizimana Idea Agency Company
            </p>
            <p className="text-gold/60 text-sm font-body italic mt-1">
              &ldquo;Bwangu Nk&rsquo;Intore&rdquo;
            </p>
          </div>

          <div>
            <h4 className="text-white font-heading font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm font-body text-gray-400">
              <li><a href="/" className="hover:text-gold transition-colors">Home</a></li>
              <li><a href="/about" className="hover:text-gold transition-colors">About</a></li>
              <li><a href="/projects" className="hover:text-gold transition-colors">Projects</a></li>
              <li><a href="/contact" className="hover:text-gold transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-heading font-semibold mb-3">Contact</h4>
            <ul className="space-y-2 text-sm font-body text-gray-400">
              <li>Kigali, Rwanda</li>
              <li>+250 783 444 370</li>
              <li>bmbcodev@gmail.com</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gold/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 font-body">
            &copy; {new Date().getFullYear()} BIA CO. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="https://www.linkedin.com/in/bizimana-fils-fils-8b94883b9" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gold transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="https://www.instagram.com/1to3to7" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gold transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="https://x.com/1to3to7" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gold transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
