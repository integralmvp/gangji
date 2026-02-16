"use client";

/**
 * LeftNav Component
 * 포스트잇 인덱스 탭 (노트 옆면)
 * - Grid 구조: LogoSlot (64px) + IndexTabs (1fr)
 * - IndexTabs: 포스트잇처럼 살짝 튀어나오는 탭
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
    <nav className="h-full bg-paper-light border-r border-ink/10 grid grid-rows-[64px_1fr] overflow-hidden">
      {/* Logo Slot: Header와 같은 높이 (64px) */}
      <div className="flex items-center px-4">
        <div>
          <h2 className="text-lg font-bold text-ink">Gangji</h2>
          <p className="text-xs text-ink-muted">흐름의 OS</p>
        </div>
      </div>

      {/* Index Tabs: 포스트잇 느낌 (그리드 내부 스크롤) */}
      <div className="overflow-y-auto p-3 space-y-4">
        {/* Recent Section */}
        <div className="space-y-1">
          {navSections.map((section) => (
            <button
              key={section.id}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-r-lg bg-paper hover:bg-paper-dark hover:shadow-md hover:translate-x-1 transition-all text-left border-l-4 border-ink/20"
            >
              <span className="text-base">{section.icon}</span>
              <span className="text-ink text-sm font-medium">{section.label}</span>
            </button>
          ))}
        </div>

        {/* Immersion Tabs Section */}
        <div className="space-y-1">
          <div className="text-[10px] text-ink-muted uppercase tracking-wide mb-1 px-2">
            몰입 탭
          </div>
          {immersionTabs.map((tab) => (
            <button
              key={tab.id}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-r-lg bg-paper hover:bg-paper-dark hover:shadow-md hover:translate-x-1 transition-all text-left border-l-4 border-ink/20"
            >
              <span className="text-base">{tab.icon}</span>
              <span className="text-ink text-sm">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Organize Sections */}
        <div className="space-y-1">
          {organizeSections.map((section) => (
            <button
              key={section.id}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-r-lg bg-paper hover:bg-paper-dark hover:shadow-md hover:translate-x-1 transition-all text-left border-l-4 border-ink/20"
            >
              <span className="text-base">{section.icon}</span>
              <span className="text-ink text-sm">{section.label}</span>
            </button>
          ))}
        </div>

        {/* Placeholder hint */}
        <div className="text-[10px] text-ink-muted px-2 py-2 bg-paper-dark/20 rounded">
          <p>기능 연결은 PR8 이후</p>
        </div>
      </div>
    </nav>
  );
}
