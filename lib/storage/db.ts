/**
 * Dexie IndexedDB Schema + Versioning
 *
 * 데이터 유지 원칙:
 * - schema 변경 시 version 증가 필수
 * - migration 로직 반드시 작성
 * - 사용자 데이터 유지 최우선
 */

import Dexie, { type EntityTable } from "dexie";
import type { Page, Bundle, Sprint, CalendarEvent } from "@/types/models";

/**
 * GangjiDB - Gangji 로컬 데이터베이스
 */
export class GangjiDB extends Dexie {
  // 테이블 정의
  pages!: EntityTable<Page, "id">;
  bundles!: EntityTable<Bundle, "id">;
  sprints!: EntityTable<Sprint, "id">;
  events!: EntityTable<CalendarEvent, "id">;

  constructor() {
    super("GangjiDB");

    // ============ Version 1 ============
    this.version(1).stores({
      // Pages 테이블
      // 인덱스: id(PK), date, bundleId, bookmarked, updatedAt, *tabs, *tags
      // *tabs, *tags는 multi-entry 인덱스 (배열 내 각 요소가 인덱싱됨)
      pages: "id, date, bundleId, bookmarked, updatedAt, *tabs, *tags",

      // Bundles 테이블
      // 인덱스: id(PK), startDate, endDate, updatedAt
      bundles: "id, startDate, endDate, updatedAt",

      // Sprints 테이블
      // 인덱스: id(PK), startDate, endDate, updatedAt
      sprints: "id, startDate, endDate, updatedAt",
    });

    // ============ Version 2 — pageNumber 추가 ============
    this.version(2)
      .stores({
        // pageNumber 인덱스 추가
        pages: "id, date, pageNumber, bundleId, bookmarked, updatedAt, *tabs, *tags",
        bundles: "id, startDate, endDate, updatedAt",
        sprints: "id, startDate, endDate, updatedAt",
      })
      .upgrade(async (tx) => {
        // 기존 데이터에 pageNumber 부여: createdAt 오름차순 정렬 후 1부터 부여
        const pages = await tx
          .table("pages")
          .orderBy("createdAt")
          .toArray();
        let counter = 1;
        for (const page of pages) {
          if (page.pageNumber == null) {
            await tx.table("pages").update(page.id, { pageNumber: counter++ });
          }
        }
      });

    // ============ Version 3 — CalendarEvent 테이블 추가 ============
    this.version(3).stores({
      pages: "id, date, pageNumber, bundleId, bookmarked, updatedAt, *tabs, *tags",
      bundles: "id, startDate, endDate, updatedAt",
      sprints: "id, startDate, endDate, updatedAt",
      // events: id(PK), date 인덱스
      events: "id, date, createdAt",
    });
  }
}

// 싱글톤 인스턴스 export
export const db = new GangjiDB();
