/**
 * Template A - 호갱노노 분양광고 랜딩페이지 데이터 스키마 (Data Schema)
 *
 * - hero: 제목, 메인 이미지, 로고 URL
 * - factCheck: 팩트 체크 리스트 (문자열 배열)
 * - overview: 사업 개요 (이미지, 프로젝트명, 상세 정보 테이블)
 * - location: 입지환경 (지도 이미지, 동적 배열 - 교통/생활/교육/개발환경 등)
 * - development: 대규모 개발호재
 * - facilities: 단지 내부 시설
 * - interior: 내부 인테리어
 * - floorPlan: 주요 타입 안내 (평면도 이미지)
 * - contactForm: 관심고객 등록
 */

export interface LandingPageData {
  hero: {
    title: string;
    subtitle: string;
    highlightText: string;
    heroImageURL: string;
    hogangnonoLogoURL: string;
    zigbangLogoURL: string;
  };

  factCheck: {
    /** false면 랜딩페이지에서 섹션 숨김 (삭제 효과), 미입력 시 표시 */
    enabled?: boolean;
    pointLabel: string;
    sectionTitle: string;
    items: { text: string }[];
  };

  overview: {
    /** false면 랜딩페이지에서 섹션 숨김 */
    enabled?: boolean;
    overviewImageURL: string;
    projectName: string;
    categoryLabel: string;
    details: { label: string; value: string }[];
  };

  location: {
    /** false면 랜딩페이지에서 섹션 숨김 */
    enabled?: boolean;
    pointLabel: string;
    sectionTitle: string;
    mapImageURL: string;
    legend: { label: string; value: string; color: string }[];
    sections: {
      imageURL: string;
      label: string;
      title: string;
      description: string;
    }[];
  };

  development: {
    /** false면 랜딩페이지에서 섹션 숨김 */
    enabled?: boolean;
    pointLabel: string;
    sectionTitle: string;
    subtitle: string;
    mapImageURL: string;
    images: { imageURL: string; label: string }[];
    description: string;
  };

  facilities: {
    /** false면 랜딩페이지에서 섹션 숨김 */
    enabled?: boolean;
    pointLabel: string;
    sectionTitle: string;
    subtitle: string;
    items: { imageURL: string; label: string }[];
  };

  interior: {
    /** false면 랜딩페이지에서 섹션 숨김 */
    enabled?: boolean;
    pointLabel: string;
    sectionTitle: string;
    subtitle: string;
    rooms: { imageURL: string; label: string }[];
  };

  floorPlan: {
    /** false면 랜딩페이지에서 섹션 숨김 */
    enabled?: boolean;
    pointLabel: string;
    sectionTitle: string;
    subtitle: string;
    images: { url: string; label: string }[];
  };

  contactForm: {
    title: string;
    description: string;
    /** 개인정보 책임자(법인명) - 개인정보 동의 모달 제1조에 표시 */
    privacyContactName?: string;
    /** 전화 연결 (예: 010-1234-5678) */
    phoneNumber?: string;
    /** 카카오톡 상담 링크 (예: https://pf.kakao.com/_xxx/chat) */
    kakaoLink?: string;
  };
}
