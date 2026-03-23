"use client";

import { Check } from "lucide-react";
import type { LandingPageData } from "@/types/landing-page";

interface FactCheckSectionProps {
  data: LandingPageData["factCheck"];
}

export function FactCheckSection({ data }: FactCheckSectionProps) {
  return (
    <section className="bg-white px-6 py-12">
      <div className="mb-10 text-center">
        <span className="mb-2 block text-sm font-bold tracking-widest text-[#c5a572] uppercase font-sans">
          {data.pointLabel || "PREMIUM CHECK"}
        </span>
        <h2 className="font-sans text-4xl font-bold text-[#1a1a1a] sm:text-5xl">
          {data.sectionTitle}
        </h2>
        <div className="mx-auto mt-6 h-[2px] w-12 bg-[#c5a572]" />
      </div>
      
      <div className="grid gap-4">
        {data.items.map((item, index) => (
          <div
            key={index}
            className="group relative flex items-start gap-5 overflow-hidden bg-stone-50 p-6 transition-all hover:bg-white hover:shadow-lg"
          >
            <div className="absolute left-0 top-0 h-full w-[3px] bg-[#c5a572] opacity-0 transition-opacity group-hover:opacity-100" />
            
            {/* Number Circle - shrinks to fit content */}
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#1a1a1a] text-white sm:size-10">
              <span className="font-sans text-base font-bold sm:text-lg">{index + 1}</span>
            </div>
            
            {/* Content Text */}
            <p className="flex-1 font-sans text-lg font-medium leading-relaxed text-stone-800">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
