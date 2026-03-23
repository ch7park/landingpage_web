"use client";

import type { LandingPageData } from "@/types/landing-page";
import { Section1Hero } from "./Section1Hero";
import { Section2Overview } from "./Section2Overview";
import { Section3LocationDevelopment } from "./Section3LocationDevelopment";
import { Section4Highlights } from "./Section4Highlights";
import { Section5Contact } from "./Section5Contact";

interface TemplateDProps {
  data: LandingPageData;
  projectId?: string;
}

/** 템플릿 D: 원페이지 5섹션, 데스크톱/모바일 반응형, 고급스러운 분양광고 */
export function TemplateD({ data, projectId }: TemplateDProps) {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white font-sans text-stone-900 antialiased">
      <Section1Hero data={data.hero} />
      <Section2Overview overview={data.overview} factCheck={data.factCheck} />
      <Section3LocationDevelopment location={data.location} development={data.development} />
      <Section4Highlights
        facilities={data.facilities}
        interior={data.interior}
        floorPlan={data.floorPlan}
      />
      <Section5Contact data={data.contactForm} projectId={projectId} />
    </div>
  );
}
