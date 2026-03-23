"use client";

import Image from "next/image";
import type { LandingPageData } from "@/types/landing-page";

interface FacilitiesSectionProps {
  data: LandingPageData["facilities"];
}

export function FacilitiesSection({ data }: FacilitiesSectionProps) {
  return (
    <section className="bg-transparent px-4 py-8">
      <div className="text-center">
        <div className="mb-4 flex w-full items-center gap-3">
          <span className="h-px flex-1 bg-gray-300" />
          <span className="shrink-0 text-sm font-medium text-gray-500">• {data.pointLabel} •</span>
          <span className="h-px flex-1 bg-gray-300" />
        </div>
        <h2 className="text-3xl font-bold text-[#6a5acd] sm:text-4xl md:text-5xl">
          {data.sectionTitle}
        </h2>
        {data.subtitle?.trim() && (
          <div className="mx-auto mt-3 inline-block rounded-lg bg-[#6a5acd] px-5 py-2">
            <span className="text-base font-bold text-white">{data.subtitle}</span>
          </div>
        )}
      </div>
      <div className="mt-6 overflow-hidden rounded-xl bg-white p-6 shadow-sm">
        <div className="grid grid-cols-2 gap-6 sm:gap-8">
          {data.items.map((item, index) => (
            <div
              key={index}
              className="group flex flex-col items-center transition-all duration-200 hover:scale-105"
            >
              <div className="relative size-24 overflow-hidden rounded-full border-2 border-[#6a5acd]/30 bg-gray-200 shadow-md ring-2 ring-transparent transition-all duration-200 group-hover:border-[#6a5acd] group-hover:ring-[#6a5acd]/20 group-hover:shadow-lg sm:size-28">
                {item.imageURL?.trim() ? (
                  <Image
                    src={item.imageURL}
                    alt={item.label}
                    fill
                    className="object-cover transition-transform duration-200 group-hover:scale-110"
                    sizes="120px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                    이미지
                  </div>
                )}
              </div>
              <span className="mt-3 text-sm font-bold text-gray-900 transition-colors duration-200 group-hover:text-[#6a5acd] sm:text-base">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
