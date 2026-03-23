"use client";

import { useState, useEffect } from "react";

interface Submission {
  id: string;
  name: string;
  phone: string;
  inquiry: string | null;
  created_at: string;
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "-";
  }
}

export function LeadsClient({ token }: { token: string }) {
  const [projectName, setProjectName] = useState("");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/leads/${token}`)
      .then((res) => {
        if (!res.ok) return res.json().then((d) => { throw new Error(d.error || "오류"); });
        return res.json();
      })
      .then((data) => {
        setProjectName(data.projectName);
        setSubmissions(data.submissions);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "목록을 불러올 수 없습니다."))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">관심고객 목록</h1>
        <p className="mb-6 text-gray-600">{projectName || (loading ? "로딩 중..." : "")}</p>

        {loading && (
          <div className="flex justify-center py-12">
            <p className="text-gray-500">불러오는 중...</p>
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && submissions.length === 0 && (
          <div className="rounded-lg bg-white p-12 text-center text-gray-500">
            아직 등록된 관심고객이 없습니다.
          </div>
        )}

        {!loading && !error && submissions.length > 0 && (
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">이름</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">연락처</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">문의내용</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">등록일</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {submissions.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">{s.name}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">{s.phone}</td>
                      <td className="max-w-xs px-4 py-3 text-sm text-gray-600">
                        <span className="line-clamp-2" title={s.inquiry || ""}>{s.inquiry || "-"}</span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{formatDate(s.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <p className="mt-6 text-xs text-gray-500">
          이 링크는 해당 현장의 관심고객만 확인할 수 있습니다. 링크를 타인에게 공유하지 마세요.
        </p>
      </div>
    </main>
  );
}
