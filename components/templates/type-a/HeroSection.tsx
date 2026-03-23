"use client";

import Image from "next/image";
import type { LandingPageData } from "@/types/landing-page";

interface HeroSectionProps {
  data: LandingPageData["hero"];
}

export function HeroSection({ data }: HeroSectionProps) {
  return (
    <section className="relative min-h-[420px] w-full overflow-hidden">
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
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
      </div>
      <div className="relative flex min-h-[420px] flex-col justify-start px-4 pt-8 pb-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="whitespace-pre-wrap text-2xl font-bold leading-tight text-white drop-shadow-md sm:text-3xl md:text-4xl">
            {data.title}
          </h1>
          {data.highlightText?.trim() && (
            <span className="block w-full rounded-lg bg-[#6a5acd] px-4 py-2 text-center text-sm font-medium text-white sm:text-base">
              {data.highlightText}
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
