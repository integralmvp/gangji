"use client";

/**
 * LeftNav Component
 *
 * Left navigation panel with analog note/tab feeling
 * Phase A: Skeleton structure only (no data connection)
 * - Recent
 * - Tabs
 * - Tags
 * - Bookmarks
 * - Search
 *
 * Design: Post-it/tab style, paper tone
 */
export default function LeftNav() {
  const navSections = [
    { id: "recent", label: "최근", icon: "📝" },
    { id: "tabs", label: "탭", icon: "📂" },
    { id: "tags", label: "보관소", icon: "🏷️" },
    { id: "bookmarks", label: "북마크", icon: "⭐" },
    { id: "search", label: "검색", icon: "🔍" },
  ];

  return (
    <nav className="w-64 bg-paper-light border-r border-paper-dark p-4 flex flex-col gap-2">
      {/* Logo/Title */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-ink">Gangji</h2>
        <p className="text-sm text-ink-light">흐름을 다루는 개인 OS</p>
      </div>

      {/* Navigation Sections (Placeholder) */}
      {navSections.map((section) => (
        <button
          key={section.id}
          className="flex items-center gap-3 px-4 py-3 rounded bg-paper hover:bg-paper-dark transition-colors text-left"
        >
          <span className="text-xl">{section.icon}</span>
          <span className="text-ink font-medium">{section.label}</span>
        </button>
      ))}

      {/* Placeholder hint */}
      <div className="mt-auto text-xs text-ink-light p-2">
        <p>기능 연결은 PR8 이후 구현</p>
      </div>
    </nav>
  );
}
