"use client";

import Image from "next/image";
import type { LandingPageData } from "@/types/landing-page";

interface FloorPlanSectionProps {
  data: LandingPageData["floorPlan"];
}

export function FloorPlanSection({ data }: FloorPlanSectionProps) {
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
      <div className="mt-6 grid grid-cols-2 gap-4">
        {data.images.map((img, index) => (
          <div
            key={index}
            className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[#1c2b47]"
          >
            {img.url?.trim() ? (
              <Image
                src={img.url}
                alt={img.label || `평면도 ${index + 1}`}
                fill
                className="object-contain"
                sizes="50vw"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-500">
                <span className="text-sm">{img.label || `평면도 ${index + 1}`}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
