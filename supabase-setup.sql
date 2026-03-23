-- =============================================
-- 호갱노노 랜딩페이지 - Supabase 설정 스크립트
-- Supabase 대시보드 → SQL Editor → 새 쿼리에 붙여넣고 실행
-- =============================================

-- 1. projects 테이블 생성
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_token TEXT UNIQUE,  -- 광고주가 자신의 관심고객만 볼 수 있는 고유 링크용
  status TEXT NOT NULL DEFAULT 'pending',
  template_type TEXT NOT NULL DEFAULT 'A',
  content JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 기존 테이블에 owner_token 추가 (이미 있는 경우)
ALTER TABLE projects ADD COLUMN IF NOT EXISTS owner_token TEXT UNIQUE;

-- 2. RLS(행 수준 보안) 활성화
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- 3. 정책: status='active'인 프로젝트만 공개 조회 가능
DROP POLICY IF EXISTS "공개 뷰어: active 프로젝트만 조회" ON projects;
CREATE POLICY "공개 뷰어: active 프로젝트만 조회"
  ON projects FOR SELECT
  USING (status = 'active');

-- 4. 정책: 누구나 프로젝트 추가 가능 (편집기에서 저장용)
DROP POLICY IF EXISTS "편집기: 프로젝트 추가" ON projects;
CREATE POLICY "편집기: 프로젝트 추가"
  ON projects FOR INSERT
  WITH CHECK (true);

-- 5. 관심고객 등록 데이터 저장용 테이블
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  inquiry TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- 누구나 INSERT (공개 뷰어에서 폼 제출)
DROP POLICY IF EXISTS "관심고객: 제출" ON contact_submissions;
CREATE POLICY "관심고객: 제출"
  ON contact_submissions FOR INSERT
  WITH CHECK (true);

-- SELECT는 service_role로만 (관리자 API)

-- 완료!

-- .env.local 설정:
-- NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
-- SUPABASE_SERVICE_ROLE_KEY (관리자 페이지용, Supabase 대시보드 → Settings → API → service_role)
