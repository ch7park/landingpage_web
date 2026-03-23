"use client";

import Image from "next/image";
import type { LandingPageData } from "@/types/landing-page";

interface HeroSectionProps {
  data: LandingPageData["hero"];
}

export function HeroSection({ data }: HeroSectionProps) {
  return (
    <section className="relative min-h-[520px] w-full overflow-hidden bg-[#1c2b47]">
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
          <div className="h-full w-full bg-gray-700" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />
      </div>
      <div className="relative flex min-h-[520px] flex-col items-center justify-start px-4 pt-8 text-center">
        <h1 className="whitespace-pre-wrap text-3xl font-bold leading-tight text-white drop-shadow-lg sm:text-4xl">
          {data.title}
        </h1>
        <span className="mt-3 rounded-md bg-[#6a5acd] px-5 py-2.5 text-sm font-bold text-white">
          {data.highlightText}
        </span>
      </div>
    </section>
  );
}
