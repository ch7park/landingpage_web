"use client";

import { TemplateA } from "@/components/templates/type-a";
import { TemplateB } from "@/components/templates/type-b";
import { TemplateC } from "@/components/templates/type-c";
import { TemplateD } from "@/components/templates/type-d";
import { dummyData } from "@/data/dummy-data";
import type { TemplateType } from "@/lib/storage-utils";

interface PhoneMockupProps {
  template: TemplateType;
  className?: string;
}

/** 실제 모바일 뷰포트 너비 (iPhone 14 기준) */
const MOBILE_WIDTH = 390;

function TemplateMini({ template }: { template: TemplateType }) {
  switch (template) {
    case "b":
      return <TemplateB data={dummyData} />;
    case "c":
      return <TemplateC data={dummyData} />;
    case "d":
      return <TemplateD data={dummyData} />;
    default:
      return <TemplateA data={dummyData} />;
  }
}

export function PhoneMockup({ template, className = "" }: PhoneMockupProps) {
  const phoneFrameWidth = 220;
  const bezel = 6;
  const screenWidth = phoneFrameWidth - bezel * 2;
  const scale = screenWidth / MOBILE_WIDTH;

  return (
    <div
      className={`flex flex-col items-center ${className}`}
      style={{ width: phoneFrameWidth }}
    >
      {/* 세련된 폰 프레임 - 얇은 베젤, 다이나믹 아일랜드 스타일 */}
      <div
        className="relative w-full overflow-hidden rounded-[2.75rem] bg-[#1c1c1e]"
        style={{
          boxShadow:
            "0 25px 50px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        <div
          className="relative overflow-hidden rounded-[2.25rem]"
          style={{
            margin: `${bezel}px`,
            background: "#000",
          }}
        >
          {/* 다이나믹 아일랜드 */}
          <div
            className="absolute left-1/2 z-10 -translate-x-1/2 rounded-full bg-black"
            style={{ top: 10, width: 72, height: 26 }}
          />
          {/* 스크린 - 9:19.5 비율 (iPhone 비율), 다이나믹 아일랜드 아래부터 */}
          <div
            className="relative overflow-hidden bg-white"
            style={{
              width: screenWidth,
              aspectRatio: "9/19.5",
              marginTop: 36,
            }}
          >
            <div
              className="absolute left-0 top-0 origin-top-left overflow-hidden"
              style={{
                width: MOBILE_WIDTH,
                transform: `scale(${scale})`,
                minHeight: 800,
              }}
            >
              <div
                style={{ width: MOBILE_WIDTH }}
                className="overflow-hidden"
              >
                <TemplateMini template={template} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
