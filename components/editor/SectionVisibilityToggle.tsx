"use client";

/**
 * Tailwind `peer`는 **바로 앞의 peer 요소의 형제**에만 적용됩니다.
 * thumb을 track 안에 두면 `peer-checked`가 동작하지 않아 레이아웃/상태가 꼬일 수 있어
 * input → track → thumb 순으로 형제 배치합니다.
 */
export function SectionVisibilityToggle({
  id,
  checked,
  onCheckedChange,
  label = "섹션 표시",
  tone = "dark",
}: {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  tone?: "dark" | "light";
}) {
  const labelClassName =
    tone === "light"
      ? "text-sm font-medium text-gray-800"
      : "text-sm font-medium text-white/95";

  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center gap-2.5 select-none"
    >
      <span className={labelClassName}>{label}</span>
      <span className="relative inline-flex h-8 w-[52px] shrink-0 align-middle">
        <input
          id={id}
          type="checkbox"
          role="switch"
          aria-checked={checked}
          className="peer sr-only"
          checked={checked}
          onChange={(e) => onCheckedChange(e.target.checked)}
        />
        {/* track — input의 형제 */}
        <span
          aria-hidden
          className="absolute inset-0 rounded-full bg-white/12 shadow-inner transition-colors duration-200 ease-out peer-checked:bg-white/28 peer-focus-visible:ring-2 peer-focus-visible:ring-white/50 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#6a5acd]"
        />
        {/* thumb — input의 형제 (peer-checked로 이동) */}
        <span
          aria-hidden
          className="pointer-events-none absolute left-[3px] top-1/2 h-[22px] w-[22px] -translate-y-1/2 rounded-full bg-white shadow-sm opacity-80 transition-transform duration-200 ease-out will-change-transform peer-checked:translate-x-[24px] peer-checked:opacity-100"
        />
      </span>
    </label>
  );
}
