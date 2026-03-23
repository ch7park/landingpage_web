import type { LandingPageData } from "@/types/landing-page";

/**
 * Template A - 청량리역 요진 와이시티 더미 데이터
 * 이미지 URL은 placeholder 서비스를 사용합니다.
 */
export const dummyData: LandingPageData = {
  hero: {
    title: "서울특별시(동대문구) 청량리역 역세권 59타입 줍줍",
    subtitle: "10개노선 청약통장x 거주의무x",
    highlightText: "10개노선 청약통장x 거주의무x",
    heroImageURL: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
    hogangnonoLogoURL: "/next.svg",
    zigbangLogoURL: "/next.svg",
  },

  factCheck: {
    enabled: true,
    pointLabel: "POINT 1",
    sectionTitle: "팩트 체크 ✔",
    items: [
      { text: "청량리역 6개 노선 도보 역세권 4BAY 3룸" },
      { text: "GTX-B C 등 4개 노선 추가 신선 예정" },
      { text: "완성된 생활 인프라(학교, 대형마트, 대형병원, 공원 등)" },
      { text: "주변 일대 대규모 개발- 서울 동북권 신주거타운" },
      { text: "홍릉 바이오 의료특정지구 배후 수요 단지" },
      { text: "세대창고 무상 제공/100% 자주식 주차" },
      { text: "청약통장 실거주의무" },
    ],
  },

  overview: {
    enabled: true,
    overviewImageURL: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
    projectName: "청량리역 요진 와이시티",
    categoryLabel: "구분",
    details: [
      { label: "위치", value: "서울특별시 동대문구 청량리동 30번지 일대" },
      { label: "규모", value: "지하 4층 ~ 지상 18개층, 2개동 / 총 155세대(실)" },
      { label: "타입", value: "43-68" },
      { label: "계약조건", value: "계약금: 5% / 중도금: 60%" },
      { label: "입주예정일", value: "2028년 3월 예정" },
    ],
  },

  location: {
    enabled: true,
    pointLabel: "POINT 2",
    sectionTitle: "입지환경",
    mapImageURL: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80",
    legend: [
      { label: "5분 이내", value: "", color: "#6a5acd" },
      { label: "10분 이내", value: "", color: "#4169e1" },
    ],
    sections: [
      {
        imageURL: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&q=80",
        label: "교통환경",
        title: "청량리역 역세권 6개 노선 이용 가능",
        description: "1호선, 수인분당선, 경의중앙선, 경춘선, KTX강릉, 경원선. GTX-B C, 면목선, 강북횡단선 개통 시 10개 노선 이용 가능",
      },
      {
        imageURL: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&q=80",
        label: "생활환경",
        title: "역세권 중심 풍부한 생활 인프라",
        description: "롯데백화점, 롯데마트, 재래시장 등 풍부한 쇼핑 인프라. 서울성심병원, 경희대병원, 고대안암병원 등 우수한 의료",
      },
      {
        imageURL: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80",
        label: "교육환경",
        title: "초중고 전 학년 도보 통학 가능",
        description: "홍릉초, 삼육초, 청량중, 정화고 우수한 교육환경. 고려대, 서울사범대, 카이스트, 경희대 등 명문대 다수 밀집",
      },
      {
        imageURL: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80",
        label: "개발환경",
        title: "개발 잠재력이 높은 동북생활권 주요 거점 입지",
        description: "청량리역 6·8구역, 제기 4·6구역 정비구역 등 개발 다수. 6대 융복합산업 등 배후 수요 단지",
      },
    ],
  },

  development: {
    enabled: true,
    pointLabel: "POINT 3",
    sectionTitle: "대규모 개발호재",
    subtitle: "",
    mapImageURL: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=600&q=80",
    images: [
      { imageURL: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80", label: "개발환경" },
      { imageURL: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&q=80", label: "개발환경" },
      { imageURL: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400&q=80", label: "개발환경" },
      { imageURL: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&q=80", label: "개발환경" },
    ],
    description: "다양한 교통망 확충 및 대규모 개발로 인한 신도시급 주거지",
  },

  facilities: {
    enabled: true,
    pointLabel: "POINT 4",
    sectionTitle: "단지 내부 시설",
    subtitle: "다양한 입주민 전용 시설",
    items: [
      { imageURL: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&q=80", label: "피트니스" },
      { imageURL: "https://images.unsplash.com/photo-1558904541-efa843a96f01?w=300&q=80", label: "옥상 정원" },
      { imageURL: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=300&q=80", label: "세대창고" },
      { imageURL: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=300&q=80", label: "어린이 놀이터" },
    ],
  },

  interior: {
    enabled: true,
    pointLabel: "POINT 5",
    sectionTitle: "내부 인테리어",
    subtitle: "신혼부부 1-2인가구 수요 높은 평형 구성",
    rooms: [
      { imageURL: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&q=80", label: "거실" },
      { imageURL: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&q=80", label: "주방" },
      { imageURL: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=300&q=80", label: "파우더" },
      { imageURL: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=300&q=80", label: "침실1" },
      { imageURL: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=300&q=80", label: "침실2" },
      { imageURL: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=300&q=80", label: "침실3" },
    ],
  },

  floorPlan: {
    enabled: true,
    pointLabel: "POINT 6",
    sectionTitle: "주요타입안내",
    subtitle: "4BAY 3ROOM 위주, 중소형 상품 구성",
    images: [
      { url: "", label: "TYPE 1" },
      { url: "", label: "TYPE 2" },
      { url: "", label: "TYPE 3" },
      { url: "", label: "TYPE 4" },
    ],
  },

  contactForm: {
    title: "관심고객등록!",
    description: "아래 관심고객 등록을 해주시면 순차적으로 연락을 드릴 예정입니다.",
    privacyContactName: "",
    phoneNumber: "",
    kakaoLink: "",
  },
};
