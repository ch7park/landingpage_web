"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      {/* Shader Gradient 스타일 - 움직이는 빛, 호갱노노 보라색 (https://shadergradient.co/) */}
      <div className="fixed inset-0 -z-10 h-full w-full overflow-hidden bg-[#f5f3ff]">
        {/* 베이스 */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#faf8ff] via-[#f3efff] to-[#ede9fe]" />
        {/* 움직이는 빛 1 - 메인 (Shader Gradient처럼 빛이 천천히 이동) */}
        <div
          className="absolute h-[90vmax] w-[90vmax] animate-[shader-light-move_22s_ease-in-out_infinite] rounded-full blur-[120px]"
          style={{
            background:
              "radial-gradient(circle, rgba(167, 139, 250, 0.7) 0%, rgba(139, 92, 246, 0.35) 25%, rgba(196, 181, 253, 0.1) 50%, transparent 70%)",
            top: "-10%",
            left: "-10%",
          }}
        />
        {/* 움직이는 빛 2 - 세컨더리 */}
        <div
          className="absolute h-[70vmax] w-[70vmax] animate-[shader-light-secondary_28s_ease-in-out_infinite] rounded-full blur-[100px]"
          style={{
            background:
              "radial-gradient(circle, rgba(196, 181, 253, 0.6) 0%, rgba(124, 58, 237, 0.25) 35%, transparent 65%)",
            top: "20%",
            right: "-5%",
          }}
        />
        {/* 움직이는 빛 3 - 역방향으로 교차 */}
        <div
          className="absolute h-[60vmax] w-[60vmax] rounded-full blur-[110px]"
          style={{
            background:
              "radial-gradient(circle, rgba(233, 213, 255, 0.55) 0%, rgba(167, 139, 250, 0.2) 45%, transparent 70%)",
            bottom: "-5%",
            left: "10%",
            animation: "shader-light-move 20s ease-in-out infinite reverse",
            animationDelay: "-7s",
          }}
        />
      </div>

      {/* Hero Section */}
      <section className="flex h-screen w-full flex-col items-center justify-center px-4 text-center">
        <div className="relative z-10 max-w-5xl animate-fade-in-up space-y-8">
          <h1 className="text-6xl font-extrabold tracking-tight text-gray-900 sm:text-7xl md:text-8xl leading-[1.1]">
            분양 광고의<br />
            <span className="relative inline-block">
              새로운 기준
              {/* 밑줄 강조 효과 */}
              <svg className="absolute -bottom-2 left-0 -z-10 h-3 w-full text-[#ff6b21]/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="10" fill="none" />
              </svg>
            </span>
          </h1>
          
          <p className="mx-auto max-w-2xl text-xl font-medium text-gray-600 sm:text-2xl leading-relaxed">
            호갱노노의 데이터와 직방의 기술력이 만나<br />
            가장 완벽한 분양 랜딩페이지를 만듭니다.
          </p>

          <div className="pt-8">
            <Link
              href="/editor"
              className="group inline-flex items-center gap-2 rounded-full bg-gray-900 px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-black hover:px-10"
            >
              랜딩페이지 제작하기
              <ChevronDown className="h-5 w-5 -rotate-90 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-8 w-8 text-gray-400" />
        </div>
      </section>

      {/* Features Section - 3블록: 왼쪽 제목, 오른쪽 부가설명 박스 4개 (모바일 최적화) */}
      <section className="relative z-10 w-full py-16 px-4 sm:py-24 sm:px-6">
        <div className="mx-auto max-w-2xl sm:max-w-3xl md:max-w-4xl">
          {/* Section Header */}
          <div className="mb-12 text-center sm:mb-16">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
              분양 광고를 바꾸는 세가지 기준
            </h2>
            <p className="mt-3 text-base text-gray-500 sm:mt-4 sm:text-lg">
              개발자 없이, 누구나 전문가급 랜딩페이지를 만듭니다.
            </p>
          </div>

          <div className="flex flex-col gap-8 sm:gap-12">
          {/* Block 1: 압도적 속도 - 왼쪽 제목, 오른쪽 부가설명 4박스 */}
          <div className="group flex flex-col gap-5 overflow-hidden rounded-2xl border border-white/40 bg-white/20 p-5 shadow-md backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white/60 hover:bg-white/30 hover:shadow-xl sm:flex-row sm:gap-8 sm:rounded-3xl sm:p-6 md:gap-12 md:p-8">
            <div className="flex-shrink-0 sm:w-[200px] md:w-[240px]">
              <h3 className="text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">압도적 속도</h3>
              <Link href="/editor" className="mt-2 inline-flex items-center text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 sm:mt-3 sm:text-base">
                빠른 제작 경험 <span className="ml-1">→</span>
              </Link>
            </div>
            <div className="flex max-w-md flex-1 flex-col gap-2 sm:gap-3">
              {[
                "3분 만에 완성하는 랜딩페이지",
                "클릭 한 번으로 디자인 변경",
                "실시간 미리보기로 즉시 확인",
                "복잡한 코딩 없이 누구나 가능",
              ].map((text, i) => (
                <div
                  key={i}
                  className="rounded-xl bg-white/50 px-4 py-3 text-sm text-gray-900 shadow-sm ring-1 ring-white/40 transition-all duration-300 sm:rounded-2xl sm:px-6 sm:py-4 sm:text-base group-hover:bg-white/60"
                >
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* Block 2: 강력한 데이터 - 왼쪽 제목, 오른쪽 부가설명 4박스 */}
          <div className="group flex flex-col gap-5 overflow-hidden rounded-2xl border border-[#c7d2fe]/30 bg-[#eef2ff]/20 p-5 shadow-md backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#c7d2fe]/50 hover:bg-[#eef2ff]/35 hover:shadow-xl hover:shadow-indigo-200/30 sm:flex-row sm:gap-8 sm:rounded-3xl sm:p-6 md:gap-12 md:p-8">
            <div className="flex-shrink-0 sm:w-[200px] md:w-[240px]">
              <h3 className="text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">강력한 데이터</h3>
              <Link href="/admin" className="mt-2 inline-flex items-center text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 sm:mt-3 sm:text-base">
                데이터 기반 운영 <span className="ml-1">→</span>
              </Link>
            </div>
            <div className="flex max-w-md flex-1 flex-col gap-2 sm:gap-3">
              {[
                "실시간 관심고객 집계",
                "현장별 데이터 분석",
                "담당자에게 링크로 전달",
                "의사결정을 돕는 인사이트",
              ].map((text, i) => (
                <div
                  key={i}
                  className="rounded-xl bg-white/40 px-4 py-3 text-sm text-gray-900 shadow-sm ring-1 ring-[#c7d2fe]/20 transition-all duration-300 sm:rounded-2xl sm:px-6 sm:py-4 sm:text-base group-hover:bg-white/55"
                >
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* Block 3: 완벽한 호환성 - 왼쪽 제목, 오른쪽 부가설명 4박스 */}
          <div className="group flex flex-col gap-5 overflow-hidden rounded-2xl border border-[#fde68a]/40 bg-[#fef3c7]/20 p-5 shadow-md backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#fde68a]/60 hover:bg-[#fef3c7]/35 hover:shadow-xl hover:shadow-amber-200/30 sm:flex-row sm:gap-8 sm:rounded-3xl sm:p-6 md:gap-12 md:p-8">
            <div className="flex-shrink-0 sm:w-[200px] md:w-[240px]">
              <h3 className="text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">완벽한 호환성</h3>
              <Link href="/editor" className="mt-2 inline-flex items-center text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 sm:mt-3 sm:text-base">
                어디서든 동일한 경험 <span className="ml-1">→</span>
              </Link>
            </div>
            <div className="flex max-w-md flex-1 flex-col gap-2 sm:gap-3">
              {[
                "PC, 태블릿, 모바일 반응형",
                "모든 브라우저 지원",
                "수정 즉시 반영",
                "전문가급 퀄리티 제공",
              ].map((text, i) => (
                <div
                  key={i}
                  className="rounded-xl bg-white/40 px-4 py-3 text-sm text-gray-900 shadow-sm ring-1 ring-[#fde68a]/30 transition-all duration-300 sm:rounded-2xl sm:px-6 sm:py-4 sm:text-base group-hover:bg-white/55"
                >
                  {text}
                </div>
              ))}
            </div>
          </div>
          </div>
        </div>
      </section>
    </main>
  );
}
