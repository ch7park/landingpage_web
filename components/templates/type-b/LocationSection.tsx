"use client";

import Image from "next/image";
import type { LandingPageData } from "@/types/landing-page";
import { SectionHeader } from "./SectionHeader";

interface LocationSectionProps {
  data: LandingPageData["location"];
  zigbangLogoURL: string;
}

export function LocationSection({ data, zigbangLogoURL }: LocationSectionProps) {
  return (
    <section className="px-4 py-6">
      <div className="overflow-hidden rounded-2xl border border-[#6a5acd]/20 shadow-sm">
        <SectionHeader title={data.sectionTitle} zigbangLogoURL={zigbangLogoURL} large />
        <div className="bg-white px-4 py-6">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-gray-200">
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
          <div className="mt-6 flex flex-col gap-4">
            {data.sections.map((section, i) => (
              <div
                key={i}
                className="flex h-[160px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-md sm:h-[180px]"
              >
                <div className="relative h-full w-[120px] shrink-0 bg-gray-200 sm:w-[140px]">
                  {section.imageURL?.trim() ? (
                    <Image
                      src={section.imageURL}
                      alt={section.label}
                      fill
                      className="object-cover"
                      sizes="140px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-gray-500">
                      이미지 없음
                    </div>
                  )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-center overflow-hidden px-4 py-3">
                  <span className="text-xs font-bold text-[#6a5acd]">{section.label}</span>
                  <h3 className="mt-1 line-clamp-2 text-base font-bold text-gray-900">{section.title}</h3>
                  <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-gray-600">{section.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
