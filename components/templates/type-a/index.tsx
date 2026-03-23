"use client";

import type { LandingPageData } from "@/types/landing-page";
import { HeroSection } from "./HeroSection";
import { FactCheckSection } from "./FactCheckSection";
import { OverviewSection } from "./OverviewSection";
import { LocationSection } from "./LocationSection";
import { DevelopmentSection } from "./DevelopmentSection";
import { FacilitiesSection } from "./FacilitiesSection";
import { InteriorSection } from "./InteriorSection";
import { FloorPlanSection } from "./FloorPlanSection";
import { ContactFormSection } from "./ContactFormSection";

interface TemplateAProps {
  data: LandingPageData;
  projectId?: string;
}

export function TemplateA({ data, projectId }: TemplateAProps) {
  let pointIndex = 1;
  const getPointLabel = () => `POINT ${pointIndex++}`;

  return (
    <div
      className="mx-auto min-h-screen w-full max-w-md overflow-hidden"
      style={{ background: "var(--gradient-page)" }}
    >
      <div id="preview-section-hero" className="scroll-mt-24">
        <HeroSection data={data.hero} />
      </div>
      {data.factCheck?.enabled !== false && (
        <div id="preview-section-factcheck" className="scroll-mt-24">
          <FactCheckSection data={{ ...data.factCheck, pointLabel: getPointLabel() }} />
        </div>
      )}
      {data.overview?.enabled !== false && (
        <div id="preview-section-overview" className="scroll-mt-24">
          <OverviewSection data={data.overview} />
        </div>
      )}
      {data.location?.enabled !== false && (
        <div id="preview-section-location" className="scroll-mt-24">
          <LocationSection data={{ ...data.location, pointLabel: getPointLabel() }} />
        </div>
      )}
      {data.development?.enabled !== false && (
        <div id="preview-section-development" className="scroll-mt-24">
          <DevelopmentSection data={{ ...data.development, pointLabel: getPointLabel() }} />
        </div>
      )}
      {data.facilities?.enabled !== false && (
        <div id="preview-section-facilities" className="scroll-mt-24">
          <FacilitiesSection data={{ ...data.facilities, pointLabel: getPointLabel() }} />
        </div>
      )}
      {data.interior?.enabled !== false && (
        <div id="preview-section-interior" className="scroll-mt-24">
          <InteriorSection data={{ ...data.interior, pointLabel: getPointLabel() }} />
        </div>
      )}
      {data.floorPlan?.enabled !== false && (
        <div id="preview-section-floorplan" className="scroll-mt-24">
          <FloorPlanSection data={{ ...data.floorPlan, pointLabel: getPointLabel() }} />
        </div>
      )}
      <ContactFormSection data={data.contactForm} projectId={projectId} />
    </div>
  );
}

export { HeroSection, FactCheckSection, OverviewSection, LocationSection, DevelopmentSection, FacilitiesSection, InteriorSection, FloorPlanSection, ContactFormSection };
