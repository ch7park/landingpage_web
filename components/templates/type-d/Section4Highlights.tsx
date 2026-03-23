"use client";

import Image from "next/image";
import type { LandingPageData } from "@/types/landing-page";

interface Section4HighlightsProps {
  facilities: LandingPageData["facilities"];
  interior: LandingPageData["interior"];
  floorPlan: LandingPageData["floorPlan"];
}

export function Section4Highlights({ facilities, interior, floorPlan }: Section4HighlightsProps) {
  const showFacilities = facilities?.enabled !== false && facilities?.items?.length;
  const showInterior = interior?.enabled !== false && interior?.rooms?.length;
  const showFloorPlan = floorPlan?.enabled !== false && floorPlan?.images?.length;

  if (!showFacilities && !showInterior && !showFloorPlan) return null;

  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-16 md:mb-24 text-center">
          <span className="text-xs font-semibold tracking-[0.3em] text-[#0f172a]/50">SPECIAL DESIGN</span>
          <h2 className="mt-4 font-serif text-3xl font-bold text-gray-900 md:text-4xl">
            공간의 품격을 높이는<br className="sm:hidden" /> 프리미엄 설계
          </h2>
          <div className="mx-auto mt-8 h-px w-16 bg-[#0f172a]" />
        </div>

        <div className="space-y-24 md:space-y-32">
          {/* Facilities */}
          {showFacilities && (
            <div id="preview-section-facilities" className="scroll-mt-24">
              <div className="mb-8 flex items-center gap-4">
                <h3 className="font-serif text-2xl font-bold text-[#0f172a]">{facilities.sectionTitle || "커뮤니티"}</h3>
                <div className="h-px flex-1 bg-gray-200" />
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
                {facilities.items.map((item, i) => (
                  <div key={i} className="group relative overflow-hidden bg-gray-50">
                    <div className="relative aspect-[4/5] w-full">
                      {item.imageURL?.trim() ? (
                        <Image src={item.imageURL} alt={item.label} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="(max-width: 768px) 50vw, 25vw" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm text-gray-400 bg-gray-100">이미지</div>
                      )}
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                      {/* Text */}
                      <div className="absolute bottom-0 left-0 p-5">
                        <p className="font-serif text-lg font-medium text-white">{item.label}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interior */}
          {showInterior && (
            <div id="preview-section-interior" className="scroll-mt-24">
              <div className="mb-8 flex items-center gap-4">
                <h3 className="font-serif text-2xl font-bold text-[#0f172a]">{interior.sectionTitle || "인테리어"}</h3>
                <div className="h-px flex-1 bg-gray-200" />
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {interior.rooms.map((room, i) => (
                  <div key={i} className="group overflow-hidden bg-[#f8f9fa] border border-gray-100 p-2">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      {room.imageURL?.trim() ? (
                        <Image src={room.imageURL} alt={room.label} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 1024px) 50vw, 33vw" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm text-gray-400 bg-gray-200">이미지</div>
                      )}
                    </div>
                    <div className="py-4 text-center">
                      <p className="text-sm font-bold tracking-widest text-[#0f172a]">{room.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Floor Plan */}
          {showFloorPlan && (
            <div id="preview-section-floorplan" className="scroll-mt-24">
              <div className="mb-8 flex items-center gap-4">
                <h3 className="font-serif text-2xl font-bold text-[#0f172a]">{floorPlan.sectionTitle || "평면도"}</h3>
                <div className="h-px flex-1 bg-gray-200" />
              </div>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {floorPlan.images.map((img, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="relative aspect-[4/3] w-full p-4 border border-gray-200 bg-white shadow-sm">
                      {(typeof img === "string" ? img : img?.url)?.trim() ? (
                        <Image
                          src={typeof img === "string" ? img : img.url}
                          alt={typeof img === "object" ? img.label : `평면도 ${i + 1}`}
                          fill
                          className="object-contain p-4 transition-transform duration-500 hover:scale-105"
                          sizes="(max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm text-gray-400 bg-gray-50">평면도</div>
                      )}
                    </div>
                    <div className="mt-4 bg-[#0f172a] px-8 py-2">
                      <p className="text-sm font-bold text-white">
                        {typeof img === "object" ? img.label : `타입 ${i + 1}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
