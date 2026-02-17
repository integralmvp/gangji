"use client";

/**
 * NoteBookmark — 페이지 북마크 토글
 *
 * NOTE 캔버스 좌상단에 작은 별 아이콘 1개.
 * 클릭 시 bookmarked 토글 → 노란색(활성) / 흐린 회색(비활성)
 * 단일 아이콘, 패널/컨테이너 없음.
 */

import { usePageMeta } from "@/features/editor/hooks/usePageMeta";

export default function NoteBookmark() {
  const { currentPage, toggleBookmark } = usePageMeta();

  const isBookmarked = currentPage?.bookmarked ?? false;

  return (
    <button
      onClick={toggleBookmark}
      disabled={!currentPage}
      title={isBookmarked ? "북마크 해제" : "북마크"}
      className={`text-base leading-none transition-all duration-150 select-none
        disabled:opacity-0
        ${isBookmarked
          ? "text-yellow-400 hover:text-yellow-500"
          : "text-ink-muted/25 hover:text-ink-muted/50"
        }`}
    >
      {isBookmarked ? "★" : "☆"}
    </button>
  );
}
