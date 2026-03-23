"use client";

import { CheckCircle } from "lucide-react";
import type { LandingPageData } from "@/types/landing-page";

interface FactCheckSectionProps {
  data: LandingPageData["factCheck"];
}

export function FactCheckSection({ data }: FactCheckSectionProps) {
  return (
    <section className="bg-[#6a5acd] px-4 py-8">
      <p className="mb-2 text-center text-xs font-medium text-white/90">{data.pointLabel}</p>
      <h2
        className="mb-6 text-center text-3xl font-bold text-white transition-all duration-200 hover:scale-105 hover:brightness-110 sm:text-4xl md:text-5xl"
        style={{ cursor: "default" }}
      >
        {data.sectionTitle}
      </h2>
      <ul className="flex flex-col gap-3">
        {data.items.map((item, index) => (
          <li
            key={index}
            className="group flex items-start gap-3 rounded-xl bg-white px-4 py-3 shadow-sm transition-all duration-200 hover:bg-[#6a5acd] hover:shadow-lg"
          >
            <CheckCircle className="mt-0.5 size-5 shrink-0 text-[#6a5acd] transition-colors duration-200 group-hover:text-white" />
            <span className="text-sm font-medium text-gray-900 transition-all duration-200 group-hover:text-base group-hover:text-white">{item.text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
