import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase-admin";

/** 광고주가 owner_token으로 자신의 프로젝트 관심고객만 조회 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    if (!token) {
      return NextResponse.json({ error: "링크가 올바르지 않습니다." }, { status: 400 });
    }

    const supabase = createSupabaseAdmin();
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id, content")
      .eq("owner_token", token)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ error: "해당 링크를 찾을 수 없습니다." }, { status: 404 });
    }

    const { data: submissions, error } = await supabase
      .from("contact_submissions")
      .select("id, name, phone, inquiry, created_at")
      .eq("project_id", project.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const content = project.content as { hero?: { title?: string }; overview?: { projectName?: string } } | null;
    const projectName = content?.hero?.title || content?.overview?.projectName || "프로젝트";

    return NextResponse.json({
      projectName,
      submissions: submissions || [],
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
