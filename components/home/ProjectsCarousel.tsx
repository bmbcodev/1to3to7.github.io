"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import Image from "next/image";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import type { Project } from "@/types";

interface ProjectsCarouselProps {
  projects: Project[];
}

export function ProjectsCarousel({ projects }: ProjectsCarouselProps) {
  if (projects.length === 0) return null;

  return (
    <section className="relative z-10 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-heading font-bold text-center mb-12">
          <span className="bg-gradient-to-r from-gold to-yellow-300 bg-clip-text text-transparent">
            Featured Work
          </span>
        </h2>

        <Swiper
          modules={[Autoplay, EffectFade]}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1, spaceBetween: 20 },
            768: { slidesPerView: 2, spaceBetween: 24 },
            1024: { slidesPerView: 3, spaceBetween: 30 },
          }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop={projects.length > 1}
          className="!pb-12"
        >
          {projects.slice(0, 10).map((project) => (
            <SwiperSlide key={project.id}>
              <GlassCard className="overflow-hidden h-full">
                {project.cover_image && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={project.cover_image}
                      alt={project.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                )}
                <div className="p-5">
                  {project.category && (
                    <span className="text-xs font-body text-gold bg-gold/10 px-2 py-1 rounded-full">
                      {project.category}
                    </span>
                  )}
                  <h3 className="text-lg font-heading font-semibold text-white mt-2 mb-2">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-400 font-body line-clamp-2 mb-4">
                    {project.description}
                  </p>
                  <Link
                    href={`/projects/${project.id}`}
                    className="text-gold text-sm font-body hover:text-yellow-300 transition-colors inline-flex items-center gap-1"
                  >
                    View Project &rarr;
                  </Link>
                </div>
              </GlassCard>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
