/**
 * Gangji 핵심 도메인 타입
 * 데이터 모델 기준: CLAUDE.md 섹션 8
 */

/**
 * Period - RUN/STAND/SIT 기간 단위
 * 몰입 사이클의 핵심 구성 요소
 */
export interface Period {
  type: "run" | "stand" | "sit";
  goal: string; // 목표 1줄
  startDate: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD (선택적)
}

/**
 * Sprint - 몰입 테마/기간 배열
 * 여러 Period의 조합으로 구성
 */
export interface Sprint {
  id: string;
  theme: string; // 몰입 테마
  startDate: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD (진행 중이면 없음)
  periods: Period[];
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

/**
 * Page - 날짜 기반 기록 단위 (내부 단위)
 * "낱장" 개념
 */
export interface Page {
  id: string;
  date: string; // YYYY-MM-DD
  content: string; // TipTap JSON (string으로 저장)
  title?: string; // 무제 허용
  tabs: string[]; // 복수 선택 가능
  tags: string[]; // 복수 선택 가능, 보관소
  bookmarked: boolean;
  bundleId?: string; // 이어쓰기 묶음 ID
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

/**
 * Bundle - 이어쓰기/연속 기록의 관리 단위 (UI 기준 단위)
 * "묶음" 개념 - 한 번의 작성 흐름이 여러 장으로 이어질 때
 */
export interface Bundle {
  id: string;
  title: string;
  pageIds: string[]; // 묶인 페이지들의 ID
  startDate: string; // YYYY-MM-DD (첫 페이지 날짜)
  endDate: string; // YYYY-MM-DD (마지막 페이지 날짜)
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}
