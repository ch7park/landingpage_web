"use client";

import { Check } from "lucide-react";
import type { LandingPageData } from "@/types/landing-page";
import { SectionHeader } from "./SectionHeader";

interface FactCheckSectionProps {
  data: LandingPageData["factCheck"];
  zigbangLogoURL: string;
}

export function FactCheckSection({ data, zigbangLogoURL }: FactCheckSectionProps) {
  return (
    <section className="px-4 py-6">
      <div className="overflow-hidden rounded-2xl border border-[#6a5acd]/20 shadow-sm">
        <SectionHeader title={data.sectionTitle} zigbangLogoURL={zigbangLogoURL} large />
        <div className="bg-white px-4 py-6">
          <ul className="flex flex-col gap-3">
            {data.items.map((item, index) => (
              <li
                key={index}
                className="flex items-center gap-3 rounded-xl bg-[#F5EEFE] px-4 py-3.5 transition-all duration-200 hover:scale-[1.02] hover:bg-[#EDE5FC] hover:shadow-md"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#7C40EE]">
                  <Check className="size-4 text-white" strokeWidth={3} />
                </span>
                <span className="text-lg font-bold text-gray-900">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
