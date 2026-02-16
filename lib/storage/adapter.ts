/**
 * StorageAdapter 인터페이스
 *
 * 앱 로직은 저장소에 직접 의존하지 않고, 반드시 이 인터페이스를 통해서만 접근한다.
 * 현재 구현: IndexedDB (Dexie)
 * 향후 구현: Desktop(Tauri)+SQLite / Mobile(Capacitor)+SQLite / File-based
 */

import type { Page, Bundle, Sprint } from "@/types/models";

export interface StorageAdapter {
  // ============ Page 관련 ============
  /**
   * Page 저장 (생성 또는 업데이트)
   */
  savePage(page: Page): Promise<void>;

  /**
   * ID로 Page 조회
   */
  getPage(id: string): Promise<Page | null>;

  /**
   * 날짜로 Page 조회 (YYYY-MM-DD)
   */
  getPageByDate(date: string): Promise<Page | null>;

  /**
   * 모든 Page 목록 조회 (최근순)
   */
  listPages(limit?: number, offset?: number): Promise<Page[]>;

  /**
   * Page 삭제
   */
  deletePage(id: string): Promise<void>;

  // ============ Bundle 관련 ============
  /**
   * Bundle 저장 (생성 또는 업데이트)
   */
  saveBundle(bundle: Bundle): Promise<void>;

  /**
   * ID로 Bundle 조회
   */
  getBundle(id: string): Promise<Bundle | null>;

  /**
   * 모든 Bundle 목록 조회 (최근순)
   */
  listBundles(limit?: number, offset?: number): Promise<Bundle[]>;

  /**
   * Bundle 삭제
   */
  deleteBundle(id: string): Promise<void>;

  // ============ Sprint 관련 ============
  /**
   * Sprint 저장 (생성 또는 업데이트)
   */
  saveSprint(sprint: Sprint): Promise<void>;

  /**
   * ID로 Sprint 조회
   */
  getSprint(id: string): Promise<Sprint | null>;

  /**
   * 현재 활성 Sprint 조회 (endDate가 없는 Sprint)
   */
  getCurrentSprint(): Promise<Sprint | null>;

  /**
   * 모든 Sprint 목록 조회 (최근순)
   */
  listSprints(limit?: number, offset?: number): Promise<Sprint[]>;

  /**
   * Sprint 삭제
   */
  deleteSprint(id: string): Promise<void>;

  // ============ Query 관련 ============
  /**
   * 태그로 Page 목록 조회
   */
  getPagesByTag(tag: string): Promise<Page[]>;

  /**
   * 탭으로 Page 목록 조회
   */
  getPagesByTab(tab: string): Promise<Page[]>;

  /**
   * 북마크된 Page 목록 조회
   */
  getBookmarkedPages(): Promise<Page[]>;

  /**
   * 날짜 범위로 Page 목록 조회
   */
  getPagesByDateRange(startDate: string, endDate: string): Promise<Page[]>;
}
