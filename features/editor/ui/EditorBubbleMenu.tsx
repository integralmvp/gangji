"use client";

/**
 * EditorBubbleMenu — 텍스트 선택 시 나타나는 인라인 포맷 메뉴
 *
 * TipTap v3에서 BubbleMenu가 별도 패키지로 분리됨.
 * selection rect 기반으로 직접 구현.
 *
 * Bold / Italic / Underline / Highlight / H1 / H2 빠른 접근
 */

import { useEffect, useRef, useState, useCallback } from "react";
import type { Editor } from "@tiptap/react";

interface EditorBubbleMenuProps {
  editor: Editor;
}

interface MenuPosition {
  top: number;
  left: number;
}

export default function EditorBubbleMenu({ editor }: EditorBubbleMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<MenuPosition>({ top: 0, left: 0 });

  const updatePosition = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
      setVisible(false);
      return;
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    if (!rect || rect.width === 0) {
      setVisible(false);
      return;
    }

    const menuEl = menuRef.current;
    const menuWidth = menuEl?.offsetWidth ?? 240;
    const menuHeight = menuEl?.offsetHeight ?? 36;

    const top = rect.top - menuHeight - 8 + window.scrollY;
    const left = Math.max(
      8,
      Math.min(
        rect.left + rect.width / 2 - menuWidth / 2,
        window.innerWidth - menuWidth - 8
      )
    );

    setPosition({ top, left });
    setVisible(true);
  }, []);

  // 에디터 selection 변경 감지
  useEffect(() => {
    if (!editor) return;

    const onSelectionUpdate = () => {
      const { from, to } = editor.state.selection;
      if (from === to) {
        setVisible(false);
      } else {
        // RAF으로 DOM 업데이트 후 위치 계산
        requestAnimationFrame(updatePosition);
      }
    };

    editor.on("selectionUpdate", onSelectionUpdate);
    return () => {
      editor.off("selectionUpdate", onSelectionUpdate);
    };
  }, [editor, updatePosition]);

  // 외부 클릭 시 숨기기
  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setVisible(false);
      }
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={menuRef}
      style={{ top: position.top, left: position.left }}
      className="fixed z-50 flex items-center gap-0.5 px-1.5 py-1 rounded-md shadow-lg
        bg-white/97 backdrop-blur-sm border border-ink/10"
    >
      <BubBtn
        label="B"
        title="굵게 (Ctrl+B)"
        active={editor.isActive("bold")}
        className="font-bold"
        onClick={() => editor.chain().focus().toggleBold().run()}
      />
      <BubBtn
        label="I"
        title="기울임 (Ctrl+I)"
        active={editor.isActive("italic")}
        className="italic"
        onClick={() => editor.chain().focus().toggleItalic().run()}
      />
      <BubBtn
        label="U"
        title="밑줄 (Ctrl+U)"
        active={editor.isActive("underline")}
        className="underline"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      />

      <div className="w-px h-4 bg-ink/15 mx-0.5" />

      {/* 형광펜 */}
      <button
        onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHighlight().run(); }}
        className={`px-2 py-1 rounded text-xs transition-colors
          ${editor.isActive("highlight")
            ? "bg-yellow-200 text-ink"
            : "text-ink/60 hover:bg-yellow-100 hover:text-ink"
          }`}
        title="형광펜"
      >
        <span className="inline-block w-3 h-3 rounded-sm bg-yellow-300 border border-yellow-400" />
      </button>

      <div className="w-px h-4 bg-ink/15 mx-0.5" />

      <BubBtn
        label="H1"
        title="제목 1"
        active={editor.isActive("heading", { level: 1 })}
        className="font-semibold"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      />
      <BubBtn
        label="H2"
        title="제목 2"
        active={editor.isActive("heading", { level: 2 })}
        className="font-semibold"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      />
    </div>
  );
}

// ─── 서브컴포넌트 ─────────────────────────────────────────────────────────────
interface BubBtnProps {
  label: string;
  title: string;
  active: boolean;
  className?: string;
  onClick: () => void;
}

function BubBtn({ label, title, active, className = "", onClick }: BubBtnProps) {
  return (
    <button
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      title={title}
      className={`px-2 py-1 rounded text-xs transition-colors ${className}
        ${active ? "bg-ink/15 text-ink" : "text-ink/60 hover:bg-ink/8 hover:text-ink"}`}
    >
      {label}
    </button>
  );
}
