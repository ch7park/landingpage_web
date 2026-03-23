"use client";

import Image from "next/image";
import type { LandingPageData } from "@/types/landing-page";

interface DevelopmentSectionProps {
  data: LandingPageData["development"];
}

export function DevelopmentSection({ data }: DevelopmentSectionProps) {
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
      <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="flex items-stretch gap-4 p-4 pb-0">
          <div className="relative flex w-[52%] shrink-0 flex-col overflow-hidden rounded-lg">
            <div className="relative min-h-0 flex-1 bg-gray-200">
              {data.mapImageURL?.trim() ? (
                <Image
                  src={data.mapImageURL}
                  alt={data.subtitle}
                  fill
                  className="object-cover"
                  sizes="52vw"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
                  이미지 없음
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-3 pb-4">
            {data.images.map((img, index) => (
              <div
                key={index}
                className="flex flex-1 flex-col overflow-hidden rounded-lg transition-all duration-200 hover:scale-[1.02]"
              >
                <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-gray-200">
                  {img.imageURL?.trim() ? (
                    <Image
                      src={img.imageURL}
                      alt={img.label}
                      fill
                      className="object-cover"
                      sizes="48vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
                      이미지 없음
                    </div>
                  )}
                </div>
                <span className="block rounded-none bg-[#6a5acd] py-1.5 text-center text-sm font-bold text-white">
                  {img.label}
                </span>
              </div>
            ))}
          </div>
        </div>
        <p className="border-t border-gray-100 px-4 py-4 text-center text-base font-bold text-gray-800">
          {data.description}
        </p>
      </div>
    </section>
  );
}
