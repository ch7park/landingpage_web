import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase-admin";

/** 편집기에서 프로젝트 저장 (서버에서 service_role로 INSERT → RLS 우회) */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { content, template_type, status, owner_token } = body;

    if (!content || !template_type) {
      return NextResponse.json({ error: "필수 데이터가 없습니다." }, { status: 400 });
    }

    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
      .from("projects")
      .insert({
        content,
        template_type: (String(template_type).toUpperCase().match(/^[A-D]$/) || ["A"])[0],
        status: status === "active" ? "active" : "pending",
        owner_token: owner_token || null,
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
