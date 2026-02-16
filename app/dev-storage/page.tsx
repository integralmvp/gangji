"use client";

import { useState } from "react";
import { nanoid } from "nanoid";
import { storage } from "@/lib/storage/storage";
import type { Page, Bundle, Sprint } from "@/types/models";

/**
 * 스모크 테스트 페이지
 * Storage 레이어 동작 확인용
 */
export default function DevStoragePage() {
  const [log, setLog] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLog((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const clearLog = () => setLog([]);

  // ============ Page Tests ============

  const testCreatePage = async () => {
    try {
      const page: Page = {
        id: nanoid(),
        date: "2026-02-16",
        content: JSON.stringify({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "테스트 페이지입니다." }] }] }),
        title: "테스트 페이지",
        tabs: ["run", "dev"],
        tags: ["test"],
        bookmarked: false,
        createdAt: "",
        updatedAt: "",
      };

      await storage.savePage(page);
      addLog(`✅ Page 생성 성공: ${page.id}`);
    } catch (error) {
      addLog(`❌ Page 생성 실패: ${error}`);
    }
  };

  const testGetPage = async () => {
    try {
      const pages = await storage.listPages(1);
      if (pages.length === 0) {
        addLog("⚠️ 조회할 Page가 없습니다.");
        return;
      }

      const page = await storage.getPage(pages[0].id);
      addLog(`✅ Page 조회 성공: ${page?.title || "무제"}`);
    } catch (error) {
      addLog(`❌ Page 조회 실패: ${error}`);
    }
  };

  const testGetPageByDate = async () => {
    try {
      const page = await storage.getPageByDate("2026-02-16");
      if (page) {
        addLog(`✅ 날짜로 Page 조회 성공: ${page.title || "무제"}`);
      } else {
        addLog("⚠️ 해당 날짜의 Page가 없습니다.");
      }
    } catch (error) {
      addLog(`❌ 날짜로 Page 조회 실패: ${error}`);
    }
  };

  const testListPages = async () => {
    try {
      const pages = await storage.listPages(10);
      addLog(`✅ Page 목록 조회 성공: ${pages.length}개`);
    } catch (error) {
      addLog(`❌ Page 목록 조회 실패: ${error}`);
    }
  };

  const testGetPagesByTag = async () => {
    try {
      const pages = await storage.getPagesByTag("test");
      addLog(`✅ 태그로 Page 조회 성공: ${pages.length}개`);
    } catch (error) {
      addLog(`❌ 태그로 Page 조회 실패: ${error}`);
    }
  };

  const testGetPagesByTab = async () => {
    try {
      const pages = await storage.getPagesByTab("run");
      addLog(`✅ 탭으로 Page 조회 성공: ${pages.length}개`);
    } catch (error) {
      addLog(`❌ 탭으로 Page 조회 실패: ${error}`);
    }
  };

  const testGetBookmarkedPages = async () => {
    try {
      const pages = await storage.getBookmarkedPages();
      addLog(`✅ 북마크 Page 조회 성공: ${pages.length}개`);
    } catch (error) {
      addLog(`❌ 북마크 Page 조회 실패: ${error}`);
    }
  };

  // ============ Bundle Tests ============

  const testCreateBundle = async () => {
    try {
      const bundle: Bundle = {
        id: nanoid(),
        title: "테스트 묶음",
        pageIds: [],
        startDate: "2026-02-16",
        endDate: "2026-02-16",
        createdAt: "",
        updatedAt: "",
      };

      await storage.saveBundle(bundle);
      addLog(`✅ Bundle 생성 성공: ${bundle.id}`);
    } catch (error) {
      addLog(`❌ Bundle 생성 실패: ${error}`);
    }
  };

  const testListBundles = async () => {
    try {
      const bundles = await storage.listBundles(10);
      addLog(`✅ Bundle 목록 조회 성공: ${bundles.length}개`);
    } catch (error) {
      addLog(`❌ Bundle 목록 조회 실패: ${error}`);
    }
  };

  // ============ Sprint Tests ============

  const testCreateSprint = async () => {
    try {
      const sprint: Sprint = {
        id: nanoid(),
        theme: "Gangji MVP 개발",
        startDate: "2026-02-16",
        periods: [
          { type: "run", goal: "PR1+PR2 완료", startDate: "2026-02-16" },
        ],
        createdAt: "",
        updatedAt: "",
      };

      await storage.saveSprint(sprint);
      addLog(`✅ Sprint 생성 성공: ${sprint.theme}`);
    } catch (error) {
      addLog(`❌ Sprint 생성 실패: ${error}`);
    }
  };

  const testGetCurrentSprint = async () => {
    try {
      const sprint = await storage.getCurrentSprint();
      if (sprint) {
        addLog(`✅ 현재 Sprint 조회 성공: ${sprint.theme}`);
      } else {
        addLog("⚠️ 현재 활성 Sprint가 없습니다.");
      }
    } catch (error) {
      addLog(`❌ 현재 Sprint 조회 실패: ${error}`);
    }
  };

  const testListSprints = async () => {
    try {
      const sprints = await storage.listSprints(10);
      addLog(`✅ Sprint 목록 조회 성공: ${sprints.length}개`);
    } catch (error) {
      addLog(`❌ Sprint 목록 조회 실패: ${error}`);
    }
  };

  // ============ All Tests ============

  const runAllTests = async () => {
    clearLog();
    addLog("=== 전체 테스트 시작 ===");

    await testCreatePage();
    await testGetPage();
    await testGetPageByDate();
    await testListPages();
    await testGetPagesByTag();
    await testGetPagesByTab();
    await testGetBookmarkedPages();

    await testCreateBundle();
    await testListBundles();

    await testCreateSprint();
    await testGetCurrentSprint();
    await testListSprints();

    addLog("=== 전체 테스트 완료 ===");
  };

  return (
    <div className="min-h-screen p-8 bg-paper">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-ink mb-2">
          Storage Layer Smoke Test
        </h1>
        <p className="text-ink-light mb-8">
          Gangji Storage 레이어 동작 확인
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Page Tests */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold text-ink mb-4">Page Tests</h2>
            <div className="space-y-2">
              <button onClick={testCreatePage} className="w-full px-4 py-2 bg-ink text-paper rounded hover:bg-ink-light">
                Create Page
              </button>
              <button onClick={testGetPage} className="w-full px-4 py-2 bg-ink text-paper rounded hover:bg-ink-light">
                Get Page
              </button>
              <button onClick={testGetPageByDate} className="w-full px-4 py-2 bg-ink text-paper rounded hover:bg-ink-light">
                Get by Date
              </button>
              <button onClick={testListPages} className="w-full px-4 py-2 bg-ink text-paper rounded hover:bg-ink-light">
                List Pages
              </button>
              <button onClick={testGetPagesByTag} className="w-full px-4 py-2 bg-ink text-paper rounded hover:bg-ink-light">
                Get by Tag
              </button>
              <button onClick={testGetPagesByTab} className="w-full px-4 py-2 bg-ink text-paper rounded hover:bg-ink-light">
                Get by Tab
              </button>
              <button onClick={testGetBookmarkedPages} className="w-full px-4 py-2 bg-ink text-paper rounded hover:bg-ink-light">
                Get Bookmarked
              </button>
            </div>
          </div>

          {/* Bundle Tests */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold text-ink mb-4">Bundle Tests</h2>
            <div className="space-y-2">
              <button onClick={testCreateBundle} className="w-full px-4 py-2 bg-ink text-paper rounded hover:bg-ink-light">
                Create Bundle
              </button>
              <button onClick={testListBundles} className="w-full px-4 py-2 bg-ink text-paper rounded hover:bg-ink-light">
                List Bundles
              </button>
            </div>
          </div>

          {/* Sprint Tests */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold text-ink mb-4">Sprint Tests</h2>
            <div className="space-y-2">
              <button onClick={testCreateSprint} className="w-full px-4 py-2 bg-ink text-paper rounded hover:bg-ink-light">
                Create Sprint
              </button>
              <button onClick={testGetCurrentSprint} className="w-full px-4 py-2 bg-ink text-paper rounded hover:bg-ink-light">
                Get Current
              </button>
              <button onClick={testListSprints} className="w-full px-4 py-2 bg-ink text-paper rounded hover:bg-ink-light">
                List Sprints
              </button>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <button
            onClick={runAllTests}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold mr-2"
          >
            🚀 Run All Tests
          </button>
          <button
            onClick={clearLog}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Clear Log
          </button>
        </div>

        {/* Log Display */}
        <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm h-96 overflow-y-auto">
          {log.length === 0 ? (
            <div className="text-gray-500">테스트를 실행하면 결과가 여기에 표시됩니다.</div>
          ) : (
            log.map((entry, idx) => <div key={idx}>{entry}</div>)
          )}
        </div>
      </div>
    </div>
  );
}
