"use client";

import Image from "next/image";
import type { LandingPageData } from "@/types/landing-page";
import { SectionHeader } from "./SectionHeader";

interface InteriorSectionProps {
  data: LandingPageData["interior"];
  zigbangLogoURL: string;
}

export function InteriorSection({ data, zigbangLogoURL }: InteriorSectionProps) {
  return (
    <section className="px-4 py-6">
      <div className="overflow-hidden rounded-2xl border border-[#6a5acd]/20 shadow-sm">
        <SectionHeader title={data.sectionTitle} zigbangLogoURL={zigbangLogoURL} large />
        <div className="bg-white px-4 py-6">
          <p className="mb-6 text-center text-sm text-gray-500">{data.subtitle}</p>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 sm:gap-6">
            {data.rooms.map((room, i) => (
              <div
                key={i}
                className="group flex flex-col items-center"
              >
                <div className="relative w-full overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#6a5acd]/30 hover:shadow-lg hover:shadow-[#6a5acd]/10">
                  <div className="relative aspect-square w-full overflow-hidden rounded-t-2xl">
                    {room.imageURL?.trim() ? (
                      <Image
                        src={room.imageURL}
                        alt={room.label}
                        fill
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                        sizes="33vw"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                        이미지 없음
                      </div>
                    )}
                  </div>
                  <div className="rounded-b-2xl border-t border-gray-100 bg-white px-4 py-2.5">
                    <span className="block text-center text-sm font-bold text-gray-900">
                      {room.label}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
