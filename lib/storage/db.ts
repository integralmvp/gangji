/**
 * Dexie IndexedDB Schema + Versioning
 *
 * 데이터 유지 원칙:
 * - schema 변경 시 version 증가 필수
 * - migration 로직 반드시 작성
 * - 사용자 데이터 유지 최우선
 */

import Dexie, { type EntityTable } from "dexie";
import type { Page, Bundle, Sprint } from "@/types/models";

/**
 * GangjiDB - Gangji 로컬 데이터베이스
 */
export class GangjiDB extends Dexie {
  // 테이블 정의
  pages!: EntityTable<Page, "id">;
  bundles!: EntityTable<Bundle, "id">;
  sprints!: EntityTable<Sprint, "id">;

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

    // ============ Future Versions (Migration Scaffold) ============
    // 스키마 변경이 필요할 때 아래와 같이 새 버전 추가

    // Example:
    // this.version(2).stores({
    //   pages: "id, date, bundleId, bookmarked, updatedAt, *tabs, *tags, newField",
    // }).upgrade(tx => {
    //   // Migration 로직
    //   return tx.table("pages").toCollection().modify(page => {
    //     page.newField = "default value";
    //   });
    // });
  }
}

// 싱글톤 인스턴스 export
export const db = new GangjiDB();
