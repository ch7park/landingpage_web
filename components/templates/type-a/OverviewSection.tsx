"use client";

import Image from "next/image";
import type { LandingPageData } from "@/types/landing-page";

interface OverviewSectionProps {
  data: LandingPageData["overview"];
}

export function OverviewSection({ data }: OverviewSectionProps) {
  const hasOverviewText = data.projectName?.trim() || data.details?.some(d => d.label?.trim() || d.value?.trim());

  return (
    <section className="bg-transparent px-4 py-8">
      <div className="overflow-hidden rounded-xl">
        <div className={`relative w-full bg-gray-200 ${hasOverviewText ? "aspect-[4/3]" : "aspect-[3/4]"}`}>
          {data.overviewImageURL?.trim() ? (
            <Image
              src={data.overviewImageURL}
              alt={data.projectName || "사업개요"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
              이미지 없음
            </div>
          )}
        </div>
        {hasOverviewText && (
          <div className="overflow-hidden border-t-0 rounded-b-xl border border-gray-200 bg-white shadow-sm">
            {(data.categoryLabel?.trim() || data.projectName?.trim()) && (
              <div className="flex border-b border-gray-100">
                <div className="w-28 shrink-0 bg-[#6a5acd] px-4 py-3">
                  <span className="text-sm font-medium text-white">{data.categoryLabel}</span>
                </div>
                <div className="flex-1 px-4 py-3">
                  <span className="text-sm font-bold text-gray-900">{data.projectName}</span>
                </div>
              </div>
            )}
            {data.details.map((detail, index) => {
              if (!detail.label?.trim() && !detail.value?.trim()) return null;
              return (
                <div
                  key={index}
                  className="flex border-b border-gray-100 last:border-b-0"
                >
                  <div className="w-28 shrink-0 bg-[#6a5acd] px-4 py-3">
                    <span className="text-sm font-medium text-white">{detail.label}</span>
                  </div>
                  <div className="flex-1 px-4 py-3">
                    <span className="text-sm font-medium text-gray-900">{detail.value}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
