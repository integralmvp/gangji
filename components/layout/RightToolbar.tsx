"use client";

/**
 * RightToolbar — 우측 도구 패널
 *
 * - 패널 자체: glass blur 흰색 투명 배경
 * - 각 섹션 카드: 헤더(타이틀) = 파스텔 컬러, 콘텐츠 = 화이트
 * - 폰트: 흑색(ink) 통일
 *
 * PR4+PR7: 에디터 도구를 실제 editor 인스턴스에 연결
 */

import { useUIStore } from "@/store/uiStore";
import { useEditorStore } from "@/store/editorStore";

// 섹션별 파스텔 컬러
const COLORS = {
  view:  { bg: "#EDE9F8" }, // soft lavender
  tools: { bg: "#E4EDF8" }, // soft sky blue
  flow:  { bg: "#F5F2E0" }, // soft warm yellow
};

// 제한된 텍스트 컬러 팔레트 (6색)
const TEXT_COLORS = [
  { hex: "#2C2C2A", label: "기본" },
  { hex: "#C0392B", label: "빨강" },
  { hex: "#2E86AB", label: "파랑" },
  { hex: "#27AE60", label: "초록" },
  { hex: "#F39C12", label: "주황" },
  { hex: "#8E44AD", label: "보라" },
];

export default function RightToolbar() {
  const { viewMode, setViewMode, rightOpen, toggleRight } = useUIStore();
  const { editor } = useEditorStore();

  return (
    <div className="h-full glass transition-all duration-200 flex flex-col">
      {/* 토글 버튼 */}
      <button
        onClick={toggleRight}
        className="self-start p-2 m-1 rounded text-ink-muted hover:text-ink transition-colors text-xs"
        title={rightOpen ? "닫기" : "열기"}
      >
        {rightOpen ? "▸" : "◂"}
      </button>

      {/* ── 뷰 전환 ── */}
      <div className="px-1.5 mb-2">
        <div
          className="rounded-sm overflow-hidden bg-white"
          style={{ boxShadow: "0 1px 3px rgba(44,44,42,0.10), 0 0.5px 1px rgba(44,44,42,0.06)" }}
        >
          <div
            className="flex justify-end px-2 pt-1.5 pb-1"
            style={{ background: COLORS.view.bg }}
          >
            <span className="text-[9px] font-semibold text-ink">
              {rightOpen ? "뷰" : "V"}
            </span>
          </div>
          <div className="p-1.5 space-y-1 bg-white">
            <button
              onClick={() => setViewMode("editor")}
              className={`w-full px-2 py-1 rounded text-xs transition-all text-ink
                ${viewMode === "editor" ? "bg-ink/10 font-medium" : "hover:bg-ink/5 text-ink/60"}`}
              title="백지 보기"
            >
              {rightOpen ? "백지" : "✎"}
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={`w-full px-2 py-1 rounded text-xs transition-all text-ink
                ${viewMode === "calendar" ? "bg-ink/10 font-medium" : "hover:bg-ink/5 text-ink/60"}`}
              title="달력 보기"
            >
              {rightOpen ? "달력" : "▦"}
            </button>
          </div>
        </div>
      </div>

      {/* ── 문서 도구 (에디터 모드에서만) ── */}
      {viewMode === "editor" && (
        <div className="px-1.5 mb-2 flex-1 min-h-0">
          <div
            className="rounded-sm h-full flex flex-col overflow-hidden bg-white"
            style={{ boxShadow: "0 1px 3px rgba(44,44,42,0.10), 0 0.5px 1px rgba(44,44,42,0.06)" }}
          >
            <div
              className="flex justify-end px-2 pt-1.5 pb-1 shrink-0"
              style={{ background: COLORS.tools.bg }}
            >
              <span className="text-[9px] font-semibold text-ink">
                {rightOpen ? "문서 도구" : "T"}
              </span>
            </div>

            <div className="p-1.5 space-y-1 overflow-y-auto bg-white">

              {/* 서식 */}
              <ToolButton
                icon="B" label="굵게" open={rightOpen}
                active={editor?.isActive("bold") ?? false}
                btnStyle="font-bold"
                onClick={() => editor?.chain().focus().toggleBold().run()}
                disabled={!editor}
              />
              <ToolButton
                icon="I" label="기울임" open={rightOpen}
                active={editor?.isActive("italic") ?? false}
                btnStyle="italic"
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                disabled={!editor}
              />
              <ToolButton
                icon="U" label="밑줄" open={rightOpen}
                active={editor?.isActive("underline") ?? false}
                btnStyle="underline"
                onClick={() => editor?.chain().focus().toggleUnderline().run()}
                disabled={!editor}
              />

              <div className="border-t border-ink/8 my-1" />

              {/* 제목 */}
              <ToolButton
                icon="H1" label="제목 1" open={rightOpen}
                active={editor?.isActive("heading", { level: 1 }) ?? false}
                onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                disabled={!editor}
              />
              <ToolButton
                icon="H2" label="제목 2" open={rightOpen}
                active={editor?.isActive("heading", { level: 2 }) ?? false}
                onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                disabled={!editor}
              />
              <ToolButton
                icon="H3" label="제목 3" open={rightOpen}
                active={editor?.isActive("heading", { level: 3 }) ?? false}
                onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                disabled={!editor}
              />

              <div className="border-t border-ink/8 my-1" />

              {/* 목록 */}
              <ToolButton
                icon="≡" label="글머리표" open={rightOpen}
                active={editor?.isActive("bulletList") ?? false}
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                disabled={!editor}
              />
              <ToolButton
                icon="1." label="번호 목록" open={rightOpen}
                active={editor?.isActive("orderedList") ?? false}
                onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                disabled={!editor}
              />

              <div className="border-t border-ink/8 my-1" />

              {/* 형광펜 */}
              <ToolButton
                icon="▌" label="형광펜" open={rightOpen}
                active={editor?.isActive("highlight") ?? false}
                onClick={() => editor?.chain().focus().toggleHighlight().run()}
                disabled={!editor}
                highlightActive={editor?.isActive("highlight") ?? false}
              />

              <div className="border-t border-ink/8 my-1" />

              {/* 텍스트 컬러 팔레트 */}
              {rightOpen && (
                <div className="px-1 pb-1">
                  <p className="text-[9px] text-ink-muted/60 mb-1.5">글자 색</p>
                  <div className="flex flex-wrap gap-1">
                    {TEXT_COLORS.map(({ hex, label }) => (
                      <button
                        key={hex}
                        onClick={() => {
                          if (!editor) return;
                          editor.isActive("textStyle", { color: hex })
                            ? editor.chain().focus().unsetColor().run()
                            : editor.chain().focus().setColor(hex).run();
                        }}
                        title={label}
                        disabled={!editor}
                        className={`w-5 h-5 rounded-full border-2 transition-transform hover:scale-110
                          ${editor?.isActive("textStyle", { color: hex })
                            ? "border-ink/50 scale-110"
                            : "border-transparent"
                          }`}
                        style={{ backgroundColor: hex }}
                      />
                    ))}
                    {/* 색상 초기화 */}
                    <button
                      onClick={() => editor?.chain().focus().unsetColor().run()}
                      title="색상 초기화"
                      disabled={!editor}
                      className="w-5 h-5 rounded-full border border-ink/20 text-[8px] text-ink/40
                        flex items-center justify-center hover:border-ink/40 transition-colors
                        disabled:opacity-30"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── 몰입기간 자리 (PR6) ── */}
      <div className="mt-auto px-1.5 pb-2">
        <div
          className="rounded-sm overflow-hidden bg-white"
          style={{ boxShadow: "0 1px 3px rgba(44,44,42,0.10), 0 0.5px 1px rgba(44,44,42,0.06)" }}
        >
          <div
            className="flex justify-end px-2 pt-1.5 pb-1"
            style={{ background: COLORS.flow.bg }}
          >
            <span className="text-[9px] font-semibold text-ink">
              {rightOpen ? "몰입기간" : "F"}
            </span>
          </div>
          <div className="p-2 bg-white">
            <div className="text-[9px] text-ink-muted/40 text-center">PR6</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 도구 버튼 서브컴포넌트 ────────────────────────────────────────────────
interface ToolButtonProps {
  icon: string;
  label: string;
  open: boolean;
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
  btnStyle?: string;
  highlightActive?: boolean;
}

function ToolButton({
  icon, label, open, active, onClick, disabled, btnStyle, highlightActive,
}: ToolButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      className={`w-full rounded transition-all disabled:opacity-30
        ${open ? "flex items-center gap-2 px-2 py-1.5" : "flex justify-center p-2"}
        ${active
          ? highlightActive !== undefined
            ? "bg-yellow-100 text-ink"
            : "bg-ink/10 text-ink"
          : "text-ink/60 hover:bg-ink/5 hover:text-ink"
        }`}
    >
      <span className={`text-xs font-mono ${btnStyle ?? ""}`}>{icon}</span>
      {open && <span className="text-xs">{label}</span>}
    </button>
  );
}
