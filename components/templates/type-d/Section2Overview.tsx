"use client";

import Image from "next/image";
import type { LandingPageData } from "@/types/landing-page";

interface Section2OverviewProps {
  overview: LandingPageData["overview"];
  factCheck: LandingPageData["factCheck"];
}

export function Section2Overview({ overview, factCheck }: Section2OverviewProps) {
  const showOverview = overview?.enabled !== false;
  const showFact = factCheck?.enabled !== false;
  const hasOverviewText = overview?.projectName?.trim() || overview?.details?.some(d => d.label?.trim() || d.value?.trim());

  return (
    <section className="relative w-full bg-[#f8f9fa] pb-24">
      {/* 딥 틸(청록색) 배경 블록 - 데스크톱에서는 좌측 45% 차지, 모바일은 상단 일부 */}
      <div className="absolute left-0 top-0 h-[400px] w-full bg-[#0d3b3c] lg:h-full lg:w-[45%]" />

      <div className="relative mx-auto max-w-7xl px-4 pt-16 md:px-8 lg:pt-32">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          
          {/* 좌측 타이틀 영역 (딥 틸 배경 위) */}
          <div className="lg:col-span-4">
            <div className="text-white">
              <p className="mb-4 text-sm font-light tracking-widest text-white/70">PREMIUM POINT</p>
              <h2 className="font-serif text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
                {factCheck?.sectionTitle || "완벽한 삶의\n새로운 기준"}
              </h2>
              <div className="mt-8 hidden h-px w-12 bg-white/30 lg:block" />
            </div>
          </div>

          {/* 우측 카드 영역 (오버랩) */}
          <div className="lg:col-span-8">
            {showFact && factCheck?.items?.length > 0 && (
              <div
                id="preview-section-factcheck"
                className="scroll-mt-24 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6"
              >
                {factCheck.items.map((item, i) => (
                  <div 
                    key={i} 
                    className="group relative overflow-hidden bg-white p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-transform hover:-translate-y-2"
                  >
                    {/* 카드 상단 장식 선 */}
                    <div className="absolute left-0 top-0 h-1 w-0 bg-[#0d3b3c] transition-all duration-500 group-hover:w-full" />
                    
                    <span className="mb-4 block text-xs font-bold text-gray-400">PREMIUM 0{i + 1}</span>
                    <p className="font-serif text-lg font-medium text-gray-900 md:text-xl leading-snug">
                      {item.text}
                    </p>
                    
                    {/* 장식용 아이콘 자리 (원형) */}
                    <div className="mt-8 flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 text-[#0d3b3c] transition-colors group-hover:bg-[#0d3b3c] group-hover:text-white">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 사업개요 블록 (아래쪽에 배치) */}
        {showOverview && (
          <div
            id="preview-section-overview"
            className="mt-24 scroll-mt-24 lg:mt-32"
          >
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-8">
              <div>
                <span className="text-xs font-bold tracking-widest text-[#0d3b3c]">PROJECT OVERVIEW</span>
                {overview.projectName?.trim() && (
                  <h3 className="mt-2 text-2xl font-bold text-gray-900 md:text-3xl">{overview.projectName}</h3>
                )}
              </div>
            </div>
            
            <div className={`grid gap-8 ${hasOverviewText ? "lg:grid-cols-2" : "grid-cols-1"}`}>
              <div className={`relative w-full overflow-hidden bg-gray-200 ${hasOverviewText ? "aspect-[16/9]" : "aspect-[21/9]"}`}>
                {overview.overviewImageURL?.trim() && (
                  <Image
                    src={overview.overviewImageURL}
                    alt={overview.projectName || "사업개요"}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                )}
              </div>
              
              {hasOverviewText && (
                <div className="flex flex-col justify-center bg-white p-8 shadow-sm border border-gray-100">
                  <div className="divide-y divide-gray-100">
                    {overview.details?.map((d, i) => {
                      if (!d.label?.trim() && !d.value?.trim()) return null;
                      return (
                        <div key={i} className="flex py-4 first:pt-0 last:pb-0">
                          <span className="w-1/3 text-sm font-bold text-gray-400">{d.label}</span>
                          <span className="w-2/3 text-sm font-medium text-gray-900">{d.value}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
