"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface ProjectItem {
  id: string;
  status: string;
  template_type: string;
  owner_token?: string | null;
  content: {
    hero?: { title?: string; heroImageURL?: string };
    overview?: { projectName?: string; overviewImageURL?: string };
  };
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

function getThumbnail(content: ProjectItem["content"]) {
  return content?.hero?.heroImageURL || content?.overview?.overviewImageURL || "";
}

function getTitle(content: ProjectItem["content"]) {
  return content?.hero?.title || content?.overview?.projectName || "(제목 없음)";
}

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [submissions, setSubmissions] = useState<{ id: string; project_name: string; name: string; phone: string; inquiry: string | null; created_at: string }[]>([]);
  const [activeTab, setActiveTab] = useState<"projects" | "leads">("projects");
  const [loading, setLoading] = useState(true);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [linkModal, setLinkModal] = useState<{ id: string; owner_token: string | null } | null>(null);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/admin/projects");
      if (res.status === 401) return false;
      return res.ok;
    } catch {
      return false;
    }
  };

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/projects", { credentials: "include" });
      if (res.status === 401) {
        setLoggedIn(false);
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setProjects(data);
      setLoggedIn(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "목록을 불러올 수 없습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      const ok = await checkAuth();
      if (ok) {
        await fetchProjects();
      } else {
        setLoggedIn(false);
        setLoading(false);
      }
    })();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setLoginError(data.error || "로그인에 실패했습니다.");
        return;
      }
      setLoggedIn(true);
      await fetchProjects();
    } catch {
      setLoginError("로그인 중 오류가 발생했습니다.");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
    setLoggedIn(false);
    setProjects([]);
  };

  const fetchLeads = async () => {
    setLeadsLoading(true);
    try {
      const res = await fetch("/api/admin/submissions", { credentials: "include" });
      if (!res.ok) throw new Error("목록을 불러올 수 없습니다.");
      const data = await res.json();
      setSubmissions(data);
    } catch {
      setSubmissions([]);
    } finally {
      setLeadsLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    setApprovingId(id);
    try {
      const res = await fetch(`/api/admin/projects/${id}/approve`, {
        method: "PATCH",
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "승인 실패");
      }
      await fetchProjects();
    } catch (e) {
      alert(e instanceof Error ? e.message : "승인에 실패했습니다.");
    } finally {
      setApprovingId(null);
    }
  };

  if (loggedIn === null || (loggedIn === false && loading)) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-500">확인 중...</p>
      </main>
    );
  }

  if (loggedIn === false) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow"
        >
          <h2 className="mb-6 text-xl font-bold text-gray-900">관리자 로그인</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="mb-1 block text-sm font-medium text-gray-700">
                아이디
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                required
              />
            </div>
            {loginError && (
              <p className="text-sm text-red-600">{loginError}</p>
            )}
            <button
              type="submit"
              className="w-full rounded-lg bg-[#6a5acd] py-2 text-sm font-medium text-white hover:bg-[#5a4abd]"
            >
              로그인
            </button>
          </div>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { setActiveTab("projects"); }}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${activeTab === "projects" ? "bg-[#6a5acd] text-white" : "bg-white text-gray-600"}`}
            >
              프로젝트 검수
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab("leads"); fetchLeads(); }}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${activeTab === "leads" ? "bg-[#6a5acd] text-white" : "bg-white text-gray-600"}`}
            >
              관심고객 목록
            </button>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
          >
            로그아웃
          </button>
        </div>

        {activeTab === "leads" ? (
          <>
            {leadsLoading ? (
              <div className="flex justify-center py-12">
                <p className="text-gray-500">불러오는 중...</p>
              </div>
            ) : submissions.length === 0 ? (
              <div className="rounded-lg bg-white p-12 text-center text-gray-500">
                등록된 관심고객이 없습니다.
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">프로젝트</th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">이름</th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">연락처</th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">문의내용</th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">등록일</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {submissions.map((s) => (
                        <tr key={s.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">{s.project_name}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{s.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{s.phone}</td>
                          <td className="max-w-xs truncate px-4 py-3 text-sm text-gray-600" title={s.inquiry || ""}>{s.inquiry || "-"}</td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{formatDate(s.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
        {loading && (
          <div className="flex justify-center py-12">
            <p className="text-gray-500">불러오는 중...</p>
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">
            {error}
            <button type="button" onClick={fetchProjects} className="ml-2 underline">
              다시 시도
            </button>
          </div>
        )}

        {!loading && !error && projects.length === 0 && (
          <div className="rounded-lg bg-white p-12 text-center text-gray-500">
            등록된 프로젝트가 없습니다.
          </div>
        )}

        {!loading && !error && projects.length > 0 && (
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      썸네일
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      제목
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      작성일
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      상태
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                      작업
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {projects.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-4 py-3">
                        <div className="relative h-14 w-20 overflow-hidden rounded bg-gray-100">
                          {getThumbnail(p.content) ? (
                            <Image
                              src={getThumbnail(p.content)}
                              alt=""
                              fill
                              className="object-cover"
                              sizes="80px"
                              unoptimized={getThumbnail(p.content).startsWith("data:")}
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                              없음
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="line-clamp-2 text-sm font-medium text-gray-900">
                          {getTitle(p.content)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                        {formatDate(p.created_at)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                            p.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setLinkModal({ id: p.id, owner_token: p.owner_token ?? null })}
                            className="rounded bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-300"
                          >
                            링크 전달
                          </button>
                          <Link
                            href={`/view/${p.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-300"
                          >
                            미리보기
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleApprove(p.id)}
                            disabled={approvingId === p.id || p.status === "active"}
                            className="rounded bg-[#6a5acd] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#5a4abd] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {approvingId === p.id ? "처리 중..." : p.status === "active" ? "승인됨" : "승인하기"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
          </>
        )}

        {linkModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setLinkModal(null)}>
            <div
              className="mx-4 w-full max-w-lg rounded-lg border border-gray-200 bg-white p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">링크 전달</h3>
                <button
                  type="button"
                  onClick={() => setLinkModal(null)}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="닫기"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="mb-1 text-xs font-medium text-gray-500">📤 홈페이지 (고객 공유용)</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={`${typeof window !== "undefined" ? window.location.origin : ""}/view/${linkModal.id}`}
                      className="flex-1 rounded border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/view/${linkModal.id}`);
                        alert("복사되었습니다.");
                      }}
                      className="shrink-0 rounded bg-[#6a5acd] px-3 py-2 text-sm text-white hover:bg-[#5a4abd]"
                    >
                      복사
                    </button>
                  </div>
                  <p className="mt-0.5 text-xs text-amber-600">승인된 프로젝트만 공개됩니다.</p>
                </div>
                <div>
                  <p className="mb-1 text-xs font-medium text-gray-500">📋 관심고객 데이터 (현장 전용)</p>
                  {linkModal.owner_token ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={`${typeof window !== "undefined" ? window.location.origin : ""}/leads/${linkModal.owner_token}`}
                        className="flex-1 rounded border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/leads/${linkModal!.owner_token!}`);
                          alert("복사되었습니다.");
                        }}
                        className="shrink-0 rounded bg-emerald-600 px-3 py-2 text-sm text-white hover:bg-emerald-700"
                      >
                        복사
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">이전에 저장된 프로젝트라 링크가 없습니다.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
