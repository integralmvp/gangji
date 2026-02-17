"use client";

/**
 * NoteTitleInput — 페이지 타이틀 입력
 *
 * 노트 본문 최상단에 위치하는 텍스트 입력.
 * 박스/테두리/배경 없음 — 노트에 적힌 큰 글씨처럼 보임.
 *
 * - 비워두면 "무제"로 placeholder 표시 (저장은 undefined)
 * - Enter 키 → 본문 에디터로 포커스 이동 (onEnter 콜백)
 * - 페이지 변경 시 title 값 동기화
 */

import { forwardRef, useEffect, useState, KeyboardEvent } from "react";
import { usePageMeta } from "@/features/editor/hooks/usePageMeta";

interface NoteTitleInputProps {
  onEnter?: () => void;
}

const NoteTitleInput = forwardRef<HTMLInputElement, NoteTitleInputProps>(
  function NoteTitleInput({ onEnter }, ref) {
    const { currentPage, updateTitle } = usePageMeta();
    const [localTitle, setLocalTitle] = useState(currentPage?.title ?? "");

    // 페이지 변경(날짜 이동 등) 시 title 동기화
    useEffect(() => {
      setLocalTitle(currentPage?.title ?? "");
    }, [currentPage?.id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalTitle(e.target.value);
      updateTitle(e.target.value);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        onEnter?.();
      }
    };

    return (
      <input
        ref={ref}
        type="text"
        value={localTitle}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="제목 없음"
        disabled={!currentPage}
        className="w-full bg-transparent border-none outline-none
          text-xl font-semibold text-ink leading-snug
          placeholder:text-ink-muted/25
          caret-ink disabled:opacity-0"
      />
    );
  }
);

export default NoteTitleInput;
