"use client";

import { useState } from "react";
import { X } from "lucide-react";

function PrivacyModalContent({ privacyContactName }: { privacyContactName?: string }) {
  const subjectName = privacyContactName?.trim() || "본 분양 사업 주체";
  return (
    <div className="space-y-4 text-left text-sm text-gray-700">
      <p className="text-base font-bold text-gray-900">[개인정보 수집 및 이용 동의]</p>

      <p>
        <span className="font-bold">1. 개인정보 수집 및 이용 주체</span>
        <br />
        본 페이지에 명시된 [{subjectName}] (이하 &apos;사업주체&apos;)
      </p>

      <p>
        <span className="font-bold">2. 수집 및 이용 목적</span>
      <br />
      모델하우스 방문 예약, 분양 상담, 당첨자 안내 및 마케팅 자료(문자/전화) 발송
    </p>

    <p>
      <span className="font-bold">3. 수집하는 항목</span>
      <br />
      필수항목: 성명, 휴대전화번호
      <br />
      선택항목: 관심평형, 거주지
    </p>

    <p>
      <span className="font-bold">4. 보유 및 이용 기간</span>
      <br />
      분양 완료 시 또는 고객의 동의 철회 시까지 (단, 관계 법령에 따라 보존할 필요가 있는 경우 해당 기간 동안 보관)
    </p>

    <p>
      <span className="font-bold">5. 개인정보 처리 위탁 안내</span>
      <br />
      &apos;사업주체&apos;는 원활한 서비스 제공을 위해 아래와 같이 시스템 운영을 위탁하고 있습니다.
      <br />
      <br />
      수탁 업체(시스템 운영): [호갱노노]
      <br />
      위탁 업무 내용: 랜딩페이지 서버 운영, DB 기술적 보관 및 관리 시스템 제공
    </p>

    <p className="mt-4 text-xs text-gray-500">
      ※ 본 서비스는 호갱노노가 시스템만 제공하며, 정보 이용 주체는 위 사업자입니다.
    </p>
  </div>
  );
}

interface ContactFormFieldsProps {
  projectId?: string;
  /** 개인정보 책임자(법인명) - 제1조 수집 주체에 표시, 미입력 시 '본 분양 사업 주체' */
  privacyContactName?: string;
  submitButtonClassName?: string;
  inputClassName?: string;
  labelClassName?: string;
  privacyTextClassName?: string;
}

export function ContactFormFields({
  projectId,
  privacyContactName,
  submitButtonClassName = "w-full rounded-xl bg-[#6a5acd] py-3.5 font-semibold text-white shadow-sm transition-all hover:bg-[#5a4abd] hover:shadow-md",
  inputClassName = "w-full rounded-xl border-2 border-transparent bg-gray-50 px-4 py-3.5 text-gray-900 placeholder:text-gray-400 transition-all hover:bg-gray-100 focus:border-[#6a5acd] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#6a5acd]/10",
  labelClassName = "mb-1 block text-sm font-medium text-gray-700",
  privacyTextClassName = "text-gray-700",
}: ContactFormFieldsProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [inquiry, setInquiry] = useState("");
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId) {
      setMessage({ type: "error", text: "미리보기 모드입니다. 공유된 링크에서만 등록 가능합니다." });
      return;
    }
    if (!name.trim() || !phone.trim()) {
      setMessage({ type: "error", text: "이름과 연락처를 입력해 주세요." });
      return;
    }
    if (!agreePrivacy) {
      setMessage({ type: "error", text: "개인정보 수집 및 이용에 동의해 주세요." });
      return;
    }
    setSubmitting(true);
    setMessage(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          name: name.trim(),
          phone: phone.trim(),
          inquiry: inquiry.trim() || null,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "등록에 실패했습니다.");
      }
      setMessage({ type: "success", text: "등록되었습니다. 빠른 시일 내에 연락드리겠습니다." });
      setName("");
      setPhone("");
      setInquiry("");
    } catch (e) {
      setMessage({
        type: "error",
        text: e instanceof Error ? e.message : "등록 중 오류가 발생했습니다.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="contact-name" className={labelClassName}>
          이름
        </label>
        <input
          id="contact-name"
          type="text"
          placeholder="이름을 입력해 주세요"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClassName}
        />
      </div>
      <div>
        <label htmlFor="contact-phone" className={labelClassName}>
          연락처
        </label>
        <input
          id="contact-phone"
          type="tel"
          placeholder="010-0000-0000"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={inputClassName}
        />
      </div>
      <div>
        <label htmlFor="contact-inquiry" className={labelClassName}>
          문의내용
        </label>
        <textarea
          id="contact-inquiry"
          rows={3}
          placeholder="문의하실 내용을 입력해 주세요"
          value={inquiry}
          onChange={(e) => setInquiry(e.target.value)}
          className={`resize-none ${inputClassName}`}
        />
      </div>
      <div className="flex flex-wrap items-center gap-1">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={agreePrivacy}
            onChange={(e) => setAgreePrivacy(e.target.checked)}
            className="size-4 rounded border-gray-300 text-[#6a5acd] focus:ring-[#6a5acd]/20"
          />
          <span className={`text-sm ${privacyTextClassName}`}>개인정보 수집 및 이용에 동의합니다</span>
        </label>
        <button
          type="button"
          onClick={() => setShowPrivacyModal(true)}
          className={`text-xs underline hover:opacity-80 ${privacyTextClassName.replace("text-gray-700", "text-gray-500")}`}
        >
          [전문 보기]
        </button>
      </div>

      {message && (
        <p className={`text-sm ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
          {message.text}
        </p>
      )}
      <button
        type="submit"
        disabled={submitting}
        className={`${submitButtonClassName} disabled:opacity-50`}
      >
        {submitting ? "등록 중..." : "등록하기"}
      </button>

      {/* 개인정보 동의 전문 모달 */}
      {showPrivacyModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setShowPrivacyModal(false)}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowPrivacyModal(false)}
              className="absolute right-4 top-4 rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              aria-label="닫기"
            >
              <X className="size-5" />
            </button>
            <div className="pr-8"><PrivacyModalContent privacyContactName={privacyContactName} /></div>
          </div>
        </div>
      )}
    </form>
  );
}
