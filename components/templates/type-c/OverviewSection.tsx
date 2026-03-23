"use client";

import Image from "next/image";
import type { LandingPageData } from "@/types/landing-page";

interface OverviewSectionProps {
  data: LandingPageData["overview"];
}

export function OverviewSection({ data }: OverviewSectionProps) {
  const hasOverviewText = data.projectName?.trim() || data.details?.some(d => d.label?.trim() || d.value?.trim());

  return (
    <section className="bg-stone-50 px-6 py-12">
      <div className="mb-8 text-center">
        <h2 className="font-serif text-2xl text-[#1a1a1a]">Project Overview</h2>
        <p className="mt-1 text-xs text-stone-500 uppercase tracking-widest">사업개요</p>
      </div>

      <div className={`overflow-hidden bg-white ${hasOverviewText ? "shadow-sm" : "rounded-xl shadow-lg"}`}>
        <div className={`relative w-full bg-stone-200 ${hasOverviewText ? "aspect-video" : "aspect-[3/4]"}`}>
          {data.overviewImageURL?.trim() ? (
            <Image
              src={data.overviewImageURL}
              alt={data.projectName || "사업개요"}
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
        
        {hasOverviewText && (
          <div className="p-6">
            {data.projectName?.trim() && (
              <h3 className="mb-6 font-serif text-xl font-medium text-[#1a1a1a]">
                {data.projectName}
              </h3>
            )}
            <div className="space-y-4">
              {data.details.map((detail, index) => {
                if (!detail.label?.trim() && !detail.value?.trim()) return null;
                return (
                  <div key={index} className="flex flex-col gap-1 border-b border-stone-100 pb-3 last:border-0 last:pb-0">
                    <span className="text-xs font-bold text-[#c5a572] uppercase tracking-wide">
                      {detail.label}
                    </span>
                    <span className="text-sm text-stone-600">{detail.value}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
