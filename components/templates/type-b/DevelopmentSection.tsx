"use client";

import Image from "next/image";
import type { LandingPageData } from "@/types/landing-page";
import { SectionHeader } from "./SectionHeader";

interface DevelopmentSectionProps {
  data: LandingPageData["development"];
  zigbangLogoURL: string;
}

export function DevelopmentSection({ data, zigbangLogoURL }: DevelopmentSectionProps) {
  return (
    <section className="px-4 py-6">
      <div className="overflow-hidden rounded-2xl border border-[#6a5acd]/20 shadow-sm">
        <SectionHeader title={data.sectionTitle} zigbangLogoURL={zigbangLogoURL} large />
        <div className="bg-white px-4 py-6">
          {data.subtitle ? (
            <p className="rounded-xl bg-[#6a5acd] px-4 py-3 text-center text-sm font-medium text-white">
              {data.subtitle}
            </p>
          ) : null}
          <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${data.subtitle ? "mt-4" : ""}`}>
            {data.images.map((img, i) => (
              <div
                key={i}
                className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-200 transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
              >
                {img.imageURL?.trim() ? (
                  <Image
                    src={img.imageURL}
                    alt={img.label}
                    fill
                    className="object-cover"
                    sizes="50vw"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
                    이미지 없음
                  </div>
                )}
                <span className="absolute bottom-0 left-0 right-0 bg-black/50 py-1 text-center text-xs font-medium text-white">
                  {img.label}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-4 rounded-xl border border-gray-200 bg-white px-4 py-3 text-center text-sm font-medium text-gray-800">
            {data.description}
          </p>
        </div>
      </div>
    </section>
  );
}
