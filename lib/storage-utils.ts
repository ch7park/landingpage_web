import type { LandingPageData } from "@/types/landing-page";

const STORAGE_KEY_PREFIX = "hogang-landing-page-data";
const TEMPLATE_STORAGE_KEY = "hogang-landing-template";

export type TemplateType = "a" | "b" | "c" | "d";

function getStorageKey(template: TemplateType): string {
  return `${STORAGE_KEY_PREFIX}-${template}`;
}

/** blob URL을 base64 data URL로 변환 */
async function blobUrlToDataUrl(url: string): Promise<string> {
  if (!url.startsWith("blob:")) return url;
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return url;
  }
}

const DEFAULT_MAX_IMAGE_DIMENSION = 1200;
const DEFAULT_JPEG_QUALITY = 0.75;

/** 이미지 URL(blob 또는 data URL)을 지정한 해상도·품질로 압축한 data URL로 변환. 실패 시 원본 url 그대로 반환 */
function compressImageToDataUrl(
  url: string,
  maxDimension: number = DEFAULT_MAX_IMAGE_DIMENSION,
  quality: number = DEFAULT_JPEG_QUALITY
): Promise<string> {
  const isBlob = url.startsWith("blob:");
  const isDataImage = url.startsWith("data:image");
  if (!isBlob && !isDataImage) return Promise.resolve(url);

  return new Promise((resolve) => {
    const img = new Image();
    if (!isBlob && !isDataImage) {
      img.crossOrigin = "anonymous";
    }
    img.onload = () => {
      try {
        let w = img.naturalWidth;
        let h = img.naturalHeight;
        if (!w || !h) {
          resolve(url);
          return;
        }
        if (w <= maxDimension && h <= maxDimension) {
          const c = document.createElement("canvas");
          c.width = w;
          c.height = h;
          const g = c.getContext("2d");
          if (!g) {
            resolve(url);
            return;
          }
          g.fillStyle = "#ffffff";
          g.fillRect(0, 0, w, h);
          g.drawImage(img, 0, 0);
          const out = c.toDataURL("image/jpeg", quality);
          resolve(out && out.startsWith("data:") ? out : url);
          return;
        }
        if (w > h) {
          h = Math.round((h * maxDimension) / w);
          w = maxDimension;
        } else {
          w = Math.round((w * maxDimension) / h);
          h = maxDimension;
        }
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const g = canvas.getContext("2d");
        if (!g) {
          resolve(url);
          return;
        }
        g.fillStyle = "#ffffff";
        g.fillRect(0, 0, w, h);
        g.drawImage(img, 0, 0, w, h);
        const out = canvas.toDataURL("image/jpeg", quality);
        resolve(out && out.startsWith("data:") ? out : url);
      } catch {
        resolve(url);
      }
    };
    img.onerror = () => resolve(url);
    img.src = url;
  });
}

/** 데이터 내 모든 이미지 URL 중 blob을 base64로 변환 (내보내기용) */
export async function prepareForExport(
  data: LandingPageData
): Promise<LandingPageData> {
  const clone = JSON.parse(JSON.stringify(data)) as LandingPageData;

  const urls: string[] = [
    clone.hero.heroImageURL,
    clone.hero.hogangnonoLogoURL,
    clone.hero.zigbangLogoURL,
    clone.overview.overviewImageURL,
    clone.location.mapImageURL,
    ...clone.location.sections.map((s) => s.imageURL),
    clone.development.mapImageURL,
    ...clone.development.images.map((i) => i.imageURL),
    ...clone.facilities.items.map((i) => i.imageURL),
    ...clone.interior.rooms.map((r) => r.imageURL),
    ...clone.floorPlan.images.map((img) => (typeof img === "string" ? img : img.url)),
  ].filter(Boolean);

  const converted = new Map<string, string>();
  for (const url of urls) {
    if (url.startsWith("blob:")) {
      converted.set(url, await blobUrlToDataUrl(url));
    }
  }

  const replace = (obj: unknown): unknown => {
    if (typeof obj === "string" && converted.has(obj)) {
      return converted.get(obj)!;
    }
    if (Array.isArray(obj)) return obj.map(replace);
    if (obj && typeof obj === "object") {
      return Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [k, replace(v)])
      );
    }
    return obj;
  };

  return replace(clone) as LandingPageData;
}

/** Supabase 등 원격 저장용: 이미지 해상도·품질을 줄여 payload 크기 감소 (최대 1200px, JPEG 0.75) */
export async function prepareForExportCompressed(
  data: LandingPageData,
  options?: { maxDimension?: number; quality?: number }
): Promise<LandingPageData> {
  const clone = JSON.parse(JSON.stringify(data)) as LandingPageData;
  const maxDim = options?.maxDimension ?? DEFAULT_MAX_IMAGE_DIMENSION;
  const quality = options?.quality ?? DEFAULT_JPEG_QUALITY;

  const urls: string[] = [
    clone.hero.heroImageURL,
    clone.hero.hogangnonoLogoURL,
    clone.hero.zigbangLogoURL,
    clone.overview.overviewImageURL,
    clone.location.mapImageURL,
    ...clone.location.sections.map((s) => s.imageURL),
    clone.development.mapImageURL,
    ...clone.development.images.map((i) => i.imageURL),
    ...clone.facilities.items.map((i) => i.imageURL),
    ...clone.interior.rooms.map((r) => r.imageURL),
    ...clone.floorPlan.images.map((img) => (typeof img === "string" ? img : img.url)),
  ].filter(Boolean);

  const converted = new Map<string, string>();
  for (const url of urls) {
    if (url.startsWith("blob:") || url.startsWith("data:image")) {
      let result = await compressImageToDataUrl(url, maxDim, quality);
      if (result.startsWith("blob:")) {
        result = await blobUrlToDataUrl(result);
      }
      if (result && result.startsWith("data:")) {
        converted.set(url, result);
      }
    }
  }

  const replace = (obj: unknown): unknown => {
    if (typeof obj === "string" && converted.has(obj)) {
      return converted.get(obj)!;
    }
    if (Array.isArray(obj)) return obj.map(replace);
    if (obj && typeof obj === "object") {
      return Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [k, replace(v)])
      );
    }
    return obj;
  };

  return replace(clone) as LandingPageData;
}

/** 이전 버전 호환: 공통 키 (마이그레이션용) */
const LEGACY_STORAGE_KEY = "hogang-landing-page-data";

export function loadFromStorage(template?: TemplateType): LandingPageData | null {
  if (typeof window === "undefined") return null;
  const t: TemplateType = template === "a" || template === "b" || template === "c" || template === "d" ? template : "a";
  try {
    const key = getStorageKey(t);
    let raw = localStorage.getItem(key);
    // 이전 버전 호환: 템플릿별 데이터 없으면 공통 키에서 로드 (최초 1회)
    if (!raw && t === "a") {
      raw = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (raw) {
        localStorage.setItem(key, raw);
        localStorage.removeItem(LEGACY_STORAGE_KEY);
      }
    }
    if (!raw) return null;
    return JSON.parse(raw) as LandingPageData;
  } catch {
    return null;
  }
}

export function saveToStorage(data: LandingPageData, template: TemplateType): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(getStorageKey(template), JSON.stringify(data));
  } catch {
    // quota exceeded 등
  }
}

export function clearStorage(template?: TemplateType): void {
  if (typeof window === "undefined") return;
  if (template) {
    localStorage.removeItem(getStorageKey(template));
  } else {
    (["a", "b", "c", "d"] as const).forEach((t) => localStorage.removeItem(getStorageKey(t)));
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  }
  if (!template) localStorage.removeItem(TEMPLATE_STORAGE_KEY);
}

export function loadTemplateFromStorage(): TemplateType | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(TEMPLATE_STORAGE_KEY);
    if (!raw) return null;
    const t = raw as TemplateType;
    if (t === "a" || t === "b" || t === "c" || t === "d") return t;
    return null;
  } catch {
    return null;
  }
}

export function saveTemplateToStorage(template: TemplateType): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(TEMPLATE_STORAGE_KEY, template);
  } catch {}
}

export function downloadJson(data: LandingPageData, filename: string): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/** 편집기 작업 저장용 스냅샷: 가져오기 시 템플릿+데이터 복원 */
export interface EditorSnapshot {
  template: TemplateType;
  data: LandingPageData;
  /** 저장 시각 (표시용) */
  savedAt?: string;
}

/** 저장된 파일이 스냅샷 형식인지 확인 (template + data 있음) */
function isEditorSnapshot(obj: unknown): obj is EditorSnapshot {
  if (!obj || typeof obj !== "object") return false;
  const o = obj as Record<string, unknown>;
  const t = o.template;
  if (t !== "a" && t !== "b" && t !== "c" && t !== "d") return false;
  if (!o.data || typeof o.data !== "object") return false;
  const d = o.data as Record<string, unknown>;
  return "hero" in d && "overview" in d && "contactForm" in d;
}

/** 가져오기한 JSON 파싱: 스냅샷이면 template+data, 아니면 데이터만 반환 */
export function parseImportedFile(json: unknown): {
  template?: TemplateType;
  data: LandingPageData;
} | null {
  if (!json || typeof json !== "object") return null;
  if (isEditorSnapshot(json)) {
    return { template: json.template, data: json.data };
  }
  const o = json as Record<string, unknown>;
  if ("hero" in o && "overview" in o && "contactForm" in o) {
    return { data: json as LandingPageData };
  }
  return null;
}

/** 작업 저장: 이미지 blob → base64 변환 후 template+data 스냅샷으로 다운로드 (다른 기기에서 불러와도 그대로 복원 가능) */
export async function downloadEditorSnapshot(
  data: LandingPageData,
  template: TemplateType
): Promise<void> {
  const exportData = await prepareForExport(data);
  const snapshot: EditorSnapshot = {
    template,
    data: exportData,
    savedAt: new Date().toISOString(),
  };
  const filename = `hogang-editor-${template}-${Date.now()}.json`;
  const json = JSON.stringify(snapshot, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
