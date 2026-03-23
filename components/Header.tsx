"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isEditor = pathname === "/editor";

  if (isHome) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="flex h-16 w-full items-center px-8">
        {isEditor ? (
          <nav className="flex items-center gap-8 cursor-pointer">
            <button
              type="button"
              onClick={() => document.getElementById("editor-reset-btn")?.click()}
              className="cursor-pointer text-[15px] font-medium text-gray-700 transition-colors hover:text-gray-900"
            >
              새로 만들기
            </button>

            <button
              type="button"
              onClick={() => document.getElementById("editor-import-file")?.click()}
              className="cursor-pointer text-[15px] font-medium text-gray-700 transition-colors hover:text-gray-900"
            >
              불러오기
            </button>

            <button
              type="button"
              onClick={() => document.getElementById("editor-save-btn")?.click()}
              className="cursor-pointer text-[15px] font-medium text-gray-700 transition-colors hover:text-gray-900"
            >
              저장
            </button>

            {/* 구분선 (이미지의 KOR | ENG 처럼) */}
            <div className="h-3.5 w-[1px] bg-gray-200" aria-hidden="true" />

            <Link
              href="/view/preview"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer text-[15px] font-medium text-gray-700 transition-colors hover:text-gray-900"
            >
              미리보기
            </Link>
          </nav>
        ) : (
          <div className="h-10" />
        )}
      </div>
    </header>
  );
}
