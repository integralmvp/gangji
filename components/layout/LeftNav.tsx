"use client";

/**
 * LeftNav Component
 * 노트 옆면 인덱스 (탭/포스트잇 느낌)
 * Phase A: Skeleton structure only (no data connection)
 * - Recent
 * - Immersion Tabs (RUN/STAND/SIT)
 * - Tabs
 * - Tags
 * - Bookmarks
 * - Search
 */
export default function LeftNav() {
  const navSections = [
    { id: "recent", label: "최근", icon: "📝" },
  ];

  const immersionTabs = [
    { id: "run", label: "달리기", icon: "🏃" },
    { id: "stand", label: "서기", icon: "🧍" },
    { id: "sit", label: "앉기", icon: "🪑" },
  ];

  const organizeSections = [
    { id: "tabs", label: "탭", icon: "📂" },
    { id: "tags", label: "보관소", icon: "🏷️" },
    { id: "bookmarks", label: "북마크", icon: "⭐" },
    { id: "search", label: "검색", icon: "🔍" },
  ];

  return (
    <nav className="h-full bg-paper-light border-r border-ink/10 p-4 flex flex-col gap-6">
      {/* Logo/Title */}
      <div className="pb-4 border-b border-ink/10">
        <h2 className="text-xl font-bold text-ink">Gangji</h2>
        <p className="text-xs text-ink-muted mt-1">흐름을 다루는 개인 OS</p>
      </div>

      {/* Recent Section */}
      <div className="flex flex-col gap-1">
        {navSections.map((section) => (
          <button
            key={section.id}
            className="flex items-center gap-2 px-3 py-2 rounded-md bg-paper hover:shadow-sm hover:translate-x-0.5 transition-all text-left border border-ink/5"
          >
            <span className="text-lg">{section.icon}</span>
            <span className="text-ink text-sm font-medium">{section.label}</span>
          </button>
        ))}
      </div>

      {/* Immersion Tabs Section */}
      <div className="flex flex-col gap-1">
        <div className="text-xs text-ink-muted uppercase tracking-wide mb-2 px-1">
          몰입 탭
        </div>
        {immersionTabs.map((tab) => (
          <button
            key={tab.id}
            className="flex items-center gap-2 px-3 py-2 rounded-md bg-paper hover:shadow-sm hover:translate-x-0.5 transition-all text-left border border-ink/5"
          >
            <span className="text-lg">{tab.icon}</span>
            <span className="text-ink text-sm">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Organize Sections */}
      <div className="flex flex-col gap-1">
        {organizeSections.map((section) => (
          <button
            key={section.id}
            className="flex items-center gap-2 px-3 py-2 rounded-md bg-paper hover:shadow-sm hover:translate-x-0.5 transition-all text-left border border-ink/5"
          >
            <span className="text-lg">{section.icon}</span>
            <span className="text-ink text-sm">{section.label}</span>
          </button>
        ))}
      </div>

      {/* Placeholder hint */}
      <div className="mt-auto text-xs text-ink-muted p-2 bg-paper-dark/30 rounded">
        <p>기능 연결은 PR8 이후</p>
      </div>
    </nav>
  );
}
