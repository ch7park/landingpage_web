import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase-admin";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export async function GET() {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }
    const supabase = createSupabaseAdmin();
    const { data: submissions, error } = await supabase
      .from("contact_submissions")
      .select("id, project_id, name, phone, inquiry, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const projectIds = [...new Set((submissions || []).map((s: { project_id: string }) => s.project_id))];
    const projectMap: Record<string, string> = {};

    if (projectIds.length > 0) {
      const { data: projects } = await supabase
        .from("projects")
        .select("id, content")
        .in("id", projectIds);
      for (const p of projects || []) {
        const content = p.content as { hero?: { title?: string }; overview?: { projectName?: string } } | null;
        projectMap[p.id] = content?.hero?.title || content?.overview?.projectName || "(알 수 없음)";
      }
    }

    const result = (submissions || []).map(
      (s: { id: string; project_id: string; name: string; phone: string; inquiry: string | null; created_at: string }) => ({
        id: s.id,
        project_id: s.project_id,
        project_name: projectMap[s.project_id] || "(알 수 없음)",
        name: s.name,
        phone: s.phone,
        inquiry: s.inquiry,
        created_at: s.created_at,
      })
    );

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
