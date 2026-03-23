export default function ViewNotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4">
      <h1 className="text-2xl font-bold text-gray-900">페이지를 찾을 수 없습니다</h1>
      <p className="mt-2 text-gray-600">요청하신 페이지가 없거나, 아직 검수가 완료되지 않은 프로젝트입니다.</p>
      <a
        href="/"
        className="mt-6 rounded-lg bg-[#6a5acd] px-6 py-2 text-sm font-medium text-white hover:bg-[#5a4abd]"
      >
        홈으로 돌아가기
      </a>
    </main>
  );
}
