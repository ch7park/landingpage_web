import { NextRequest, NextResponse } from "next/server";
import { createAdminToken, setAdminCookie } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    const adminUser = process.env.ADMIN_USERNAME || "admin";
    const adminPass = process.env.ADMIN_PASSWORD;

    if (!adminPass) {
      return NextResponse.json(
        { error: "관리자 계정이 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    if (username !== adminUser || password !== adminPass) {
      return NextResponse.json({ error: "아이디 또는 비밀번호가 올바르지 않습니다." }, { status: 401 });
    }

    const token = createAdminToken();
    await setAdminCookie(token);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "로그인 처리 중 오류가 발생했습니다." }, { status: 500 });
  }
}
