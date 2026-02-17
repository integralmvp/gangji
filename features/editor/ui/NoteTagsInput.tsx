"use client";

/**
 * NoteTagsInput — 페이지 태그 입력
 *
 * 타이틀 아래에 위치하는 태그 라인.
 * 텍스트처럼 보임 — 박스/chip/위젯 금지.
 * 예시: #독서 #사업 #태그 추가
 *
 * - Space / Enter: 태그 확정
 * - Backspace (input 비어있을 때): 마지막 태그 삭제
 * - 태그 텍스트 클릭: 해당 태그 삭제
 * - 페이지 변경 시 tags 동기화
 */

import { useRef, useState, useEffect, KeyboardEvent } from "react";
import { usePageMeta } from "@/features/editor/hooks/usePageMeta";

export default function NoteTagsInput() {
  const { currentPage, addTag, removeTag } = usePageMeta();
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const tags = currentPage?.tags ?? [];

  // 페이지 변경 시 input 초기화
  useEffect(() => {
    setInputValue("");
  }, [currentPage?.id]);

  const commitTag = () => {
    const trimmed = inputValue.trim();
    if (trimmed) {
      addTag(trimmed);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      commitTag();
    }
    if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div
      className="flex items-baseline flex-wrap gap-x-1 gap-y-0.5 cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      {/* 기존 태그: #태그 형태로 텍스트처럼 표시 */}
      {tags.map((tag) => (
        <span
          key={tag}
          onClick={(e) => {
            e.stopPropagation();
            removeTag(tag);
          }}
          className="text-xs text-ink-muted/55 hover:text-ink-muted/80
            cursor-pointer transition-colors select-none"
          title="클릭하여 제거"
        >
          #{tag}
        </span>
      ))}

      {/* 입력 필드 */}
      {currentPage && (
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commitTag}
          placeholder={tags.length === 0 ? "#태그 추가" : ""}
          className="flex-1 min-w-[56px] bg-transparent border-none outline-none
            text-xs text-ink-muted/55 placeholder:text-ink-muted/25
            caret-ink"
        />
      )}
    </div>
  );
}
