"use client";

interface SectionHeaderProps {
  title: string;
  zigbangLogoURL?: string; // deprecated, 로고 제거됨
  large?: boolean;
}

export function SectionHeader({ title, large }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-center bg-[#6a5acd] px-4 py-4">
      <h2 className={`w-full text-center font-bold text-white ${large ? "text-3xl sm:text-4xl" : "text-lg sm:text-xl"}`}>
        {title}
      </h2>
    </div>
  );
}
