"use client";

import { useRef } from "react";
import { ChevronDown } from "lucide-react";
import type { LandingPageData } from "@/types/landing-page";
import { ContactFormFields } from "@/components/ContactFormFields";
import { FloatingContactBar } from "@/components/FloatingContactBar";

interface ContactFormSectionProps {
  data: LandingPageData["contactForm"];
  projectId?: string;
}

export function ContactFormSection({ data, projectId }: ContactFormSectionProps) {
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="contact-form" className="bg-[#6a5acd] px-4 py-12 scroll-mt-24">
      <div className="text-center">
        <h2 className="mb-3 text-3xl font-bold text-white sm:text-4xl">{data.title}</h2>
        <p className="mb-8 text-sm text-white/95">{data.description}</p>
      </div>
      <div className="mb-8 flex justify-center">
        <button
          type="button"
          onClick={scrollToForm}
          aria-label="아래로 스크롤"
          className="flex size-14 items-center justify-center rounded-full bg-white text-[#6a5acd] transition-transform hover:scale-105"
        >
          <ChevronDown className="size-8" />
        </button>
      </div>
      <div ref={formRef} className="mx-auto max-w-md rounded-xl bg-white p-6 shadow-lg">
        <ContactFormFields
          projectId={projectId}
          privacyContactName={data.privacyContactName}
          submitButtonClassName="w-full rounded-lg bg-[#6a5acd] py-3 font-semibold text-white hover:bg-[#5a4abd]"
          inputClassName="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-[#6a5acd] focus:outline-none focus:ring-2 focus:ring-[#6a5acd]/20"
        />
      </div>
      {(data.phoneNumber || data.kakaoLink) && (
        <FloatingContactBar phoneNumber={data.phoneNumber} kakaoLink={data.kakaoLink} />
      )}
    </section>
  );
}
