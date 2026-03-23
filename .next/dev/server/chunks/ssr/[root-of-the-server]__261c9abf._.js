module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/storage-utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearStorage",
    ()=>clearStorage,
    "downloadEditorSnapshot",
    ()=>downloadEditorSnapshot,
    "downloadJson",
    ()=>downloadJson,
    "loadFromStorage",
    ()=>loadFromStorage,
    "loadTemplateFromStorage",
    ()=>loadTemplateFromStorage,
    "parseImportedFile",
    ()=>parseImportedFile,
    "prepareForExport",
    ()=>prepareForExport,
    "prepareForExportCompressed",
    ()=>prepareForExportCompressed,
    "saveTemplateToStorage",
    ()=>saveTemplateToStorage,
    "saveToStorage",
    ()=>saveToStorage
]);
const STORAGE_KEY_PREFIX = "hogang-landing-page-data";
const TEMPLATE_STORAGE_KEY = "hogang-landing-template";
function getStorageKey(template) {
    return `${STORAGE_KEY_PREFIX}-${template}`;
}
/** blob URL을 base64 data URL로 변환 */ async function blobUrlToDataUrl(url) {
    if (!url.startsWith("blob:")) return url;
    try {
        const res = await fetch(url);
        const blob = await res.blob();
        return new Promise((resolve, reject)=>{
            const reader = new FileReader();
            reader.onload = ()=>resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch  {
        return url;
    }
}
const DEFAULT_MAX_IMAGE_DIMENSION = 1200;
const DEFAULT_JPEG_QUALITY = 0.75;
/** 이미지 URL(blob 또는 data URL)을 지정한 해상도·품질로 압축한 data URL로 변환. 실패 시 원본 url 그대로 반환 */ function compressImageToDataUrl(url, maxDimension = DEFAULT_MAX_IMAGE_DIMENSION, quality = DEFAULT_JPEG_QUALITY) {
    const isBlob = url.startsWith("blob:");
    const isDataImage = url.startsWith("data:image");
    if (!isBlob && !isDataImage) return Promise.resolve(url);
    return new Promise((resolve)=>{
        const img = new Image();
        if (!isBlob && !isDataImage) {
            img.crossOrigin = "anonymous";
        }
        img.onload = ()=>{
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
                    h = Math.round(h * maxDimension / w);
                    w = maxDimension;
                } else {
                    w = Math.round(w * maxDimension / h);
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
            } catch  {
                resolve(url);
            }
        };
        img.onerror = ()=>resolve(url);
        img.src = url;
    });
}
async function prepareForExport(data) {
    const clone = JSON.parse(JSON.stringify(data));
    const urls = [
        clone.hero.heroImageURL,
        clone.hero.hogangnonoLogoURL,
        clone.hero.zigbangLogoURL,
        clone.overview.overviewImageURL,
        clone.location.mapImageURL,
        ...clone.location.sections.map((s)=>s.imageURL),
        clone.development.mapImageURL,
        ...clone.development.images.map((i)=>i.imageURL),
        ...clone.facilities.items.map((i)=>i.imageURL),
        ...clone.interior.rooms.map((r)=>r.imageURL),
        ...clone.floorPlan.images.map((img)=>typeof img === "string" ? img : img.url)
    ].filter(Boolean);
    const converted = new Map();
    for (const url of urls){
        if (url.startsWith("blob:")) {
            converted.set(url, await blobUrlToDataUrl(url));
        }
    }
    const replace = (obj)=>{
        if (typeof obj === "string" && converted.has(obj)) {
            return converted.get(obj);
        }
        if (Array.isArray(obj)) return obj.map(replace);
        if (obj && typeof obj === "object") {
            return Object.fromEntries(Object.entries(obj).map(([k, v])=>[
                    k,
                    replace(v)
                ]));
        }
        return obj;
    };
    return replace(clone);
}
async function prepareForExportCompressed(data, options) {
    const clone = JSON.parse(JSON.stringify(data));
    const maxDim = options?.maxDimension ?? DEFAULT_MAX_IMAGE_DIMENSION;
    const quality = options?.quality ?? DEFAULT_JPEG_QUALITY;
    const urls = [
        clone.hero.heroImageURL,
        clone.hero.hogangnonoLogoURL,
        clone.hero.zigbangLogoURL,
        clone.overview.overviewImageURL,
        clone.location.mapImageURL,
        ...clone.location.sections.map((s)=>s.imageURL),
        clone.development.mapImageURL,
        ...clone.development.images.map((i)=>i.imageURL),
        ...clone.facilities.items.map((i)=>i.imageURL),
        ...clone.interior.rooms.map((r)=>r.imageURL),
        ...clone.floorPlan.images.map((img)=>typeof img === "string" ? img : img.url)
    ].filter(Boolean);
    const converted = new Map();
    for (const url of urls){
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
    const replace = (obj)=>{
        if (typeof obj === "string" && converted.has(obj)) {
            return converted.get(obj);
        }
        if (Array.isArray(obj)) return obj.map(replace);
        if (obj && typeof obj === "object") {
            return Object.fromEntries(Object.entries(obj).map(([k, v])=>[
                    k,
                    replace(v)
                ]));
        }
        return obj;
    };
    return replace(clone);
}
/** 이전 버전 호환: 공통 키 (마이그레이션용) */ const LEGACY_STORAGE_KEY = "hogang-landing-page-data";
function loadFromStorage(template) {
    if ("TURBOPACK compile-time truthy", 1) return null;
    //TURBOPACK unreachable
    ;
    const t = undefined;
}
function saveToStorage(data, template) {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
}
function clearStorage(template) {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
}
function loadTemplateFromStorage() {
    if ("TURBOPACK compile-time truthy", 1) return null;
    //TURBOPACK unreachable
    ;
}
function saveTemplateToStorage(template) {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
}
function downloadJson(data, filename) {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([
        json
    ], {
        type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}
/** 저장된 파일이 스냅샷 형식인지 확인 (template + data 있음) */ function isEditorSnapshot(obj) {
    if (!obj || typeof obj !== "object") return false;
    const o = obj;
    const t = o.template;
    if (t !== "a" && t !== "b" && t !== "c" && t !== "d") return false;
    if (!o.data || typeof o.data !== "object") return false;
    const d = o.data;
    return "hero" in d && "overview" in d && "contactForm" in d;
}
function parseImportedFile(json) {
    if (!json || typeof json !== "object") return null;
    if (isEditorSnapshot(json)) {
        return {
            template: json.template,
            data: json.data
        };
    }
    const o = json;
    if ("hero" in o && "overview" in o && "contactForm" in o) {
        return {
            data: json
        };
    }
    return null;
}
async function downloadEditorSnapshot(data, template) {
    const exportData = await prepareForExport(data);
    const snapshot = {
        template,
        data: exportData,
        savedAt: new Date().toISOString()
    };
    const filename = `hogang-editor-${template}-${Date.now()}.json`;
    const json = JSON.stringify(snapshot, null, 2);
    const blob = new Blob([
        json
    ], {
        type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}
}),
"[project]/components/Header.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Header",
    ()=>Header
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-ssr] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/house.js [app-ssr] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$storage$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/storage-utils.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
function Header() {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const isHome = pathname === "/";
    const isEditor = pathname === "/editor";
    const templates = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>[
            "a",
            "b",
            "c",
            "d"
        ], []);
    const [templateOpen, setTemplateOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [currentTemplate, setCurrentTemplate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("a");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const t = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$storage$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["loadTemplateFromStorage"])();
        if (t) setCurrentTemplate(t);
    }, [
        pathname
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!templateOpen) return;
        const onMouseDown = (e)=>{
            const el = e.target;
            if (!el) return;
            if (el.closest("[data-template-gnb]")) return;
            setTemplateOpen(false);
        };
        window.addEventListener("mousedown", onMouseDown);
        return ()=>window.removeEventListener("mousedown", onMouseDown);
    }, [
        templateOpen
    ]);
    if (isHome) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "border-b border-gray-200 bg-white",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-2",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: "/",
                        "aria-label": "홈",
                        className: "inline-flex h-10 w-10 items-center justify-center rounded-xl text-gray-800 transition-colors hover:bg-gray-100",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"], {
                            className: "size-5"
                        }, void 0, false, {
                            fileName: "[project]/components/Header.tsx",
                            lineNumber: 48,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/Header.tsx",
                        lineNumber: 43,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/Header.tsx",
                    lineNumber: 42,
                    columnNumber: 9
                }, this),
                isEditor ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                    className: "flex flex-wrap items-center justify-end gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>document.getElementById("editor-reset-btn")?.click(),
                            className: "inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm ring-1 ring-gray-200 transition-colors hover:bg-gray-50",
                            children: "새로 만들기"
                        }, void 0, false, {
                            fileName: "[project]/components/Header.tsx",
                            lineNumber: 54,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>document.getElementById("editor-import-file")?.click(),
                            className: "inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm ring-1 ring-gray-200 transition-colors hover:bg-gray-50",
                            children: "불러오기"
                        }, void 0, false, {
                            fileName: "[project]/components/Header.tsx",
                            lineNumber: 62,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative",
                            "data-template-gnb": true,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>setTemplateOpen((v)=>!v),
                                    className: "inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm ring-1 ring-gray-200 transition-colors hover:bg-gray-50",
                                    children: [
                                        "템플릿",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                            className: "ml-1 size-4 text-gray-500"
                                        }, void 0, false, {
                                            fileName: "[project]/components/Header.tsx",
                                            lineNumber: 77,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/Header.tsx",
                                    lineNumber: 71,
                                    columnNumber: 15
                                }, this),
                                templateOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute right-0 z-[100] mt-2 w-56 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.12)]",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "px-3 py-2 text-xs font-semibold text-gray-500",
                                            children: [
                                                "현재: ",
                                                currentTemplate.toUpperCase()
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/Header.tsx",
                                            lineNumber: 82,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-col p-2",
                                            children: templates.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>{
                                                        setTemplateOpen(false);
                                                        setCurrentTemplate(t);
                                                        document.getElementById(`editor-set-template-${t}`)?.click();
                                                    },
                                                    className: `rounded-xl px-3 py-2 text-left text-sm font-semibold transition-colors ${t === currentTemplate ? "bg-[#6a5acd]/10 text-[#6a5acd]" : "bg-transparent text-gray-800 hover:bg-gray-50"}`,
                                                    children: [
                                                        "템플릿 ",
                                                        t.toUpperCase()
                                                    ]
                                                }, t, true, {
                                                    fileName: "[project]/components/Header.tsx",
                                                    lineNumber: 87,
                                                    columnNumber: 23
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/components/Header.tsx",
                                            lineNumber: 85,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/Header.tsx",
                                    lineNumber: 81,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/Header.tsx",
                            lineNumber: 70,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>document.getElementById("editor-save-btn")?.click(),
                            className: "inline-flex items-center rounded-full bg-[#6a5acd] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#5a4abd]",
                            children: "저장"
                        }, void 0, false, {
                            fileName: "[project]/components/Header.tsx",
                            lineNumber: 111,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: "/view/preview",
                            target: "_blank",
                            rel: "noopener noreferrer",
                            className: "inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm ring-1 ring-gray-200 transition-colors hover:bg-gray-50",
                            children: "미리보기"
                        }, void 0, false, {
                            fileName: "[project]/components/Header.tsx",
                            lineNumber: 119,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/Header.tsx",
                    lineNumber: 53,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-10"
                }, void 0, false, {
                    fileName: "[project]/components/Header.tsx",
                    lineNumber: 129,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/Header.tsx",
            lineNumber: 41,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/Header.tsx",
        lineNumber: 40,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__261c9abf._.js.map