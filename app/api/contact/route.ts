import { NextRequest, NextResponse } from "next/server";
import { createSupabaseClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { projectId, name, phone, inquiry } = body;

    if (!projectId || !name || !phone) {
      return NextResponse.json(
        { error: "필수 항목(이름, 연락처)을 입력해 주세요." },
        { status: 400 }
      );
    }

    const supabase = createSupabaseClient();
    const { error } = await supabase.from("contact_submissions").insert({
      project_id: projectId,
      name: String(name).trim(),
      phone: String(phone).trim(),
      inquiry: inquiry ? String(inquiry).trim() : null,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json(
      { error: "등록 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
