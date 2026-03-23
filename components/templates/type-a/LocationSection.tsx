"use client";

import Image from "next/image";
import type { LandingPageData } from "@/types/landing-page";

interface LocationSectionProps {
  data: LandingPageData["location"];
}

export function LocationSection({ data }: LocationSectionProps) {
  return (
    <section className="bg-transparent px-4 py-8">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-200">
        {data.mapImageURL?.trim() ? (
          <Image
            src={data.mapImageURL}
            alt="입지 지도"
            fill
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
            이미지 없음
          </div>
        )}
      </div>
      <div className="mt-8 text-center">
        <div className="mb-4 flex w-full items-center gap-3">
          <span className="h-px flex-1 bg-gray-300" />
          <span className="shrink-0 text-sm font-medium text-gray-500">• {data.pointLabel} •</span>
          <span className="h-px flex-1 bg-gray-300" />
        </div>
        <h2 className="text-3xl font-bold text-[#6a5acd] sm:text-4xl md:text-5xl">
          {data.sectionTitle}
        </h2>
      </div>
      <div
          className="mt-8 grid gap-4"
          style={{
            gridTemplateColumns:
              "repeat(auto-fill, minmax(min(100%, 320px), 1fr))",
          }}
        >
        {data.sections.map((section, index) => (
          <div
            key={index}
            className="flex overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
          >
            <div className="flex w-28 shrink-0 flex-col sm:w-32">
              <div className="relative aspect-square w-full overflow-hidden bg-gray-200">
                {section.imageURL?.trim() ? (
                  <Image
                    src={section.imageURL}
                    alt={section.label}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                    이미지
                  </div>
                )}
              </div>
              <span className="block rounded-none bg-[#6a5acd] px-2 py-2 text-center text-sm font-bold text-white sm:text-base">
                {section.label}
              </span>
            </div>
            <div className="flex flex-1 flex-col justify-center px-4 py-3">
              <h3 className="text-base font-bold text-[#6a5acd] sm:text-lg">{section.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-gray-600 sm:text-sm">{section.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
