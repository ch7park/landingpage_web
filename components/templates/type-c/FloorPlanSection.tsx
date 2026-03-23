"use client";

import Image from "next/image";
import type { LandingPageData } from "@/types/landing-page";

interface FloorPlanSectionProps {
  data: LandingPageData["floorPlan"];
}

export function FloorPlanSection({ data }: FloorPlanSectionProps) {
  return (
    <section className="bg-white px-6 py-12">
      <div className="mb-10 text-center">
        <span className="mb-2 block text-sm font-bold tracking-widest text-[#c5a572] uppercase font-sans">
          {data.pointLabel || "UNIT PLAN"}
        </span>
        <h2 className="font-sans text-4xl font-bold text-[#1a1a1a] sm:text-5xl">
          {data.sectionTitle}
        </h2>
        <div className="mx-auto mt-6 h-[2px] w-12 bg-[#c5a572]" />
        <p className="mt-6 text-base font-medium text-stone-600 font-sans">{data.subtitle}</p>
      </div>

      <div className="space-y-6">
        {data.images.map((img, index) => (
          <div key={index} className="border border-stone-100 p-4 transition-all duration-300 hover:border-[#c5a572]/30 hover:shadow-lg">
            <div className="mb-2 text-right">
              <span className="text-sm font-bold text-[#c5a572] font-sans">{img.label || `TYPE ${index + 1}`}</span>
            </div>
            <div className="relative aspect-[4/3] w-full bg-white">
              {img.url?.trim() ? (
                <Image
                  src={img.url}
                  alt={img.label}
                  fill
                  className="object-contain transition-transform duration-500 hover:scale-105"
                  sizes="100vw"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-stone-50 text-sm text-stone-300">
                  Plan Image
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
