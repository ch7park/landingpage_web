"use client";

import Image from "next/image";
import type { LandingPageData } from "@/types/landing-page";

interface LocationSectionProps {
  data: LandingPageData["location"];
}

export function LocationSection({ data }: LocationSectionProps) {
  return (
    <section className="bg-white px-6 py-12">
      <div className="mb-10 text-center">
        <span className="mb-2 block text-sm font-bold tracking-widest text-[#c5a572] uppercase font-sans">
          {data.pointLabel || "PREMIUM LOCATION"}
        </span>
        <h2 className="font-sans text-4xl font-bold text-[#1a1a1a] sm:text-5xl">
          {data.sectionTitle}
        </h2>
        <div className="mx-auto mt-6 h-[2px] w-12 bg-[#c5a572]" />
      </div>

      <div className="group mb-10 overflow-hidden rounded-2xl shadow-sm">
        <div className="relative aspect-[4/3] w-full bg-stone-200 overflow-hidden">
          {data.mapImageURL?.trim() ? (
            <Image
              src={data.mapImageURL}
              alt="입지 지도"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="100vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-stone-400">
              이미지 없음
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {data.sections.map((section, index) => (
          <div 
            key={index} 
            className="group flex items-center gap-5 rounded-xl border border-transparent p-4 transition-all duration-300 hover:border-stone-100 hover:bg-stone-50 hover:shadow-md hover:-translate-y-1"
          >
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-stone-200 shadow-sm">
              {section.imageURL?.trim() ? (
                <Image
                  src={section.imageURL}
                  alt={section.label}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="96px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-stone-100 text-stone-300">
                  Img
                </div>
              )}
            </div>
            <div className="flex flex-col justify-center">
              <span className="mb-1 text-xs font-bold text-[#c5a572] uppercase tracking-wide font-sans transition-colors group-hover:text-[#b08d55]">
                {section.label}
              </span>
              <h3 className="mb-1 text-lg font-bold text-[#1a1a1a] font-sans transition-colors group-hover:text-black">
                {section.title}
              </h3>
              <p className="text-sm leading-relaxed text-stone-600 line-clamp-2 font-sans group-hover:text-stone-700">
                {section.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
