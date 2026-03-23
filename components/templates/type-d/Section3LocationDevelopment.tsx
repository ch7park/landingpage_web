"use client";

import Image from "next/image";
import type { LandingPageData } from "@/types/landing-page";

interface Section3LocationDevelopmentProps {
  location: LandingPageData["location"];
  development: LandingPageData["development"];
}

export function Section3LocationDevelopment({ location, development }: Section3LocationDevelopmentProps) {
  const showLocation = location?.enabled !== false;
  const showDevelopment = development?.enabled !== false;

  return (
    <>
      {/* Development: 풀배경 세로분할 디자인 */}
      {showDevelopment && (
        <section
          id="preview-section-development"
          className="relative w-full bg-[#111827] py-24 md:py-32 scroll-mt-24"
        >
          {/* 풀배경 이미지 & 다크 오버레이 */}
          <div className="absolute inset-0 z-0">
            {development.mapImageURL?.trim() ? (
              <Image
                src={development.mapImageURL}
                alt="개발호재 배경"
                fill
                className="object-cover opacity-40"
                sizes="100vw"
              />
            ) : (
              <div className="h-full w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-700 via-slate-900 to-black opacity-80" />
            )}
            <div className="absolute inset-0 bg-black/60" />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-16">
              <span className="mb-2 block text-sm font-medium tracking-[0.2em] text-amber-500">
                DEVELOPMENT
              </span>
              <h2 className="font-serif text-3xl font-bold text-white md:text-4xl">
                {development.sectionTitle || "내일이 더 기대되는 완벽한 비전"}
              </h2>
              {development.subtitle?.trim() && (
                <p className="mt-4 text-lg text-white/80">{development.subtitle}</p>
              )}
            </div>

            {/* 개발호재 리스트 - 세로선 분할 스타일 */}
            <div className="grid gap-x-8 gap-y-12 border-t border-white/20 pt-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-x-0 lg:gap-y-0 lg:border-t-0 lg:pt-0">
              {development.images?.map((img, i) => (
                <div key={i} className="flex flex-col lg:border-l lg:border-white/20 lg:px-8 lg:first:border-l-0 lg:first:pl-0 lg:last:pr-0">
                  <span className="mb-3 text-sm font-bold text-amber-400">VISION 0{i + 1}</span>
                  <h3 className="mb-4 text-xl font-medium text-white">{img.label}</h3>
                  {img.imageURL?.trim() && (
                    <div className="relative mt-auto aspect-[4/3] w-full overflow-hidden rounded-sm">
                      <Image src={img.imageURL} alt={img.label} fill className="object-cover transition-transform duration-500 hover:scale-110" sizes="(max-width: 1024px) 50vw, 25vw" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {development.description?.trim() && (
              <p className="mt-16 max-w-3xl text-sm leading-relaxed text-white/60 md:text-base">
                ※ {development.description}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Location: 곡선형 다크 네이비 블록 분할 디자인 */}
      {showLocation && (
        <section
          id="preview-section-location"
          className="relative w-full bg-[#f8f9fa] py-24 md:py-32 scroll-mt-24"
        >
          <div className="mx-auto max-w-7xl px-0 sm:px-6 lg:px-8">
            <div className="flex flex-col-reverse lg:flex-row lg:items-stretch lg:gap-8">
              
              {/* 좌측 지도 및 리스트 (다크 네이비 곡선형 배경) */}
              <div className="relative w-full overflow-hidden bg-[#0f172a] p-8 sm:rounded-tr-[80px] md:p-12 lg:w-2/3 lg:rounded-br-[80px] lg:rounded-tr-[120px]">
                <div className="relative z-10">
                  {location.mapImageURL?.trim() && (
                    <div className="relative mb-12 aspect-[16/9] w-full overflow-hidden rounded-xl border border-white/10 shadow-2xl">
                      <Image
                        src={location.mapImageURL}
                        alt="입지환경 지도"
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 66vw"
                      />
                    </div>
                  )}

                  <div className="grid gap-8 sm:grid-cols-2">
                    {(location.sections ?? []).map((sec, i) => (
                      <div key={i} className="flex flex-col">
                        <div className="mb-2 flex items-center gap-3">
                          <div className="h-1 w-1 rounded-full bg-amber-500" />
                          <span className="text-xs font-semibold uppercase tracking-wider text-amber-500">{sec.label}</span>
                        </div>
                        <h4 className="font-serif text-lg font-medium text-white">{sec.title}</h4>
                        <p className="mt-2 text-sm leading-relaxed text-white/60">{sec.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 우측 텍스트 영역 (깔끔한 화이트/그레이 배경 위) */}
              <div className="flex w-full flex-col justify-center p-8 lg:w-1/3 lg:p-12">
                <span className="text-sm font-medium tracking-[0.3em] text-[#0f172a]/60">LOCATION</span>
                <h2 className="mt-4 font-serif text-3xl font-bold leading-tight text-gray-900 md:text-4xl">
                  {location.sectionTitle || "도시를 더 위대하게\n가치를 더 높게"}
                </h2>
                <div className="mt-8 h-px w-16 bg-amber-500" />
                <p className="mt-8 text-base text-gray-500">
                  단지 앞 인프라부터 쾌속 교통망까지,<br />
                  가장 완벽한 중심을 선점합니다.
                </p>
              </div>

            </div>
          </div>
        </section>
      )}
    </>
  );
}
