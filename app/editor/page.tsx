"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { TemplateA } from "@/components/templates/type-a";
import { TemplateB } from "@/components/templates/type-b";
import { TemplateC } from "@/components/templates/type-c";
import { TemplateD } from "@/components/templates/type-d";
import type { LandingPageData } from "@/types/landing-page";
import { dummyData } from "@/data/dummy-data";
import {
  loadFromStorage,
  saveToStorage,
  clearStorage,
  prepareForExport,
  prepareForExportCompressed,
  loadTemplateFromStorage,
  saveTemplateToStorage,
  parseImportedFile,
  downloadEditorSnapshot,
  type TemplateType,
} from "@/lib/storage-utils";
import { ImageSizeGuide } from "@/components/editor/ImageSizeGuide";
import { ImageUploadField } from "@/components/editor/ImageUploadField";
import { SectionVisibilityToggle } from "@/components/editor/SectionVisibilityToggle";
import { ConfirmDialog } from "@/components/editor/ConfirmDialog";
import { EditorButton } from "@/components/editor/EditorButton";
import { FloatingContactBar } from "@/components/FloatingContactBar";

function createImageHandler(
  setData: React.Dispatch<React.SetStateAction<LandingPageData>>,
  path: string[]
) {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setData((prev) => {
      const next = JSON.parse(JSON.stringify(prev)) as LandingPageData;
      let obj: any = next;
      for (let i = 0; i < path.length - 1; i++) {
        obj = obj[path[i] as keyof typeof obj] as Record<string, unknown>;
      }
      obj[path[path.length - 1]] = url;
      return next;
    });
  };
}

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

export default function EditorPage() {
  const [data, setData] = useState<LandingPageData>(() =>
    JSON.parse(JSON.stringify(dummyData))
  );
  const TEMPLATE_C_LOCKED = false; // 템플릿 C 잠금 해제
  // SSR/클라이언트 불일치 방지: 초기값은 항상 "a", 마운트 후 useEffect에서 localStorage 로드
  const [template, setTemplate] = useState<TemplateType>("a");
  const [savingToSupabase, setSavingToSupabase] = useState(false);
  const [savingSnapshot, setSavingSnapshot] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  type SectionKey =
    | "hero"
    | "factCheck"
    | "overview"
    | "location"
    | "development"
    | "facilities"
    | "interior"
    | "floorPlan"
    | "contactForm";

  const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>(
    {
      hero: true,
      factCheck: true,
      overview: true,
      location: true,
      development: true,
      facilities: true,
      interior: true,
      floorPlan: true,
      contactForm: true,
    },
  );

  const toggleSection = (key: SectionKey) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const factCheckOn = data.factCheck.enabled !== false;
  const overviewOn = data.overview.enabled !== false;
  const locationOn = data.location.enabled !== false;
  const developmentOn = data.development.enabled !== false;
  const facilitiesOn = data.facilities.enabled !== false;
  const interiorOn = data.interior.enabled !== false;
  const floorPlanOn = data.floorPlan.enabled !== false;

  // 초기 로드 시 로컬 스토리지에서 불러오기 (템플릿별 데이터)
  useEffect(() => {
    let t = loadTemplateFromStorage();
    if (TEMPLATE_C_LOCKED && t === "c") {
      t = "a";
      saveTemplateToStorage("a");
    }
    const currentTemplate = (t === "a" || t === "b" || t === "c" || t === "d") ? t : "a";
    setTemplate(currentTemplate);
    const saved = loadFromStorage(currentTemplate);
    if (saved) setData(saved);
  }, []);

  const handleTemplateChange = (newTemplate: TemplateType) => {
    // 현재 데이터를 현재 템플릿에 저장
    saveToStorage(data, template);
    // 새 템플릿 데이터 로드 (없으면 더미데이터)
    const saved = loadFromStorage(newTemplate);
    setData(saved ? JSON.parse(JSON.stringify(saved)) : JSON.parse(JSON.stringify(dummyData)));
    setTemplate(newTemplate);
    saveTemplateToStorage(newTemplate);
  };

  // 자동 저장 (로컬 스토리지, 500ms 디바운스, 템플릿별)
  useEffect(() => {
    const timer = setTimeout(() => {
      saveToStorage(data, template);
      setSavedAt(new Date());
    }, 500);
    return () => clearTimeout(timer);
  }, [data, template]);

  const update = useCallback(
    <K extends keyof LandingPageData>(
      section: K,
      updates: Partial<LandingPageData[K]>
    ) => {
      setData((prev) => ({
        ...prev,
        [section]: { ...prev[section], ...updates },
      }));
    },
    []
  );

  const updateNested = useCallback(
    (section: keyof LandingPageData, key: string, value: unknown) => {
      setData((prev) => ({
        ...prev,
        [section]: { ...prev[section], [key]: value },
      }));
    },
    []
  );

  const confirmActionRef = useRef<null | (() => void)>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const openConfirm = (fn: () => void) => {
    confirmActionRef.current = fn;
    setConfirmOpen(true);
  };
  const closeConfirm = () => {
    setConfirmOpen(false);
    confirmActionRef.current = null;
  };
  const handleConfirm = () => {
    confirmActionRef.current?.();
    closeConfirm();
  };

  const scrollToPreview = (previewId: string) => {
    const el = document.getElementById(previewId);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const addFactItem = () => {
    setData((prev) => ({
      ...prev,
      factCheck: {
        ...prev.factCheck,
        items: [...prev.factCheck.items, { text: "" }],
      },
    }));
  };
  const removeFactItem = (i: number) => {
    setData((prev) => ({
      ...prev,
      factCheck: {
        ...prev.factCheck,
        items: prev.factCheck.items.filter((_, idx) => idx !== i),
      },
    }));
  };

  const addLocationSection = () => {
    setData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        sections: [
          ...prev.location.sections,
          {
            imageURL: "",
            label: "",
            title: "",
            description: "",
          },
        ],
      },
    }));
  };
  const removeLocationSection = (i: number) => {
    setData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        sections: prev.location.sections.filter((_, idx) => idx !== i),
      },
    }));
  };

  const addFacilityItem = () => {
    setData((prev) => ({
      ...prev,
      facilities: {
        ...prev.facilities,
        items: [...prev.facilities.items, { imageURL: "", label: "" }],
      },
    }));
  };
  const removeFacilityItem = (i: number) => {
    setData((prev) => ({
      ...prev,
      facilities: {
        ...prev.facilities,
        items: prev.facilities.items.filter((_, idx) => idx !== i),
      },
    }));
  };

  const addInteriorRoom = () => {
    setData((prev) => ({
      ...prev,
      interior: {
        ...prev.interior,
        rooms: [...prev.interior.rooms, { imageURL: "", label: "" }],
      },
    }));
  };
  const removeInteriorRoom = (i: number) => {
    setData((prev) => ({
      ...prev,
      interior: {
        ...prev.interior,
        rooms: prev.interior.rooms.filter((_, idx) => idx !== i),
      },
    }));
  };

  const addFloorPlanImage = () => {
    setData((prev) => ({
      ...prev,
      floorPlan: {
        ...prev.floorPlan,
        images: [...prev.floorPlan.images, { url: "", label: "TYPE A" }],
      },
    }));
  };
  const removeFloorPlanImage = (i: number) => {
    setData((prev) => ({
      ...prev,
      floorPlan: {
        ...prev.floorPlan,
        images: prev.floorPlan.images.filter((_, idx) => idx !== i),
      },
    }));
  };

  const addDevelopmentImage = () => {
    setData((prev) => ({
      ...prev,
      development: {
        ...prev.development,
        images: [...prev.development.images, { imageURL: "", label: "" }],
      },
    }));
  };
  const removeDevelopmentImage = (i: number) => {
    setData((prev) => ({
      ...prev,
      development: {
        ...prev.development,
        images: prev.development.images.filter((_, idx) => idx !== i),
      },
    }));
  };

  const heroImageHandler = createImageHandler(setData, ["hero", "heroImageURL"]);
  const overviewImageHandler = createImageHandler(setData, [
    "overview",
    "overviewImageURL",
  ]);
  const mapImageHandler = createImageHandler(setData, [
    "location",
    "mapImageURL",
  ]);
  const devMapHandler = createImageHandler(setData, [
    "development",
    "mapImageURL",
  ]);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const raw = JSON.parse(reader.result as string);
        const snapshot = parseImportedFile(raw);
        if (!snapshot) {
          alert("올바른 랜딩페이지 JSON 파일이 아닙니다.");
          return;
        }
        const nextTemplate = snapshot.template ?? template;
        setTemplate(nextTemplate);
        saveTemplateToStorage(nextTemplate);
        setData(JSON.parse(JSON.stringify(snapshot.data)));
        saveToStorage(snapshot.data, nextTemplate);
        if (snapshot.template !== undefined) {
          alert(`작업 내용을 불러왔습니다. 템플릿 ${nextTemplate.toUpperCase()} 기준으로 이어서 편집할 수 있습니다.`);
        } else {
          alert("작업 내용을 불러왔습니다. 이어서 편집할 수 있습니다.");
        }
      } catch {
        alert("올바른 JSON 파일이 아닙니다.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleSaveSnapshot = async () => {
    setSavingSnapshot(true);
    try {
      await downloadEditorSnapshot(data, template);
      alert("작업이 파일로 저장되었습니다. 나중에 '가져오기'로 불러와 이어서 편집할 수 있습니다.");
    } catch (err) {
      alert("저장 중 오류가 났습니다. 다시 시도해 주세요.");
    } finally {
      setSavingSnapshot(false);
    }
  };

  const handleReset = () => {
    if (confirm("새로 만들기 하시겠습니까? 현재 템플릿의 편집 내용이 초기화됩니다.")) {
      const fresh = JSON.parse(JSON.stringify(dummyData));
      setData(fresh);
      clearStorage(template);
      saveToStorage(fresh, template);
    }
  };

  const handleSaveToSupabase = async () => {
    setSavingToSupabase(true);
    try {
      const exportData = await prepareForExportCompressed(data);
      const templateType = template.toUpperCase() as "A" | "B" | "C";
      const ownerToken = crypto.randomUUID();
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: exportData,
          template_type: templateType,
          status: "pending",
          owner_token: ownerToken,
        }),
      });

      const result = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 413) {
          alert(
            "저장 실패: 전송 데이터가 너무 큽니다.\n\n" +
            "이미지가 많거나 용량이 크면 Supabase 저장 시 제한을 넘깁니다.\n\n" +
            "• 이미지 개수를 줄이거나, 해상도를 낮춰 다시 시도해 보세요.\n" +
            "• 또는 상단 '작업 저장' 버튼으로 JSON 파일로 저장해 두셔도 됩니다."
          );
        } else {
          alert(`저장 실패: ${result.error || res.status}\n\nsupabase-setup.sql을 실행했는지 확인해 주세요.`);
        }
        return;
      }

      await navigator.clipboard.writeText(`${window.location.origin}/view/${result.id}`);
      alert("저장 완료!\n관리자 페이지에서 승인 후 링크를 확인·전달할 수 있습니다.");
    } finally {
      setSavingToSupabase(false);
    }
  };

  return (
    <div className="flex h-screen min-h-0 overflow-hidden [&_a]:cursor-pointer [&_button]:cursor-pointer [&_button:disabled]:cursor-not-allowed">
      {/* 상단 GNB(components/Header)에서 호출하기 위한 숨김 트리거들 */}
      <input
        id="editor-import-file"
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleImport}
        className="hidden"
      />
      <button
        id="editor-reset-btn"
        type="button"
        onClick={handleReset}
        className="hidden"
      />
      <button
        id="editor-save-btn"
        type="button"
        onClick={handleSaveSnapshot}
        disabled={savingSnapshot}
        className="hidden"
      />
      {/* 왼쪽: 편집 폼 */}
      <div className="flex min-h-0 w-1/2 flex-col overflow-y-auto border-r border-gray-200 bg-[#f4f7fb] p-8">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="hidden text-sm text-[#6a5acd] hover:underline"
            >
              미리보기로 돌아가기
            </Link>
          </div>
          {savedAt && (
            <p className="mt-1 text-xs text-gray-500">
              자동 저장됨 {savedAt.toLocaleTimeString("ko-KR")}
            </p>
          )}
        </div>

        <div className="mb-4 rounded-2xl border border-gray-200 bg-white/70 p-3 shadow-sm backdrop-blur">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-800">템플릿</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {(["a", "b", "c", "d"] as const).map((t) => {
              const isLocked = t === "c" && TEMPLATE_C_LOCKED;
              const isActive = template === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => !isLocked && handleTemplateChange(t)}
                  disabled={isLocked}
                  className={`inline-flex flex-1 items-center justify-center rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-[#6a5acd] text-white shadow-sm hover:bg-[#5a4abd]"
                      : "bg-white text-gray-800 ring-1 ring-gray-200 hover:bg-gray-50"
                  } ${isLocked ? "cursor-not-allowed opacity-60" : ""}`}
                >
                  {t.toUpperCase()}
                </button>
              );
            })}
          </div>
        </div>

        <ImageSizeGuide />

        {/* Hero */}
        <section className="mb-8 shrink-0 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex items-center justify-between bg-[#6a5acd] px-6 py-4">
            <h2 className="text-lg font-semibold text-white">Hero</h2>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => scrollToPreview("preview-section-hero")}
                className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/25"
              >
                위치 이동
              </button>
              <button
                type="button"
                onClick={() => toggleSection("hero")}
                aria-label={openSections.hero ? "Hero 접기" : "Hero 펼치기"}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
              >
                <ChevronDown
                  className={`size-4 transition-transform ${
                    openSections.hero ? "rotate-0" : "-rotate-90"
                  }`}
                />
              </button>
            </div>
          </div>
          {openSections.hero ? (
            <div className="space-y-4 p-6">
            <div className="relative">
              <textarea
                placeholder="제목 (Enter로 줄바꿈 가능)"
                rows={2}
                value={data.hero.title ?? ""}
                onChange={(e) => updateNested("hero", "title", e.target.value)}
                className="w-full rounded-xl border-2 border-transparent bg-gray-50 px-4 py-3.5 pr-20 text-sm transition-all hover:bg-gray-100 focus:border-[#6a5acd] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#6a5acd]/10"
              />
              <div
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-400"
                aria-hidden="true"
              >
                {(data.hero.title ?? "").length}자
              </div>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="하이라이트 텍스트"
                value={data.hero.highlightText ?? ""}
                onChange={(e) =>
                  updateNested("hero", "highlightText", e.target.value)
                }
                className="w-full rounded-xl border-2 border-transparent bg-gray-50 px-4 py-3.5 pr-20 text-sm transition-all hover:bg-gray-100 focus:border-[#6a5acd] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#6a5acd]/10"
              />
              <div
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-400"
                aria-hidden="true"
              >
                {(data.hero.highlightText ?? "").length}자
              </div>
            </div>
            <ImageUploadField
              label="메인 이미지"
              hint={template === "c" ? "(권장: 1920×1080 또는 고해상도 이미지)" : "(권장: 800×600 ~ 1200×800 가로형)"}
              onChange={heroImageHandler}
            />
          </div>
          ) : null}
        </section>

        {/* FactCheck */}
        <section className="mb-8 shrink-0 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div
            className={`flex items-center justify-between px-6 py-4 ${
              factCheckOn ? "bg-[#6a5acd]" : "bg-gray-200"
            }`}
          >
            <h2
              className={`text-lg font-semibold ${
                factCheckOn ? "text-white" : "text-gray-800"
              }`}
            >
              팩트 체크
            </h2>
            <div className="flex items-center gap-3">
              <SectionVisibilityToggle
                id="editor-section-factcheck"
                checked={factCheckOn}
                onCheckedChange={(v) => updateNested("factCheck", "enabled", v)}
                tone={factCheckOn ? "dark" : "light"}
              />
              <button
              type="button"
              onClick={() => scrollToPreview("preview-section-factcheck")}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                factCheckOn
                  ? "bg-white/15 text-white hover:bg-white/25"
                  : "bg-white/60 text-gray-700 ring-1 ring-gray-200 hover:bg-white/80"
              }`}
            >
                위치 이동
              </button>
              <button
                type="button"
                onClick={() => toggleSection("factCheck")}
                aria-label={
                  openSections.factCheck ? "팩트 체크 접기" : "팩트 체크 펼치기"
                }
                className={`inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                  factCheckOn
                    ? "bg-white/15 text-white hover:bg-white/25"
                    : "bg-white/60 text-gray-700 ring-1 ring-gray-200 hover:bg-white/80"
                }`}
              >
                <ChevronDown
                  className={`size-4 transition-transform ${
                    openSections.factCheck ? "rotate-0" : "-rotate-90"
                  }`}
                />
              </button>
            </div>
          </div>
          {openSections.factCheck ? (
            <div className="space-y-4 p-6">
            <div className="relative">
              <input
                type="text"
                placeholder="섹션 제목"
                value={data.factCheck.sectionTitle ?? ""}
                onChange={(e) =>
                  updateNested("factCheck", "sectionTitle", e.target.value)
                }
                className="w-full rounded-xl border-2 border-transparent bg-gray-50 px-4 py-3.5 pr-20 text-sm transition-all hover:bg-gray-100 focus:border-[#6a5acd] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#6a5acd]/10"
              />
              <div
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-400"
                aria-hidden="true"
              >
                {(data.factCheck.sectionTitle ?? "").length}자
              </div>
            </div>
            {data.factCheck.items.map((item, i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.03)]"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-200">
                    항목 {i + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => openConfirm(() => removeFactItem(i))}
                    className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-white px-2.5 py-1 text-xs font-medium text-red-500 transition-colors hover:bg-red-50"
                  >
                    <Trash2 className="size-3.5" />
                    삭제
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder={`항목 ${i + 1}`}
                    value={item.text ?? ""}
                    onChange={(e) => {
                      const next = [...data.factCheck.items];
                      next[i] = { text: e.target.value };
                      updateNested("factCheck", "items", next);
                    }}
                    className="w-full rounded-xl border-2 border-transparent bg-gray-50 px-4 py-3.5 pr-20 text-sm transition-all hover:bg-gray-100 focus:border-[#6a5acd] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#6a5acd]/10"
                  />
                  <div
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-400"
                    aria-hidden="true"
                  >
                    {(item.text ?? "").length}자
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addFactItem}
              className="mt-1 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[#6a5acd]/35 bg-white py-3 text-sm font-medium text-[#6a5acd] transition-all hover:border-[#6a5acd] hover:bg-[#6a5acd]/5"
            >
              <Plus className="size-4" />
              항목 추가
            </button>
          </div>
          ) : null}
        </section>

        {/* Overview */}
        <section className="mb-8 shrink-0 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div
            className={`flex items-center justify-between px-6 py-4 ${
              overviewOn ? "bg-[#6a5acd]" : "bg-gray-200"
            }`}
          >
            <h2
              className={`text-lg font-semibold ${
                overviewOn ? "text-white" : "text-gray-800"
              }`}
            >
              사업 개요
            </h2>
            <div className="flex items-center gap-3">
              <SectionVisibilityToggle
                id="editor-section-overview"
                checked={overviewOn}
                onCheckedChange={(v) => updateNested("overview", "enabled", v)}
                tone={overviewOn ? "dark" : "light"}
              />
              <button
              type="button"
              onClick={() => scrollToPreview("preview-section-overview")}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                overviewOn
                  ? "bg-white/15 text-white hover:bg-white/25"
                  : "bg-white/60 text-gray-700 ring-1 ring-gray-200 hover:bg-white/80"
              }`}
            >
                위치 이동
              </button>
              <button
                type="button"
                onClick={() => toggleSection("overview")}
                aria-label={
                  openSections.overview ? "사업 개요 접기" : "사업 개요 펼치기"
                }
                className={`inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                  overviewOn
                    ? "bg-white/15 text-white hover:bg-white/25"
                    : "bg-white/60 text-gray-700 ring-1 ring-gray-200 hover:bg-white/80"
                }`}
              >
                <ChevronDown
                  className={`size-4 transition-transform ${
                    openSections.overview ? "rotate-0" : "-rotate-90"
                  }`}
                />
              </button>
            </div>
          </div>
          {openSections.overview ? (
            <div className="space-y-4 p-6">
            <div className="relative">
              <input
                type="text"
                placeholder="프로젝트명"
                value={data.overview.projectName ?? ""}
                onChange={(e) =>
                  updateNested("overview", "projectName", e.target.value)
                }
                className="w-full rounded-xl border-2 border-transparent bg-gray-50 px-4 py-3.5 pr-20 text-sm transition-all hover:bg-gray-100 focus:border-[#6a5acd] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#6a5acd]/10"
              />
              <div
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-400"
                aria-hidden="true"
              >
                {(data.overview.projectName ?? "").length}자
              </div>
            </div>
            <ImageUploadField
              label="개요 이미지"
              hint={template === "c" ? "(권장: 16:9 비율)" : "(권장: 800×600 4:3)"}
              onChange={overviewImageHandler}
            />
            {data.overview.details.map((d, i) => (
              <div key={i} className="flex gap-2">
                <div className="relative w-24 shrink-0">
                  <input
                    type="text"
                    placeholder="라벨"
                    value={d.label ?? ""}
                    onChange={(e) => {
                      const next = [...data.overview.details];
                      next[i] = { ...next[i], label: e.target.value };
                      updateNested("overview", "details", next);
                    }}
                    className="w-full rounded-xl border-2 border-transparent bg-gray-50 px-4 py-3 text-sm transition-all hover:bg-gray-100 focus:border-[#6a5acd] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#6a5acd]/10"
                  />
                </div>
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="값"
                    value={d.value ?? ""}
                    onChange={(e) => {
                      const next = [...data.overview.details];
                      next[i] = { ...next[i], value: e.target.value };
                      updateNested("overview", "details", next);
                    }}
                    className="w-full rounded-xl border-2 border-transparent bg-gray-50 px-4 py-3.5 text-sm transition-all hover:bg-gray-100 focus:border-[#6a5acd] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#6a5acd]/10"
                  />
                </div>
              </div>
            ))}
          </div>
          ) : null}
        </section>

        {/* Location - 입지환경 (동적 배열) */}
        <section className="mb-8 shrink-0 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div
            className={`flex items-center justify-between px-6 py-4 ${
              locationOn ? "bg-[#6a5acd]" : "bg-gray-200"
            }`}
          >
            <h2
              className={`text-lg font-semibold ${
                locationOn ? "text-white" : "text-gray-800"
              }`}
            >
              입지환경
            </h2>
            <div className="flex items-center gap-3">
              <SectionVisibilityToggle
                id="editor-section-location"
                checked={locationOn}
                onCheckedChange={(v) => updateNested("location", "enabled", v)}
                tone={locationOn ? "dark" : "light"}
              />
              <button
              type="button"
              onClick={() => scrollToPreview("preview-section-location")}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  locationOn
                    ? "bg-white/15 text-white hover:bg-white/25"
                    : "bg-white/60 text-gray-700 ring-1 ring-gray-200 hover:bg-white/80"
                }`}
            >
                위치 이동
              </button>
              <button
                type="button"
                onClick={() => toggleSection("location")}
                aria-label={
                  openSections.location ? "입지환경 접기" : "입지환경 펼치기"
                }
                className={`inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                  locationOn
                    ? "bg-white/15 text-white hover:bg-white/25"
                    : "bg-white/60 text-gray-700 ring-1 ring-gray-200 hover:bg-white/80"
                }`}
              >
                <ChevronDown
                  className={`size-4 transition-transform ${
                    openSections.location ? "rotate-0" : "-rotate-90"
                  }`}
                />
              </button>
            </div>
          </div>
          {openSections.location ? (
            <div className="space-y-4 p-6">
            <ImageUploadField
              label="지도 이미지"
              hint={template === "c" ? "(권장: 4:3 비율)" : "(권장: 800×600 4:3)"}
              onChange={mapImageHandler}
            />
            {data.location.sections.map((sec, i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-100 bg-[#f9fafc] p-5"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-200">
                    항목 {i + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => openConfirm(() => removeLocationSection(i))}
                    className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-white px-2.5 py-1 text-xs font-medium text-red-500 transition-colors hover:bg-red-50"
                  >
                    <Trash2 className="size-3.5" />
                    삭제
                  </button>
                </div>
                <div className="space-y-2 rounded-xl border border-gray-200 bg-white p-3.5 shadow-[0_2px_10px_rgba(15,23,42,0.03)]">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="라벨 (예: 교통환경)"
                      value={sec.label ?? ""}
                      onChange={(e) => {
                        const next = [...data.location.sections];
                        next[i] = { ...next[i], label: e.target.value };
                        updateNested("location", "sections", next);
                      }}
                      className="w-full rounded-xl border-2 border-transparent bg-gray-50 px-4 py-3 pr-20 text-sm transition-all hover:bg-gray-100 focus:border-[#6a5acd] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#6a5acd]/10"
                    />
                    <div
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-400"
                      aria-hidden="true"
                    >
                      {(sec.label ?? "").length}자
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="제목"
                      value={sec.title ?? ""}
                      onChange={(e) => {
                        const next = [...data.location.sections];
                        next[i] = { ...next[i], title: e.target.value };
                        updateNested("location", "sections", next);
                      }}
                      className="w-full rounded-xl border-2 border-transparent bg-gray-50 px-4 py-3 pr-20 text-sm transition-all hover:bg-gray-100 focus:border-[#6a5acd] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#6a5acd]/10"
                    />
                    <div
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-400"
                      aria-hidden="true"
                    >
                      {(sec.title ?? "").length}자
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="설명"
                      value={sec.description ?? ""}
                      onChange={(e) => {
                        const next = [...data.location.sections];
                        next[i] = {
                          ...next[i],
                          description: e.target.value,
                        };
                        updateNested("location", "sections", next);
                      }}
                      className="w-full rounded-xl border-2 border-transparent bg-gray-50 px-4 py-3 pr-20 text-sm transition-all hover:bg-gray-100 focus:border-[#6a5acd] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#6a5acd]/10"
                    />
                    <div
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-400"
                      aria-hidden="true"
                    >
                      {(sec.description ?? "").length}자
                    </div>
                  </div>
                  <ImageUploadField
                    label="이미지"
                    hint="(권장: 1:1 비율)"
                    compact
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const url = URL.createObjectURL(file);
                      setData((prev) => {
                        const next = [...prev.location.sections];
                        next[i] = { ...next[i], imageURL: url };
                        return {
                          ...prev,
                          location: {
                            ...prev.location,
                            sections: next,
                          },
                        };
                      });
                    }}
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addLocationSection}
              className="mt-1 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[#6a5acd]/35 bg-white py-3 text-sm font-medium text-[#6a5acd] transition-all hover:border-[#6a5acd] hover:bg-[#6a5acd]/5"
            >
              <Plus className="size-4" />
              입지환경 항목 추가
            </button>
          </div>
          ) : null}
        </section>

        {/* Development */}
        <section className="mb-8 shrink-0 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div
            className={`flex items-center justify-between px-6 py-4 ${
              developmentOn ? "bg-[#6a5acd]" : "bg-gray-200"
            }`}
          >
            <h2
              className={`text-lg font-semibold ${
                developmentOn ? "text-white" : "text-gray-800"
              }`}
            >
              대규모 개발호재
            </h2>
            <div className="flex items-center gap-3">
              <SectionVisibilityToggle
                id="editor-section-development"
                checked={developmentOn}
                onCheckedChange={(v) =>
                  updateNested("development", "enabled", v)
                }
                tone={developmentOn ? "dark" : "light"}
              />
              <button
              type="button"
              onClick={() => scrollToPreview("preview-section-development")}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                developmentOn
                  ? "bg-white/15 text-white hover:bg-white/25"
                  : "bg-white/60 text-gray-700 ring-1 ring-gray-200 hover:bg-white/80"
              }`}
            >
                위치 이동
              </button>
              <button
                type="button"
                onClick={() => toggleSection("development")}
                aria-label={
                  openSections.development
                    ? "대규모 개발호재 접기"
                    : "대규모 개발호재 펼치기"
                }
                className={`inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                  developmentOn
                    ? "bg-white/15 text-white hover:bg-white/25"
                    : "bg-white/60 text-gray-700 ring-1 ring-gray-200 hover:bg-white/80"
                }`}
              >
                <ChevronDown
                  className={`size-4 transition-transform ${
                    openSections.development ? "rotate-0" : "-rotate-90"
                  }`}
                />
              </button>
            </div>
          </div>
          {openSections.development ? (
            <div className="space-y-4 p-6">
            <div className="relative">
              <input
                type="text"
                placeholder="부제목"
                value={data.development.subtitle ?? ""}
                onChange={(e) =>
                  updateNested("development", "subtitle", e.target.value)
                }
                className="w-full rounded-xl border-2 border-transparent bg-gray-50 px-4 py-3.5 pr-20 text-sm transition-all hover:bg-gray-100 focus:border-[#6a5acd] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#6a5acd]/10"
              />
              <div
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-400"
                aria-hidden="true"
              >
                {(data.development.subtitle ?? "").length}자
              </div>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="설명"
                value={data.development.description ?? ""}
                onChange={(e) =>
                  updateNested("development", "description", e.target.value)
                }
                className="w-full rounded-xl border-2 border-transparent bg-gray-50 px-4 py-3.5 pr-20 text-sm transition-all hover:bg-gray-100 focus:border-[#6a5acd] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#6a5acd]/10"
              />
              <div
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-400"
                aria-hidden="true"
              >
                {(data.development.description ?? "").length}자
              </div>
            </div>
            {template !== "b" && (
              <div className="rounded-2xl border border-gray-100 bg-[#f9fafc] p-4">
                <ImageUploadField
                  label="지도 이미지"
                  hint="(권장: 800×600 4:3)"
                  compact
                  onChange={devMapHandler}
                />
              </div>
            )}
            {data.development.images.map((img, i) => (
              <div key={i} className="rounded-2xl border border-gray-100 bg-[#f9fafc] p-5">
                <div className="mb-3 flex items-center justify-between">
                  <span className="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-200">
                    이미지 {i + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => openConfirm(() => removeDevelopmentImage(i))}
                    className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-white px-2.5 py-1 text-xs font-medium text-red-500 transition-colors hover:bg-red-50"
                  >
                    <Trash2 className="size-3.5" />
                    삭제
                  </button>
                </div>
                <div className="space-y-2 rounded-xl border border-gray-200 bg-white p-3.5 shadow-[0_2px_10px_rgba(15,23,42,0.03)]">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="라벨 (예: 개발환경)"
                      value={img.label ?? ""}
                      onChange={(e) => {
                        const next = [...data.development.images];
                        next[i] = { ...next[i], label: e.target.value };
                        updateNested("development", "images", next);
                      }}
                      className="mb-2 w-full rounded-xl border-2 border-transparent bg-gray-50 px-4 py-3 pr-20 text-sm transition-all hover:bg-gray-100 focus:border-[#6a5acd] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#6a5acd]/10"
                    />
                    <div
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-400"
                      aria-hidden="true"
                    >
                      {(img.label ?? "").length}자
                    </div>
                  </div>
                  <ImageUploadField
                    label="개발환경 이미지"
                    hint={template === "c" ? "(권장: 1:1 비율)" : "(권장: 800×600 4:3)"}
                    compact
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const url = URL.createObjectURL(file);
                      setData((prev) => {
                        const next = [...prev.development.images];
                        next[i] = { ...next[i], imageURL: url };
                        return {
                          ...prev,
                          development: { ...prev.development, images: next },
                        };
                      });
                    }}
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addDevelopmentImage}
              className="mt-1 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[#6a5acd]/35 bg-white py-3 text-sm font-medium text-[#6a5acd] transition-all hover:border-[#6a5acd] hover:bg-[#6a5acd]/5"
            >
              <Plus className="size-4" />
              개발환경 이미지 추가
            </button>
            </div>
          ) : null}
        </section>

        {/* Facilities - 단지 내부 시설 (POINT 4) */}
        <section className="mb-8 shrink-0 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div
            className={`flex items-center justify-between px-6 py-4 ${
              facilitiesOn ? "bg-[#6a5acd]" : "bg-gray-200"
            }`}
          >
            <h2
              className={`text-lg font-semibold ${
                facilitiesOn ? "text-white" : "text-gray-800"
              }`}
            >
              단지 내부 시설 (POINT 4)
            </h2>
            <div className="flex items-center gap-3">
              <SectionVisibilityToggle
                id="editor-section-facilities"
                checked={facilitiesOn}
                onCheckedChange={(v) =>
                  updateNested("facilities", "enabled", v)
                }
                tone={facilitiesOn ? "dark" : "light"}
              />
              <button
                type="button"
                onClick={() => scrollToPreview("preview-section-facilities")}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  facilitiesOn
                    ? "bg-white/15 text-white hover:bg-white/25"
                    : "bg-white/60 text-gray-700 ring-1 ring-gray-200 hover:bg-white/80"
                }`}
            >
                위치 이동
              </button>
              <button
                type="button"
                onClick={() => toggleSection("facilities")}
                aria-label={
                  openSections.facilities
                    ? "단지 내부 시설 접기"
                    : "단지 내부 시설 펼치기"
                }
                className={`inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                  facilitiesOn
                    ? "bg-white/15 text-white hover:bg-white/25"
                    : "bg-white/60 text-gray-700 ring-1 ring-gray-200 hover:bg-white/80"
                }`}
              >
                <ChevronDown
                  className={`size-4 transition-transform ${
                    openSections.facilities ? "rotate-0" : "-rotate-90"
                  }`}
                />
              </button>
            </div>
          </div>
          {openSections.facilities ? (
            <div className="space-y-4 p-6">
            <div className="relative">
              <input
                type="text"
                placeholder="섹션 제목"
                value={data.facilities.sectionTitle ?? ""}
                onChange={(e) =>
                  updateNested("facilities", "sectionTitle", e.target.value)
                }
                className="w-full rounded-xl border-2 border-transparent bg-gray-50 px-4 py-3.5 pr-20 text-sm transition-all hover:bg-gray-100 focus:border-[#6a5acd] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#6a5acd]/10"
              />
              <div
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-400"
                aria-hidden="true"
              >
                {(data.facilities.sectionTitle ?? "").length}자
              </div>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="부제목"
                value={data.facilities.subtitle ?? ""}
                onChange={(e) =>
                  updateNested("facilities", "subtitle", e.target.value)
                }
                className="w-full rounded-xl border-2 border-transparent bg-gray-50 px-4 py-3.5 pr-20 text-sm transition-all hover:bg-gray-100 focus:border-[#6a5acd] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#6a5acd]/10"
              />
              <div
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-400"
                aria-hidden="true"
              >
                {(data.facilities.subtitle ?? "").length}자
              </div>
            </div>
            {data.facilities.items.map((item, i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-100 bg-[#f9fafc] p-5"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-200">
                    시설 {i + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => openConfirm(() => removeFacilityItem(i))}
                    className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-white px-2.5 py-1 text-xs font-medium text-red-500 transition-colors hover:bg-red-50"
                  >
                    <Trash2 className="size-3.5" />
                    삭제
                  </button>
                </div>
                <div className="space-y-2 rounded-xl border border-gray-200 bg-white p-3.5 shadow-[0_2px_10px_rgba(15,23,42,0.03)]">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="라벨 (예: 피트니스)"
                      value={item.label ?? ""}
                      onChange={(e) => {
                        const next = [...data.facilities.items];
                        next[i] = { ...next[i], label: e.target.value };
                        updateNested("facilities", "items", next);
                      }}
                      className="w-full rounded-xl border-2 border-transparent bg-gray-50 px-4 py-3 pr-20 text-sm transition-all hover:bg-gray-100 focus:border-[#6a5acd] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#6a5acd]/10"
                    />
                    <div
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-400"
                      aria-hidden="true"
                    >
                      {(item.label ?? "").length}자
                    </div>
                  </div>
                  <ImageUploadField
                    label="이미지"
                    hint="(권장: 300×300 정사각형)"
                    compact
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const url = URL.createObjectURL(file);
                      setData((prev) => {
                        const next = [...prev.facilities.items];
                        next[i] = { ...next[i], imageURL: url };
                        return {
                          ...prev,
                          facilities: { ...prev.facilities, items: next },
                        };
                      });
                    }}
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addFacilityItem}
              className="mt-1 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[#6a5acd]/35 bg-white py-3 text-sm font-medium text-[#6a5acd] transition-all hover:border-[#6a5acd] hover:bg-[#6a5acd]/5"
            >
              <Plus className="size-4" />
              시설 항목 추가
            </button>
            </div>
          ) : null}
        </section>

        {/* Interior - 내부 인테리어 (POINT 5) */}
        <section className="mb-8 shrink-0 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div
            className={`flex items-center justify-between px-6 py-4 ${
              interiorOn ? "bg-[#6a5acd]" : "bg-gray-200"
            }`}
          >
            <h2
              className={`text-lg font-semibold ${
                interiorOn ? "text-white" : "text-gray-800"
              }`}
            >
              내부 인테리어 (POINT 5)
            </h2>
            <div className="flex items-center gap-3">
              <SectionVisibilityToggle
                id="editor-section-interior"
                checked={interiorOn}
                onCheckedChange={(v) =>
                  updateNested("interior", "enabled", v)
                }
                tone={interiorOn ? "dark" : "light"}
              />
              <button
                type="button"
                onClick={() => scrollToPreview("preview-section-interior")}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  interiorOn
                    ? "bg-white/15 text-white hover:bg-white/25"
                    : "bg-white/60 text-gray-700 ring-1 ring-gray-200 hover:bg-white/80"
                }`}
              >
                위치 이동
              </button>
              <button
                type="button"
                onClick={() => toggleSection("interior")}
                aria-label={
                  openSections.interior ? "내부 인테리어 접기" : "내부 인테리어 펼치기"
                }
                className={`inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                  interiorOn
                    ? "bg-white/15 text-white hover:bg-white/25"
                    : "bg-white/60 text-gray-700 ring-1 ring-gray-200 hover:bg-white/80"
                }`}
              >
                <ChevronDown
                  className={`size-4 transition-transform ${
                    openSections.interior ? "rotate-0" : "-rotate-90"
                  }`}
                />
              </button>
            </div>
          </div>
          {openSections.interior ? (
            <div className="space-y-4 p-6">
            <div className="relative">
              <input
                type="text"
                placeholder="섹션 제목"
                value={data.interior.sectionTitle ?? ""}
                onChange={(e) =>
                  updateNested("interior", "sectionTitle", e.target.value)
                }
                className="w-full rounded-xl border-2 border-transparent bg-gray-50 px-4 py-3.5 pr-20 text-sm transition-all hover:bg-gray-100 focus:border-[#6a5acd] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#6a5acd]/10"
              />
              <div
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-400"
                aria-hidden="true"
              >
                {(data.interior.sectionTitle ?? "").length}자
              </div>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="부제목"
                value={data.interior.subtitle ?? ""}
                onChange={(e) =>
                  updateNested("interior", "subtitle", e.target.value)
                }
                className="w-full rounded-xl border-2 border-transparent bg-gray-50 px-4 py-3.5 pr-20 text-sm transition-all hover:bg-gray-100 focus:border-[#6a5acd] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#6a5acd]/10"
              />
              <div
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-400"
                aria-hidden="true"
              >
                {(data.interior.subtitle ?? "").length}자
              </div>
            </div>
            {data.interior.rooms.map((room, i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-100 bg-[#f9fafc] p-5"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-200">
                    공간 {i + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => openConfirm(() => removeInteriorRoom(i))}
                    className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-white px-2.5 py-1 text-xs font-medium text-red-500 transition-colors hover:bg-red-50"
                  >
                    <Trash2 className="size-3.5" />
                    삭제
                  </button>
                </div>
                <div className="space-y-2 rounded-xl border border-gray-200 bg-white p-3.5 shadow-[0_2px_10px_rgba(15,23,42,0.03)]">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="라벨 (예: 거실)"
                      value={room.label ?? ""}
                      onChange={(e) => {
                        const next = [...data.interior.rooms];
                        next[i] = { ...next[i], label: e.target.value };
                        updateNested("interior", "rooms", next);
                      }}
                      className="w-full rounded-xl border-2 border-transparent bg-gray-50 px-4 py-3 pr-20 text-sm transition-all hover:bg-gray-100 focus:border-[#6a5acd] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#6a5acd]/10"
                    />
                    <div
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-400"
                      aria-hidden="true"
                    >
                      {(room.label ?? "").length}자
                    </div>
                  </div>
                  <ImageUploadField
                    label="이미지"
                    hint="(권장: 300×300 정사각형)"
                    compact
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const url = URL.createObjectURL(file);
                      setData((prev) => {
                        const next = [...prev.interior.rooms];
                        next[i] = { ...next[i], imageURL: url };
                        return {
                          ...prev,
                          interior: { ...prev.interior, rooms: next },
                        };
                      });
                    }}
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addInteriorRoom}
              className="mt-1 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[#6a5acd]/35 bg-white py-3 text-sm font-medium text-[#6a5acd] transition-all hover:border-[#6a5acd] hover:bg-[#6a5acd]/5"
            >
              <Plus className="size-4" />
              공간 항목 추가
            </button>
            </div>
          ) : null}
        </section>

        {/* FloorPlan - 주요 타입 안내 (POINT 6) */}
        <section className="mb-8 shrink-0 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div
            className={`flex items-center justify-between px-6 py-4 ${
              floorPlanOn ? "bg-[#6a5acd]" : "bg-gray-200"
            }`}
          >
            <h2
              className={`text-lg font-semibold ${
                floorPlanOn ? "text-white" : "text-gray-800"
              }`}
            >
              주요 타입 안내 (POINT 6)
            </h2>
            <div className="flex items-center gap-3">
              <SectionVisibilityToggle
                id="editor-section-floorplan"
                checked={floorPlanOn}
                onCheckedChange={(v) =>
                  updateNested("floorPlan", "enabled", v)
                }
                tone={floorPlanOn ? "dark" : "light"}
              />
              <button
                type="button"
                onClick={() =>
                  scrollToPreview("preview-section-floorplan")
                }
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  floorPlanOn
                    ? "bg-white/15 text-white hover:bg-white/25"
                    : "bg-white/60 text-gray-700 ring-1 ring-gray-200 hover:bg-white/80"
                }`}
              >
                위치 이동
              </button>
              <button
                type="button"
                onClick={() => toggleSection("floorPlan")}
                aria-label={
                  openSections.floorPlan
                    ? "주요 타입 안내 접기"
                    : "주요 타입 안내 펼치기"
                }
                className={`inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                  floorPlanOn
                    ? "bg-white/15 text-white hover:bg-white/25"
                    : "bg-white/60 text-gray-700 ring-1 ring-gray-200 hover:bg-white/80"
                }`}
              >
                <ChevronDown
                  className={`size-4 transition-transform ${
                    openSections.floorPlan ? "rotate-0" : "-rotate-90"
                  }`}
                />
              </button>
            </div>
          </div>
          {openSections.floorPlan ? (
            <div className="space-y-4 p-6">
            <div className="relative">
              <input
                type="text"
                placeholder="섹션 제목"
                value={data.floorPlan.sectionTitle ?? ""}
                onChange={(e) =>
                  updateNested("floorPlan", "sectionTitle", e.target.value)
                }
                className="w-full rounded-xl border-2 border-transparent bg-gray-50 px-4 py-3.5 pr-20 text-sm transition-all hover:bg-gray-100 focus:border-[#6a5acd] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#6a5acd]/10"
              />
              <div
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-400"
                aria-hidden="true"
              >
                {(data.floorPlan.sectionTitle ?? "").length}자
              </div>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="부제목"
                value={data.floorPlan.subtitle ?? ""}
                onChange={(e) =>
                  updateNested("floorPlan", "subtitle", e.target.value)
                }
                className="w-full rounded-xl border-2 border-transparent bg-gray-50 px-4 py-3.5 pr-20 text-sm transition-all hover:bg-gray-100 focus:border-[#6a5acd] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#6a5acd]/10"
              />
              <div
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-400"
                aria-hidden="true"
              >
                {(data.floorPlan.subtitle ?? "").length}자
              </div>
            </div>
            {data.floorPlan.images.map((img, i) => (
              <div key={i} className="rounded-2xl border border-gray-100 bg-[#f9fafc] p-5">
                <div className="mb-3 flex items-center justify-between">
                  <span className="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-200">
                    평면도 {i + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => openConfirm(() => removeFloorPlanImage(i))}
                    className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-white px-2.5 py-1 text-xs font-medium text-red-500 transition-colors hover:bg-red-50"
                  >
                    <Trash2 className="size-3.5" />
                    삭제
                  </button>
                </div>
                <div className="space-y-2 rounded-xl border border-gray-200 bg-white p-3.5 shadow-[0_2px_10px_rgba(15,23,42,0.03)]">
                  <div className="relative">
                  <input
                    type="text"
                    placeholder="타입 명 (예: 59A)"
                    value={img.label ?? ""}
                    onChange={(e) => {
                      const next = [...data.floorPlan.images];
                      next[i] = { ...next[i], label: e.target.value };
                      updateNested("floorPlan", "images", next);
                    }}
                    className="mb-2 w-full rounded-xl border-2 border-transparent bg-gray-50 px-4 py-3 pr-20 text-sm transition-all hover:bg-gray-100 focus:border-[#6a5acd] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#6a5acd]/10"
                  />
                  <div
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-400"
                    aria-hidden="true"
                  >
                    {(img.label ?? "").length}자
                  </div>
                  </div>
                  <ImageUploadField
                    label={`평면도 ${i + 1}`}
                    hint={template === "c" ? "(권장: 400×300 4:3)" : "(권장: 400×300 4:3)"}
                    compact
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const url = URL.createObjectURL(file);
                      setData((prev) => {
                        const next = [...prev.floorPlan.images];
                        next[i] = { ...next[i], url };
                        return {
                          ...prev,
                          floorPlan: { ...prev.floorPlan, images: next },
                        };
                      });
                    }}
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addFloorPlanImage}
              className="mt-1 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[#6a5acd]/35 bg-white py-3 text-sm font-medium text-[#6a5acd] transition-all hover:border-[#6a5acd] hover:bg-[#6a5acd]/5"
            >
              <Plus className="size-4" />
              평면도 슬롯 추가
            </button>
          </div>
          ) : null}
        </section>

        {/* ContactForm */}
        <section className="mb-8 shrink-0 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex items-center justify-between bg-[#6a5acd] px-6 py-4">
            <h2 className="text-lg font-semibold text-white">관심고객 등록</h2>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => scrollToPreview("contact-form")}
                className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/25"
              >
                위치 이동
              </button>
              <button
                type="button"
                onClick={() => toggleSection("contactForm")}
                aria-label={
                  openSections.contactForm
                    ? "관심고객 등록 접기"
                    : "관심고객 등록 펼치기"
                }
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
              >
                <ChevronDown
                  className={`size-4 transition-transform ${
                    openSections.contactForm ? "rotate-0" : "-rotate-90"
                  }`}
                />
              </button>
            </div>
          </div>
          {openSections.contactForm ? (
            <div className="space-y-4 p-6">
            <div className="relative">
              <input
                type="text"
                placeholder="제목"
                value={data.contactForm.title ?? ""}
                onChange={(e) =>
                  updateNested("contactForm", "title", e.target.value)
                }
                className="w-full rounded-xl border-2 border-transparent bg-gray-50 px-4 py-3.5 pr-20 text-sm transition-all hover:bg-gray-100 focus:border-[#6a5acd] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#6a5acd]/10"
              />
              <div
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-400"
                aria-hidden="true"
              >
                {(data.contactForm.title ?? "").length}자
              </div>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="설명"
                value={data.contactForm.description ?? ""}
                onChange={(e) =>
                  updateNested("contactForm", "description", e.target.value)
                }
                className="w-full rounded-xl border-2 border-transparent bg-gray-50 px-4 py-3.5 pr-20 text-sm transition-all hover:bg-gray-100 focus:border-[#6a5acd] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#6a5acd]/10"
              />
              <div
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-400"
                aria-hidden="true"
              >
                {(data.contactForm.description ?? "").length}자
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">개인정보 책임자(법인명)</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="법인명 (예: OO건설 주식회사)"
                  value={data.contactForm.privacyContactName ?? ""}
                  onChange={(e) =>
                    updateNested("contactForm", "privacyContactName", e.target.value)
                  }
                  className="w-full rounded-xl border-2 border-transparent bg-gray-50 px-4 py-3.5 pr-20 text-sm transition-all hover:bg-gray-100 focus:border-[#6a5acd] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#6a5acd]/10"
                />
                <div
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-400"
                  aria-hidden="true"
                >
                  {(data.contactForm.privacyContactName ?? "").length}자
                </div>
              </div>
              <p className="mt-0.5 text-[10px] text-gray-500">미입력 시 기본값: 본 분양 사업 주체</p>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">플로팅 버튼 (오른쪽 고정)</label>
              <input
                type="tel"
                placeholder="전화번호 (예: 010-1234-5678)"
                value={data.contactForm.phoneNumber ?? ""}
                onChange={(e) =>
                  updateNested("contactForm", "phoneNumber", e.target.value)
                }
                className="mb-2 w-full rounded-xl border-2 border-transparent bg-gray-50 px-4 py-3.5 text-sm transition-all hover:bg-gray-100 focus:border-[#6a5acd] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#6a5acd]/10"
              />
              <input
                type="url"
                placeholder="카카오톡 상담 링크 (예: https://pf.kakao.com/_xxx/chat)"
                value={data.contactForm.kakaoLink ?? ""}
                onChange={(e) =>
                  updateNested("contactForm", "kakaoLink", e.target.value)
                }
                className="w-full rounded-xl border-2 border-transparent bg-gray-50 px-4 py-3.5 text-sm transition-all hover:bg-gray-100 focus:border-[#6a5acd] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#6a5acd]/10"
              />
            </div>
            </div>
          ) : null}
        </section>
      </div>

      {/* 오른쪽: 실시간 미리보기 */}
      <div className="flex min-h-0 w-1/2 flex-col overflow-y-auto overflow-x-hidden bg-gray-50 [overflow-anchor:none]">
        <div className="sticky top-0 z-10 border-b border-gray-200 bg-white px-4 py-2">
          <p className="text-sm font-medium text-gray-600">미리보기</p>
        </div>
        <div className="relative flex w-full min-h-0 items-start justify-center p-6">
          <div className="shadow-xl">
            <TemplatePreview template={template} data={data} />
          </div>
          <FloatingContactBar phoneNumber={data.contactForm?.phoneNumber} kakaoLink={data.contactForm?.kakaoLink} />
        </div>
      </div>
      <ConfirmDialog
        open={confirmOpen}
        title="삭제 확인"
        description="정말 삭제하시겠습니까?"
        confirmLabel="삭제"
        cancelLabel="취소"
        onConfirm={handleConfirm}
        onCancel={closeConfirm}
      />
    </div>
  );
}
