"use client";

import { useState } from "react";

const GUIDE = [
  { section: "Hero 메인", size: "800×600 ~ 1200×800", ratio: "가로형" },
  { section: "Overview 개요", size: "800×600", ratio: "4:3" },
  { section: "Location 지도", size: "800×600", ratio: "4:3" },
  { section: "Location 입지환경 카드", size: "400×400", ratio: "정사각형" },
  { section: "Development 지도", size: "800×600", ratio: "4:3" },
  { section: "Development 개발환경", size: "800×600", ratio: "4:3 (템플릿 A/B 공통)" },
  { section: "Facilities 단지시설", size: "300×300", ratio: "정사각형" },
  { section: "Interior 내부인테리어", size: "300×300", ratio: "정사각형" },
  { section: "FloorPlan 평면도", size: "400×300", ratio: "4:3" },
];

export function ImageSizeGuide() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-4 rounded-xl border border-gray-200 bg-white/70 backdrop-blur">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-gray-700"
      >
        <span>이미지 권장 사이즈 안내</span>
        <span className="text-lg">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="border-t border-gray-200 px-4 py-3">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-gray-600">
                <th className="pb-2 pr-4 text-left font-medium">이미지</th>
                <th className="pb-2 pr-4 text-left font-medium">권장 사이즈</th>
                <th className="pb-2 text-left font-medium">비율</th>
              </tr>
            </thead>
            <tbody>
              {GUIDE.map((row, i) => (
                <tr key={i} className="border-b border-gray-100 last:border-0">
                  <td className="py-1.5 pr-4 text-gray-700">{row.section}</td>
                  <td className="py-1.5 pr-4 font-medium text-gray-800">
                    {row.size}
                  </td>
                  <td className="py-1.5 text-gray-600">{row.ratio}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/** 이미지 업로드 라벨 옆에 표시할 사이즈 힌트 */
export function ImageSizeHint({ size }: { size: string }) {
  return (
    <span className="ml-1.5 text-xs text-gray-500">(권장: {size})</span>
  );
}
