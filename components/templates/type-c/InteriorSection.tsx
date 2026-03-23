"use client";

import Image from "next/image";
import type { LandingPageData } from "@/types/landing-page";

interface InteriorSectionProps {
  data: LandingPageData["interior"];
}

export function InteriorSection({ data }: InteriorSectionProps) {
  return (
    <section className="bg-stone-50 px-6 py-12">
      <div className="mb-10 text-center">
        <span className="mb-2 block text-sm font-bold tracking-widest text-[#c5a572] uppercase font-sans">
          {data.pointLabel || "INTERIOR"}
        </span>
        <h2 className="font-sans text-4xl font-bold text-[#1a1a1a] sm:text-5xl">
          {data.sectionTitle}
        </h2>
        <div className="mx-auto mt-6 h-[2px] w-12 bg-[#c5a572]" />
        <p className="mt-6 text-base font-medium text-stone-600 font-sans">{data.subtitle}</p>
      </div>

      <div className="space-y-8">
        {data.rooms.map((room, index) => (
          <div key={index} className="group overflow-hidden bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-200">
              {room.imageURL?.trim() ? (
                <Image
                  src={room.imageURL}
                  alt={room.label}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="100vw"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-stone-400">
                  이미지
                </div>
              )}
            </div>
            <div className="flex items-center justify-between p-6">
              <span className="font-sans text-xl font-bold text-[#1a1a1a]">
                {room.label}
              </span>
              <div className="h-[2px] w-12 bg-[#c5a572] transition-all duration-300 group-hover:w-20" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
