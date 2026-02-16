"use client";

import { useUIStore } from "@/store/uiStore";
import TopBar from "@/components/layout/TopBar";
import LeftNav from "@/components/layout/LeftNav";
import FlowSection from "@/components/layout/FlowSection";
import CalendarView from "@/components/calendar/CalendarView";
import BlankEditor from "@/components/editor/BlankEditor";

/**
 * Main Page - Gangji Layout
 *
 * Layout structure:
 * ┌─────────────────────────────────────┐
 * │ TopBar (date + view toggle)         │
 * ├──────────┬──────────────────────────┤
 * │ LeftNav  │ Main (Calendar | Editor) │
 * │          │                          │
 * ├──────────┴──────────────────────────┤
 * │ FlowSection (Bottom)                │
 * └─────────────────────────────────────┘
 *
 * View switching: calendar ↔ editor (state-based, no routing)
 * Default: editor (immediate writing)
 */
export default function Home() {
  const { viewMode } = useUIStore();

  return (
    <div className="h-screen flex flex-col bg-paper">
      {/* TopBar: Fixed top */}
      <TopBar />

      {/* Main Layout: LeftNav + Main */}
      <div className="flex flex-1 overflow-hidden">
        {/* LeftNav: Fixed left */}
        <LeftNav />

        {/* Main: Dynamic view (80% width target) */}
        <main className="flex-1 overflow-auto">
          {viewMode === "calendar" ? <CalendarView /> : <BlankEditor />}
        </main>
      </div>

      {/* FlowSection: Fixed bottom */}
      <FlowSection />
    </div>
  );
}
