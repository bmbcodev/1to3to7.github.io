"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { rwandaImages as defaultImages } from "@/lib/rwandaImages";

interface RwandaBackgroundProps {
  images?: string[];
}

export function RwandaBackground({ images }: RwandaBackgroundProps) {
  const bgImages = images && images.length > 0 ? images : defaultImages;
  const [currentIndex, setCurrentIndex] = useState(0);
  const showDots = bgImages.length <= 20;

  useEffect(() => {
    if (bgImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bgImages.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [bgImages.length]);

  return (
    <div className="fixed inset-0 z-0">
      {bgImages.map((src, idx) => (
        <div
          key={idx}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: idx === currentIndex ? 1 : 0 }}
        >
          <Image
            src={src}
            alt={`Rwanda landscape ${idx + 1}`}
            fill
            className="object-cover"
            priority={idx === 0}
            sizes="100vw"
            unoptimized
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3">
        {showDots ? (
          bgImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`transition-all duration-300 rounded-full ${
                idx === currentIndex
                  ? "bg-gradient-to-r from-amber-400 to-amber-600 w-8 h-2"
                  : "bg-white/30 hover:bg-white/50 w-2 h-2"
              }`}
            />
          ))
        ) : (
          <span className="text-white/60 text-sm font-mono tracking-wider">
            {String(currentIndex + 1).padStart(2, "0")} / {String(bgImages.length).padStart(2, "0")}
          </span>
        )}
      </div>
    </div>
  );
}
