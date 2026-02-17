/**
 * pageUtils — 페이지 생성/로드 보조 로직
 *
 * 에디터 진입 시 오늘 날짜 페이지를 자동으로 로드하거나 생성한다.
 * pageNumber는 단조 증가 (max + 1)
 */

import { nanoid } from "nanoid";
import { storage } from "@/lib/storage/storage";
import type { Page } from "@/types/models";

/**
 * 오늘 날짜를 YYYY-MM-DD 포맷으로 반환
 */
export function getTodayDate(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * 빈 TipTap JSON 콘텐츠 (초기값)
 */
export function createEmptyContent(): string {
  return JSON.stringify({
    type: "doc",
    content: [{ type: "paragraph" }],
  });
}

/**
 * 오늘 날짜 페이지를 로드하거나, 없으면 자동 생성
 */
export async function loadOrCreateTodayPage(): Promise<Page> {
  return loadOrCreatePageByDate(getTodayDate());
}

/**
 * 특정 날짜 페이지를 로드하거나, 없으면 자동 생성
 */
export async function loadOrCreatePageByDate(date: string): Promise<Page> {
  const existing = await storage.getPageByDate(date);
  if (existing) return existing;

  const pageNumber = await storage.getNextPageNumber();
  const now = new Date().toISOString();

  const newPage: Page = {
    id: nanoid(),
    date,
    pageNumber,
    content: createEmptyContent(),
    title: undefined,
    tabs: [],
    tags: [],
    bookmarked: false,
    bundleId: undefined,
    createdAt: now,
    updatedAt: now,
  };

  await storage.savePage(newPage);
  return newPage;
}
