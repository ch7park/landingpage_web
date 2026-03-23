import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/** 서버 컴포넌트용 Supabase 클라이언트 (읽기 전용) */
export function createSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_ANON_KEY를 .env.local에 설정해 주세요."
    );
  }
  return createClient(supabaseUrl, supabaseAnonKey);
}

export interface ProjectRow {
  id: string;
  status: string;
  template_type: string;
  content: unknown;
}
