/**
 * IndexedDB Adapter 구현 (Dexie 기반)
 *
 * StorageAdapter 인터페이스를 Dexie로 구현
 * 저장 시 createdAt/updatedAt 자동 세팅
 */

import { db } from "./db";
import type { StorageAdapter } from "./adapter";
import type { Page, Bundle, Sprint } from "@/types/models";

export class IndexedDBAdapter implements StorageAdapter {
  // ============ Page 관련 ============

  async savePage(page: Page): Promise<void> {
    const now = new Date().toISOString();
    const existing = await db.pages.get(page.id);

    const pageToSave: Page = {
      ...page,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    await db.pages.put(pageToSave);
  }

  async getPage(id: string): Promise<Page | null> {
    const page = await db.pages.get(id);
    return page ?? null;
  }

  async getPageByDate(date: string): Promise<Page | null> {
    const page = await db.pages.where("date").equals(date).first();
    return page ?? null;
  }

  async listPages(limit?: number, offset = 0): Promise<Page[]> {
    let query = db.pages.orderBy("updatedAt").reverse();

    if (offset > 0) {
      query = query.offset(offset);
    }

    if (limit) {
      query = query.limit(limit);
    }

    return await query.toArray();
  }

  async deletePage(id: string): Promise<void> {
    await db.pages.delete(id);
  }

  // ============ Bundle 관련 ============

  async saveBundle(bundle: Bundle): Promise<void> {
    const now = new Date().toISOString();
    const existing = await db.bundles.get(bundle.id);

    const bundleToSave: Bundle = {
      ...bundle,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    await db.bundles.put(bundleToSave);
  }

  async getBundle(id: string): Promise<Bundle | null> {
    const bundle = await db.bundles.get(id);
    return bundle ?? null;
  }

  async listBundles(limit?: number, offset = 0): Promise<Bundle[]> {
    let query = db.bundles.orderBy("updatedAt").reverse();

    if (offset > 0) {
      query = query.offset(offset);
    }

    if (limit) {
      query = query.limit(limit);
    }

    return await query.toArray();
  }

  async deleteBundle(id: string): Promise<void> {
    await db.bundles.delete(id);
  }

  // ============ Sprint 관련 ============

  async saveSprint(sprint: Sprint): Promise<void> {
    const now = new Date().toISOString();
    const existing = await db.sprints.get(sprint.id);

    const sprintToSave: Sprint = {
      ...sprint,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    await db.sprints.put(sprintToSave);
  }

  async getSprint(id: string): Promise<Sprint | null> {
    const sprint = await db.sprints.get(id);
    return sprint ?? null;
  }

  async getCurrentSprint(): Promise<Sprint | null> {
    // endDate가 없는 Sprint를 현재 활성 Sprint로 간주
    const sprint = await db.sprints
      .filter((s) => !s.endDate)
      .first();
    return sprint ?? null;
  }

  async listSprints(limit?: number, offset = 0): Promise<Sprint[]> {
    let query = db.sprints.orderBy("updatedAt").reverse();

    if (offset > 0) {
      query = query.offset(offset);
    }

    if (limit) {
      query = query.limit(limit);
    }

    return await query.toArray();
  }

  async deleteSprint(id: string): Promise<void> {
    await db.sprints.delete(id);
  }

  // ============ PageNumber 관련 ============

  async getNextPageNumber(): Promise<number> {
    const pages = await db.pages.orderBy("pageNumber").reverse().limit(1).toArray();
    const max = pages[0]?.pageNumber ?? 0;
    return max + 1;
  }

  // ============ Query 관련 ============

  async getPagesByTag(tag: string): Promise<Page[]> {
    // tags는 multi-entry 인덱스
    return await db.pages.where("tags").equals(tag).toArray();
  }

  async getPagesByTab(tab: string): Promise<Page[]> {
    // tabs는 multi-entry 인덱스
    return await db.pages.where("tabs").equals(tab).toArray();
  }

  async getBookmarkedPages(): Promise<Page[]> {
    return await db.pages.where("bookmarked").equals(1).toArray();
  }

  async getPagesByDateRange(
    startDate: string,
    endDate: string
  ): Promise<Page[]> {
    return await db.pages
      .where("date")
      .between(startDate, endDate, true, true)
      .toArray();
  }
}
