"use client";

import type { LandingPageData } from "@/types/landing-page";
import { ContactFormFields } from "@/components/ContactFormFields";

interface ContactFormSectionProps {
  data: LandingPageData["contactForm"];
  projectId?: string;
}

export function ContactFormSection({ data, projectId }: ContactFormSectionProps) {
  return (
    <section id="contact-form" className="bg-[#1a1a1a] px-6 py-16 text-white scroll-mt-24">
      <div className="mb-10 text-center">
        <h2 className="mb-4 font-serif text-2xl text-white sm:text-3xl">
          {data.title || "Register Interest"}
        </h2>
        <p className="text-sm text-stone-400">{data.description}</p>
        <div className="mx-auto mt-6 h-[1px] w-12 bg-[#c5a572]" />
      </div>

      <div className="mx-auto max-w-sm">
        <ContactFormFields
          projectId={projectId}
          privacyContactName={data.privacyContactName}
          submitButtonClassName="mt-4 w-full bg-[#c5a572] py-4 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#b08d55]"
          inputClassName="w-full border-b border-stone-700 bg-transparent px-2 py-3 text-sm text-white placeholder:text-stone-600 focus:border-[#c5a572] focus:outline-none"
          labelClassName="mb-1 block text-xs font-bold text-stone-400 uppercase tracking-wide"
          privacyTextClassName="text-stone-400"
        />
        <p className="mt-6 text-center text-[10px] text-stone-600">
          COPYRIGHT © {new Date().getFullYear()} ALL RIGHTS RESERVED.
        </p>
      </div>
    </section>
  );
}
