// 실거래가 데이터 타입
export interface ApartTrade {
  aptNm: string;
  dealYear: string;
  dealMonth: string;
  dealDay: string;
  floor: string;
  excluUseAr: string;
  dealAmount: string;
  umdNm: string;
  buildYear: string;
}

export interface ApartTradeFormatted {
  date: string;
  floor: number;
  area: number;
  price: number;
  pricePerPy: number;
}

// 청약 정보 타입
export interface SubscriptionInfo {
  houseNm: string;
  houseSecdNm: string;
  bsnsMbyNm: string;
  hssplyAdres: string;
  totSuplyHshldco: number;
  rcritPblancDe: string;
  przwnerPresnatnDe: string;
  subscrptAreaCodeNm: string;
  rceptBgnde: string;
  rceptEndde: string;
  pblancNo: string;
  pblancUrl?: string;
  mvnPrearngeYm?: string;
  gnrlRnk1CrspareaEndde?: string;
}

// 아파트 기본 정보
export interface ApartmentInfo {
  name: string;
  address: string;
  totalHouseholds: number;
  completionYear: number;
  floors: string;
  parking: string;
  management: string;
  area: string;
  naverId: string;
}

// API 응답 공통 타입
export interface ApiResponse<T> {
  data: T[];
  totalCount: number;
  error?: string;
}

// 차트 데이터
export interface ChartDataPoint {
  date: string;
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
  count: number;
}

// ──────────────────────────────────────────────
// 관심 아파트
// ──────────────────────────────────────────────
export interface MyApartment {
  id: string;
  name: string;
  address: string;
  lawd_cd: string;
  aptName: string;
  memo?: string;
  addedAt: string;
}

// ──────────────────────────────────────────────
// 부동산 뉴스
// ──────────────────────────────────────────────
export type NewsCategory =
  | '전체'
  | '금리·대출'
  | '청약·분양'
  | '세금·규제'
  | '시장동향'
  | '재건축·재개발';

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  date: string;
  summary: string;
  url: string;
  category: NewsCategory;
}

// ──────────────────────────────────────────────
// 재공고 / 추가청약
// ──────────────────────────────────────────────
export type ReAnnouncementType =
  | '재공고'
  | '추가청약'
  | '미계약분'
  | '부적격자취소분';

export interface ReAnnouncementSub {
  id: string;
  houseNm: string;
  address: string;
  type: ReAnnouncementType;
  reason: string;
  supplyCount: number;
  rceptBgnde: string;
  rceptEndde: string;
  url?: string;
}
