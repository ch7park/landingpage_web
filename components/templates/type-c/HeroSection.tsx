"use client";

import Image from "next/image";
import type { LandingPageData } from "@/types/landing-page";

interface HeroSectionProps {
  data: LandingPageData["hero"];
}

export function HeroSection({ data }: HeroSectionProps) {
  return (
    <section className="relative h-[600px] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        {data.heroImageURL?.trim() ? (
          <Image
            src={data.heroImageURL}
            alt={data.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="h-full w-full bg-stone-800" />
        )}
        {/* Dark Gradient Overlay for Contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/60" />
      </div>

      {/* Content Container */}
      <div className="relative flex h-full flex-col px-6 py-8">
        
        {/* Main Title Area */}
        <div className="mt-16 flex flex-col items-center text-center">
          <span className="mb-4 inline-block border-b border-[#c5a572] pb-1 text-xs font-medium tracking-[0.2em] text-[#c5a572] uppercase font-sans">
            {data.highlightText || "PREMIUM LANDMARK"}
          </span>
          <h1 className="whitespace-pre-wrap font-sans text-3xl font-medium leading-tight text-white drop-shadow-sm sm:text-4xl">
            {data.title || "The Natural Nobility"}
          </h1>
          <div className="mt-6 h-10 w-[1px] bg-gradient-to-b from-white/50 to-transparent" />
        </div>

        {/* Bottom Scroll Indicator or Space */}
        <div className="mt-auto flex justify-center pb-4">
          <div className="flex flex-col items-center gap-2 opacity-60">
            <span className="text-[10px] tracking-widest text-white uppercase font-sans">Scroll</span>
            <div className="h-8 w-[1px] bg-white/50" />
          </div>
        </div>
      </div>
    </section>
  );
}
