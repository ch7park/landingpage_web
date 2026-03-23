import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/** 관리자용 Supabase 클라이언트 (RLS 우회, 서버 전용) */
export function createSupabaseAdmin() {
  if (!supabaseUrl || !serviceRoleKey) {
    const missing = [];
    if (!supabaseUrl) missing.push("NEXT_PUBLIC_SUPABASE_URL");
    if (!serviceRoleKey) missing.push("SUPABASE_SERVICE_ROLE_KEY");
    throw new Error(
      "[Supabase 설정 필요]\n\n" +
      "1) .env.local이 프로젝트 루트(package.json 있는 폴더)에 있는지 확인\n" +
      "2) Supabase 대시보드 → Settings → API 에서 아래 값을 복사해 .env.local의 = 뒤에 붙여넣기:\n" +
      "   - Project URL → NEXT_PUBLIC_SUPABASE_URL\n" +
      "   - anon public → NEXT_PUBLIC_SUPABASE_ANON_KEY\n" +
      "   - service_role (Reveal 눌러서 표시) → SUPABASE_SERVICE_ROLE_KEY\n" +
      "3) 파일 저장 후 터미널에서 개발 서버 완전히 종료(Ctrl+C) 후 다시: npm run dev\n\n" +
      "지금 비어 있는 항목: " + missing.join(", ") + "\n\n" +
      "※ Supabase 없이 쓰려면 편집기 상단 '작업 저장' 버튼으로 JSON 파일로 저장하면 됩니다."
    );
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
}
