"use client";

import Image from "next/image";
import type { LandingPageData } from "@/types/landing-page";

interface FacilitiesSectionProps {
  data: LandingPageData["facilities"];
}

export function FacilitiesSection({ data }: FacilitiesSectionProps) {
  return (
    <section className="bg-white px-6 py-12">
      <div className="mb-10 text-center">
        <span className="mb-2 block text-sm font-bold tracking-widest text-[#c5a572] uppercase font-sans">
          {data.pointLabel || "COMMUNITY"}
        </span>
        <h2 className="font-sans text-4xl font-bold text-[#1a1a1a] sm:text-5xl">
          {data.sectionTitle}
        </h2>
        <div className="mx-auto mt-6 h-[2px] w-12 bg-[#c5a572]" />
        <p className="mt-6 text-base font-medium text-stone-600 font-sans">{data.subtitle}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {data.items.map((item, index) => (
          <div key={index} className="group flex flex-col items-center">
            <div className="relative mb-3 aspect-square w-full overflow-hidden bg-stone-100 shadow-sm transition-all duration-300 group-hover:shadow-md">
              {item.imageURL?.trim() ? (
                <Image
                  src={item.imageURL}
                  alt={item.label}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="50vw"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-stone-400">
                  이미지
                </div>
              )}
            </div>
            <span className="text-sm font-bold text-[#1a1a1a] font-sans transition-colors group-hover:text-[#c5a572]">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
