"use client";

import { Phone, MessageCircle, UserPlus } from "lucide-react";

const CONTACT_FORM_ID = "contact-form";

interface FloatingContactBarProps {
  phoneNumber?: string;
  kakaoLink?: string;
}

export function FloatingContactBar({ phoneNumber, kakaoLink }: FloatingContactBarProps) {
  const telHref = phoneNumber ? `tel:${phoneNumber.replace(/-/g, "")}` : null;

  const scrollToContactForm = () => {
    document.getElementById(CONTACT_FORM_ID)?.scrollIntoView({ behavior: "smooth" });
  };

  if (!phoneNumber && !kakaoLink) {
    return (
      <div className="fixed bottom-6 right-4 z-40 flex flex-col gap-2 animate-[floating-contact-bob_2.6s_ease-in-out_infinite] will-change-transform">
        <button
          type="button"
          onClick={scrollToContactForm}
          className="flex h-14 items-center gap-2.5 rounded-full bg-[#6a5acd] px-4 text-white shadow-lg transition-all hover:bg-[#5a4abd]"
          aria-label="관심고객 등록"
          title="관심고객 등록"
        >
          <UserPlus className="size-5" />
          <span className="whitespace-nowrap text-sm font-semibold leading-none">
            관심고객 등록
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-4 z-40 flex flex-col gap-2 animate-[floating-contact-bob_2.6s_ease-in-out_infinite] will-change-transform">
      <button
        type="button"
        onClick={scrollToContactForm}
        className="flex h-14 items-center gap-2.5 rounded-full bg-[#6a5acd] px-4 text-white shadow-lg transition-all hover:bg-[#5a4abd]"
        aria-label="관심고객 등록"
        title="관심고객 등록"
      >
        <UserPlus className="size-5" />
        <span className="whitespace-nowrap text-sm font-semibold leading-none">
          관심고객 등록
        </span>
      </button>
      {phoneNumber && telHref && (
        <a
          href={telHref}
          className="flex size-14 items-center justify-center rounded-full bg-[#6a5acd] text-white shadow-lg transition-colors hover:bg-[#5a4abd]"
          aria-label="전화 문의"
        >
          <Phone className="size-6" />
        </a>
      )}
      {kakaoLink && (
        <a
          href={kakaoLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex size-14 items-center justify-center rounded-full bg-[#FEE500] text-[#191919] shadow-lg transition-colors"
          aria-label="카카오톡 상담"
        >
          <MessageCircle className="size-6" strokeWidth={2} />
        </a>
      )}
    </div>
  );
}
