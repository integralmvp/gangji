/**
 * Storage Facade
 *
 * 싱글톤 형태로 현재 adapter를 노출
 * 나중에 SQLite나 다른 저장소로 교체하기 쉽게 설계
 */

import type { StorageAdapter } from "./adapter";
import { IndexedDBAdapter } from "./indexedDBAdapter";

/**
 * 현재 사용 중인 StorageAdapter 인스턴스
 */
let currentAdapter: StorageAdapter | null = null;

/**
 * StorageAdapter 초기화
 * 브라우저 환경에서만 실행됨 (SSR 방지)
 */
function initAdapter(): StorageAdapter {
  if (currentAdapter) {
    return currentAdapter;
  }

  // 현재는 IndexedDB만 지원
  // 향후: Tauri/Capacitor 환경 감지 후 적절한 adapter 선택
  currentAdapter = new IndexedDBAdapter();

  return currentAdapter;
}

/**
 * 전역 storage 인스턴스
 * 앱 전체에서 이 객체를 통해 데이터 접근
 *
 * @example
 * import { storage } from '@/lib/storage/storage';
 * const page = await storage.getPage(id);
 */
export const storage: StorageAdapter = new Proxy({} as StorageAdapter, {
  get(_target, prop) {
    const adapter = initAdapter();
    return (adapter as any)[prop];
  },
});

/**
 * Adapter를 수동으로 교체 (테스트/마이그레이션 용)
 */
export function setAdapter(adapter: StorageAdapter): void {
  currentAdapter = adapter;
}
