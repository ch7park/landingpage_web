"use client";

import Image from "next/image";
import type { LandingPageData } from "@/types/landing-page";

interface DevelopmentSectionProps {
  data: LandingPageData["development"];
}

export function DevelopmentSection({ data }: DevelopmentSectionProps) {
  return (
    <section className="bg-stone-50 px-6 py-12">
      <div className="mb-10 text-center">
        <span className="mb-2 block text-sm font-bold tracking-widest text-[#c5a572] uppercase font-sans">
          {data.pointLabel || "FUTURE VALUE"}
        </span>
        <h2 className="font-sans text-4xl font-bold text-[#1a1a1a] sm:text-5xl">
          {data.sectionTitle}
        </h2>
        <div className="mx-auto mt-6 h-[2px] w-12 bg-[#c5a572]" />
        <p className="mt-6 text-base font-medium text-stone-600 font-sans">{data.subtitle}</p>
      </div>

      <div className="space-y-6">
        <div className="overflow-hidden bg-white shadow-sm">
          <div className="relative aspect-[16/9] w-full bg-stone-200">
            {data.mapImageURL?.trim() ? (
              <Image
                src={data.mapImageURL}
                alt={data.subtitle}
                fill
                className="object-cover"
                sizes="100vw"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-stone-400">
                이미지 없음
              </div>
            )}
          </div>
          <div className="p-6">
            <p className="leading-relaxed text-stone-700 font-sans">{data.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {data.images.map((img, i) => (
            <div key={i} className="group relative aspect-square overflow-hidden bg-stone-200">
              {img.imageURL?.trim() ? (
                <Image
                  src={img.imageURL}
                  alt={img.label}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="50vw"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-stone-400">
                  이미지
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-90" />
              <span className="absolute bottom-3 left-3 text-sm font-bold text-white font-sans">
                {img.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
