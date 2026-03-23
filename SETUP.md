# 호갱노노 랜딩페이지 - 사용 가이드

## 🏠 첫 화면

- **미리보기**: 홈(/)에서 템플릿 A/B/C 더미 미리보기
- **상단 네비**: 미리보기 | 관리자 페이지 | 랜딩페이지 편집기

---

## 🔐 관리자 페이지 로그인

관리자 페이지(`/admin`)는 아이디/비밀번호 로그인 필요.

`.env.local`에 설정:

```
ADMIN_USERNAME=admin
ADMIN_PASSWORD=원하는_비밀번호
```

- 로그인 후: 프로젝트 목록, 미리보기, 승인하기
- 로그아웃 버튼으로 세션 종료 (24시간 후 자동 만료)

---

## 📤 공유 링크 만들기 (Supabase)

### 1단계: Supabase 설정 (한 번만)

1. **Supabase 프로젝트 만들기**  
   [supabase.com](https://supabase.com) 로그인 → New Project 생성 (없다면).

2. **환경 변수 추가**  
   프로젝트 루트에 `.env.local` 파일을 만들고 아래 세 값을 채워 넣습니다.  
   (복사용 예시는 `.env.example` 참고.)

   | 변수명 | 어디서 복사? |
   |--------|----------------|
   | `NEXT_PUBLIC_SUPABASE_URL` | Supabase 대시보드 → **Settings** → **API** → Project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 같은 화면 → **Project API keys** → `anon` `public` 키 |
   | `SUPABASE_SERVICE_ROLE_KEY` | 같은 화면 → **Project API keys** → `service_role` 키 (비공개, 노출 금지) |

   `.env.local` 예시:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
   ```

3. **DB 테이블 생성**  
   Supabase 대시보드 → **SQL Editor** → 새 쿼리 열기 → 프로젝트의 `supabase-setup.sql` 내용 붙여넣기 → **Run** 실행.

### 2단계: 저장 및 공유

1. 편집기에서 **Supabase에 저장 (공유 링크)** 클릭
2. 공유 링크가 클립보드에 복사됨

---

## 📋 관심고객 데이터

공개 뷰어(`/view/[id]`)에서 고객이 폼을 제출하면 Supabase에 저장됩니다.

- **광고주(현장)**: Supabase에 저장 시 발급되는 **관심고객 관리 링크** (`/leads/[token]`)로 자신의 현장 데이터만 확인
- **플랫폼 관리자**: 관리자 페이지 → 관심고객 목록에서 전체 확인

---

## 📁 경로

| 경로 | 설명 |
|------|------|
| `/` | 미리보기 (템플릿 선택 + 더미 데이터) |
| `/admin` | 관리자 (로그인 → 프로젝트 검수) |
| `/editor` | 랜딩페이지 편집기 |
| `/view/preview` | 로컬 미리보기 |
| `/view/[id]` | 공개 뷰어 |
