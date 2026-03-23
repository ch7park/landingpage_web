"use client";

import { ChevronDown } from "lucide-react";
import type { LandingPageData } from "@/types/landing-page";
import { ContactFormFields } from "@/components/ContactFormFields";

interface Section5ContactProps {
  data: LandingPageData["contactForm"];
  projectId?: string;
}

export function Section5Contact({ data, projectId }: Section5ContactProps) {
  return (
    <section id="contact-form" className="relative w-full bg-[#111827] py-24 md:py-32 scroll-mt-24">
      {/* 얇은 상단 보더 디자인 */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#c5a572] to-transparent opacity-50" />
      
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-block border border-white/20 px-4 py-1 text-xs font-light tracking-[0.3em] text-white/80 uppercase">
            CONTACT US
          </span>
          <h2 className="mt-8 font-serif text-3xl font-bold text-white md:text-5xl">{data.title}</h2>
          <p className="mt-6 text-sm font-light leading-relaxed text-white/60 md:text-base">{data.description}</p>
        </div>
        
        <div className="mt-16 overflow-hidden rounded-sm bg-white/5 border border-white/10 backdrop-blur-sm shadow-2xl p-8 md:p-12">
          <ContactFormFields
            projectId={projectId}
            privacyContactName={data.privacyContactName}
            submitButtonClassName="mt-6 w-full rounded-none bg-[#0f172a] py-4 font-bold tracking-widest text-white transition-colors hover:bg-black border border-[#0f172a]"
            inputClassName="w-full rounded-none border-b border-white/20 bg-transparent px-2 py-3 text-white placeholder:text-white/30 focus:border-[#c5a572] focus:outline-none focus:ring-0 transition-colors"
          />
        </div>
      </div>
    </section>
  );
}
