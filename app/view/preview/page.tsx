"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { TemplateA } from "@/components/templates/type-a";
import { TemplateB } from "@/components/templates/type-b";
import { TemplateC } from "@/components/templates/type-c";
import { TemplateD } from "@/components/templates/type-d";
import { FloatingContactBar } from "@/components/FloatingContactBar";
import { loadFromStorage, loadTemplateFromStorage, type TemplateType } from "@/lib/storage-utils";
import type { LandingPageData } from "@/types/landing-page";

function TemplatePreview({ template, data }: { template: TemplateType; data: LandingPageData }) {
  switch (template) {
    case "b":
      return <TemplateB data={data} />;
    case "c":
      return <TemplateC data={data} />;
    case "d":
      return <TemplateD data={data} />;
    default:
      return <TemplateA data={data} />;
  }
}

export default function PreviewPage() {
  const [data, setData] = useState<LandingPageData | null>(null);
  const [template, setTemplate] = useState<TemplateType>("a");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const t = loadTemplateFromStorage();
    const currentTemplate = t === "a" || t === "b" || t === "c" || t === "d" ? t : "a";
    setTemplate(currentTemplate);
    const saved = loadFromStorage(currentTemplate);
    if (saved) setData(saved);
  }, []);

  if (!mounted) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-500">불러오는 중...</p>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4">
        <h1 className="text-xl font-bold text-gray-900">저장된 데이터가 없습니다</h1>
        <p className="mt-2 text-center text-gray-600">
          편집기에서 랜딩페이지를 만들고 저장한 뒤<br />
          이 페이지를 새로고침해 주세요.
        </p>
        <Link
          href="/editor"
          className="mt-6 rounded-lg bg-[#6a5acd] px-6 py-2 text-sm font-medium text-white hover:bg-[#5a4abd]"
        >
          편집기로 이동
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="flex justify-between px-4 py-3">
        <span className="text-sm text-gray-500">로컬 미리보기 (저장된 내용)</span>
        <Link href="/editor" className="text-sm text-[#6a5acd] hover:underline">
          편집기로 돌아가기
        </Link>
      </div>
      <div className="mx-auto flex max-w-md justify-center pb-8">
        <div className="w-full shadow-xl">
          <TemplatePreview template={template} data={data} />
        </div>
      </div>
      <FloatingContactBar phoneNumber={data.contactForm?.phoneNumber} kakaoLink={data.contactForm?.kakaoLink} />
    </main>
  );
}
