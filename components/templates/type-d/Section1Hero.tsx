"use client";

import Image from "next/image";
import type { LandingPageData } from "@/types/landing-page";

interface Section1HeroProps {
  data: LandingPageData["hero"];
}

export function Section1Hero({ data }: Section1HeroProps) {
  return (
    <section
      id="preview-section-hero"
      className="relative min-h-[100dvh] w-full overflow-hidden md:min-h-[95vh] scroll-mt-24"
    >
      <div className="absolute inset-0">
        {data.heroImageURL?.trim() ? (
          <Image
            src={data.heroImageURL}
            alt={data.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="h-full w-full bg-slate-900" />
        )}
        {/* 상단은 살짝 어둡게(로고 텍스트용), 전체적으로 은은한 어두운 그라데이션 */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      </div>

      <div className="relative flex min-h-[100dvh] flex-col justify-center px-6 md:min-h-[95vh] md:px-16 lg:px-24">
        <div className="max-w-3xl animate-fade-in-up">
          <div className="mb-6 flex items-center gap-4">
            <span className="h-px w-12 bg-white/60"></span>
            <span className="text-sm font-light tracking-[0.3em] text-white/90 md:text-base">
              {data.highlightText || "PREMIUM BRAND"}
            </span>
          </div>
          
          <h1 className="whitespace-pre-wrap font-serif text-4xl font-bold leading-[1.2] text-white drop-shadow-lg md:text-5xl lg:text-[4rem]">
            {data.title}
          </h1>
          
          {data.subtitle?.trim() && (
            <p className="mt-8 max-w-xl text-base font-light leading-relaxed text-white/80 md:text-lg">
              {data.subtitle}
            </p>
          )}
        </div>

        {/* 좌측 하단 스크롤 인디케이터 */}
        <div className="absolute bottom-12 left-6 flex items-center gap-4 md:left-16 lg:left-24">
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] tracking-widest text-white/60 uppercase">Scroll</span>
            <div className="h-16 w-px bg-white/30 overflow-hidden">
              <div className="w-full h-1/2 bg-white animate-[scroll-down_2s_ease-in-out_infinite]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
