"use client";

import { useRef } from "react";
import { ImagePlus } from "lucide-react";

interface ImageUploadFieldProps {
  label: string;
  hint?: string;
  accept?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  compact?: boolean;
}

export function ImageUploadField({
  label,
  hint,
  accept = "image/*",
  onChange,
  compact = false,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
        {hint && (
          <span className="ml-1.5 text-xs font-normal text-gray-500">
            {hint}
          </span>
        )}
      </label>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#6a5acd]/25 bg-[#6a5acd]/5 text-[#6a5acd] transition-colors hover:border-[#6a5acd] hover:bg-[#6a5acd]/10 ${compact ? "py-3" : "py-4"}`}
      >
        <ImagePlus className={compact ? "size-5" : "size-6"} />
        <span className="text-sm font-medium">클릭하여 이미지 선택</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={onChange}
        className="hidden"
      />
    </div>
  );
}
