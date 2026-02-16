# gangji - Flow Operating System

--------------------------------------------------
## 0. 프로젝트 정의
--------------------------------------------------

gangji는 생산성 도구가 아니다.

이 시스템은 **"흐름을 다루기 위한 인터페이스"**다.

### 핵심 철학

```
Execute first, organize later
```

사용자는 계획하지 않는다.

사용자는 **"백지를 펼치고 바로 쓴다"**.

구조는 나중에 생긴다.

### 근본 진실

인간의 행동은 계획에 의해 제어되지 않는다. **"상태"**와 **"흐름"**에 의해 제어된다.

전통적인 시스템이 실패하는 이유:
- 행동 전에 구조를 강요함
- 선형적 시간 (일/주)을 가정함
- 계획이 깨질 때 죄책감을 만듦

**gangji는 이것을 역전시킨다.**

행동이 먼저 온다. 구조는 나중에 온다.

--------------------------------------------------
## 1. 핵심 행동 모델 (가장 중요)
--------------------------------------------------

이 시스템은 다음의 흐름 순환을 **반드시** 구현해야 한다:

```
RUN (달리기) → STAND (서기) → SIT (앉기)
```

**이 흐름은 시스템의 중심이며 절대 변경할 수 없다.**

### 각 상태의 정의

**RUN (실행/몰입)**
- 몰입 상태
- 실행 중심
- 통제되지 않은 출력 허용
- 높은 에너지 상태
- 시스템은 출력을 장려함

**STAND (복기/정리)**
- 반성/복기
- 수행한 것을 검토
- 다음 방향 정의
- 통제력 회복
- 시스템은 연결을 장려함 (과거 → 다음)

**SIT (휴식)**
- 휴식
- 낮은 에너지 허용
- 압박 없음
- 비활동 허용
- 시스템은 압박을 제거함

### 몰입주간 (Weekly Immersion)

**사용자는 일 단위로 움직이지 않는다. 몰입 주기로 움직인다.**

각 몰입 주기:
- 테마를 가짐
- RUN/STAND/SIT로 구성된 주간들로 이루어짐
- 일간 단위가 아닌 주간 기반 흐름

**시스템은 반드시 이것을 1차 구조로 지원해야 한다.**

### 행동 의미

이것은 선택 사항이 아니다. 이것은 시스템의 **핵심 행동 엔진**이다.

사용자는:
- RUN 중에는 제약 없이 쏟아냄
- STAND 중에는 복기하고 정리함
- SIT 중에는 쉬어도 됨

시스템은 각 상태에 맞는 UI와 안내를 제공하되, **절대 강요하지 않는다**.

--------------------------------------------------
## 2. 기술 스택 (고정)
--------------------------------------------------

다음 기술 스택은 변경할 수 없다:

- **Next.js** (App Router)
- **TypeScript**
- **TailwindCSS**
- **Zustand** (상태 관리)
- **IndexedDB (Dexie)** (로컬 저장소)
- **TipTap Editor** (에디터)

--------------------------------------------------
## 3. 아키텍처 원칙
--------------------------------------------------

### 3.1 Local-first (필수)

- 서버 없음
- 인증 없음
- 로그인 없음
- 모든 데이터는 로컬 저장
- 사용자가 자신의 데이터를 완전히 소유

**이것은 협상 불가능하다.**

### 3.2 StorageAdapter 필수

앱은 저장 방식에 의존하면 안 된다.

```typescript
interface StorageAdapter {
  // Page operations
  savePage(page: Page): Promise<void>
  getPage(id: string): Promise<Page | null>
  getPageByDate(date: string): Promise<Page | null>
  listPages(): Promise<Page[]>
  deletePage(id: string): Promise<void>

  // Bundle operations
  saveBundle(bundle: Bundle): Promise<void>
  getBundle(id: string): Promise<Bundle | null>
  listBundles(): Promise<Bundle[]>
  deleteBundle(id: string): Promise<void>

  // Sprint operations
  saveSprint(sprint: Sprint): Promise<void>
  getSprint(id: string): Promise<Sprint | null>
  getCurrentSprint(): Promise<Sprint | null>
  listSprints(): Promise<Sprint[]>
  deleteSprint(id: string): Promise<void>

  // Query operations
  getPagesByTag(tag: string): Promise<Page[]>
  getPagesByTab(tab: string): Promise<Page[]>
  getBookmarkedPages(): Promise<Page[]>
}
```

**현재:** IndexedDB (Dexie)
**미래:** SQLite (Tauri/Capacitor) / File system

### 3.3 데이터 안정성

- **Dexie versioning** 적용
- schema 변경 시 **migration** 지원
- content는 **TipTap JSON**으로 저장
- **export 기능**으로 데이터 보호 (JSON)
- 사용자는 언제든 데이터를 추출할 수 있어야 함

--------------------------------------------------
## 4. 데이터 모델
--------------------------------------------------

### Page

```typescript
type Page = {
  id: string              // nanoid
  date: string            // YYYY-MM-DD
  title?: string          // optional
  content: string         // TipTap JSON
  tabs: string[]          // 탭 (메타 분류)
  tags: string[]          // 태그
  bookmarked: boolean     // 북마크 여부
  bundleId?: string       // 연속 작성 묶음 ID
  createdAt: string       // ISO timestamp
  updatedAt: string       // ISO timestamp
}
```

### Bundle

```typescript
type Bundle = {
  id: string              // nanoid
  title: string           // 묶음 제목
  pageIds: string[]       // 속한 Page ID들
  startDate: string       // YYYY-MM-DD
  endDate: string         // YYYY-MM-DD
  createdAt: string
  updatedAt: string
}
```

**중요:** UI는 주로 **Bundle 중심**으로 동작해야 한다. Page는 내부 단위.

### Sprint (몰입주간)

```typescript
type Sprint = {
  id: string              // nanoid
  theme: string           // 몰입 테마 (1줄)
  startDate: string       // YYYY-MM-DD
  endDate?: string        // 종료 시 설정
  weeks: Week[]           // 주간 배열
  createdAt: string
  updatedAt: string
}
```

### Week

```typescript
type Week = {
  type: 'run' | 'stand' | 'sit'  // 주간 유형
  goal: string                    // 주간 목표 (1줄, 짧게)
  startDate: string               // 해당 주의 시작일 (YYYY-MM-DD)
}
```

--------------------------------------------------
## 5. UI/UX 구조
--------------------------------------------------

### 5.1 전체 레이아웃

```
┌─────────────────────────────────────────────────┐
│ TopBar                                          │
├──────┬──────────────────────────────────────────┤
│ Left │ Main Area (80%)                          │
│ Nav  │                                          │
│      │ - Calendar View (흐름 지도)              │
│      │ - Blank Editor (백지 입력)               │
│      │                                          │
├──────┴──────────────────────────────────────────┤
│ Bottom Flow Section (Sprint 표시)               │
└─────────────────────────────────────────────────┘
```

**TopBar:**
- 뷰 전환 버튼 (Calendar ↔ Editor)
- 북마크 토글 버튼
- 네비게이션 컨트롤

**LeftNav:**
- Bookmarks 목록
- Tabs 목록
- Tags 클라우드

**Main Area:**
- Calendar View 또는 Blank Editor 표시
- 80% 너비

**Bottom Flow Section:**
- 현재 Sprint 표시
- RUN/STAND/SIT 주간 스트립

### 5.2 뷰 전환 (핵심 동작)

Main Area는 다음 두 뷰를 토글:

1. **Calendar View** - 흐름 시각화
2. **Blank Editor** - 백지 입력

사용자는 클릭 한 번으로 전환 가능해야 한다.

### 5.3 Calendar (흐름 지도)

**달력은 계획용이 아니다. "흐름 지도"다.**

Calendar가 보여주는 것:
- 기록의 **존재** (백지 아이콘 또는 점)
- 몰입 기간 (플래그 또는 강조)
- 흐름 상태 (RUN/STAND/SIT)

**시각화 규칙:**
- 빈 날에 대한 페널티 없음
- 빨강/에러 상태 없음
- **존재만 시각화**

**색상 로직:**
- **Grey** = 계획된 / 할당된
- **Colored** = 실제 상호작용 발생

**존재 기준:**
- **ANY interaction** (쓰기, 열기 등)
- 완료 여부 아님

**동작:**
- 날짜 클릭 → 해당 날짜의 Page 로드 → Editor로 전환
- 존재하지 않으면 자동 생성

### 5.4 Blank Editor (핵심 인터페이스)

**이것이 가장 중요한 부분이다.**

#### 진입

사용자가 "Open Blank" 클릭 시:

시스템은 **반드시**:
- 즉시 에디터 열기
- 커서를 content 영역에 포커스
- **중간 단계 없음**

**1초 내에 타이핑 가능해야 한다.**

#### 쓰기 행동

사용자는 반드시:
- 즉시 타이핑 시작 가능
- 모든 메타데이터 무시 가능
- 구조 없이 쓰기 가능

#### 메타데이터 (2차)

다음은 **선택 사항**:
- title
- tabs
- tags
- bookmark
- bundle (연속 작성)

**이것들은 쓰기를 차단해서는 안 된다.**

#### 저장

- **auto-save** 항상
- **저장 버튼 없음**
- **확인 없음**
- 500ms debounce로 자동 저장

#### 에디터 모델

- 사용자 입력: plain text (rich)
- 내부 저장: TipTap JSON

### 5.5 Sprint System (하단 섹션)

**이것은 시스템의 제어 레이어다.**

#### 구조

각 몰입 주기:
- 테마
- 기간
- 주간들로 구성

각 주간:
- 유형: RUN / STAND / SIT
- 목표: 짧은 텍스트 (1줄)
- 시작일

#### UI 표현

하단 섹션은 다음을 포함:

**(1) Current Flow Card**
- 테마
- 기간
- 현재 상태
- 목표

**(2) Week Strip**

시각적 표현:
```
[ STAND ][ RUN ][ RUN ][ SIT ]
```

**색상:**
- RUN: 빨강
- STAND: 노랑
- SIT: 파랑

#### 상호작용

- **Hover:** 설명 표시
- **Click:** 주간 편집

--------------------------------------------------
## 6. UX 절대 규칙
--------------------------------------------------

다음 규칙은 **기능보다 우선한다**:

1. **클릭 후 1초 내 입력 가능**
2. **저장 버튼 없음**
3. **입력 차단 없음**
4. **실패/경고 UI 없음**
5. **선택지는 3개 이하**

사용자는:
- 생각하지 않고 열고
- 생각하지 않고 쓰고
- 생각하지 않고 닫는다

시스템은:
- 방해하지 않고
- 저장하고
- 보여준다

**"이 규칙은 기능보다 우선한다."**

--------------------------------------------------
## 7. 에디터 규칙
--------------------------------------------------

### 허용 기능

- **bold** / **italic** / **underline**
- **heading** (h1, h2, h3)
- **list** (bullet, numbered)
- **highlight**
- **color** (텍스트 색상)

### 금지 기능

- 폰트 선택
- 폰트 크기 직접 선택
- 복잡한 스타일 UI
- 표 (table)
- 이미지 업로드 (Phase A에서는)

**에디터는 가볍고 빨라야 한다.**

--------------------------------------------------
## 8. 금지 사항
--------------------------------------------------

다음 기능은 **절대 구현하지 않는다**:

- ❌ todo / 체크리스트
- ❌ 일정 관리
- ❌ 스트릭 / 점수 시스템
- ❌ 완료율
- ❌ 목표 달성률
- ❌ 서버 기능
- ❌ 강제 입력
- ❌ 일일 알림/리마인더
- ❌ 소셜 기능
- ❌ 공유 기능 (Phase A)

**gangji는 사용자의 흐름을 신뢰하고 비켜선다.**

--------------------------------------------------
## 9. 디자인 언어
--------------------------------------------------

### 컨셉

**아날로그 백지 노트 (갱지)**

gangji는 종이 백지에서 영감을 받았다.

### 특성

- **따뜻한 종이 색감** (#fefdfb 배경)
- **부드러운 그림자** (shadow-sm)
- **최소한의 테두리**
- **가볍고 차분한 느낌**
- **비기술적 (non-technical)**

### UI 금지 사항

- ❌ 대시보드 느낌
- ❌ 복잡한 차트
- ❌ 강렬한 색상
- ❌ 위협적인 UI

**사용자는 편안함을 느껴야 한다.**

### 색상 전략

- **Grey** = 계획된/할당된
- **Colored** = 실제 상호작용 발생
- **Green** = 존재 표시 (달력)
- **Yellow** = 북마크
- **Red** = RUN
- **Yellow** = STAND
- **Blue** = SIT

--------------------------------------------------
## 10. 전체 개발 로드맵
--------------------------------------------------

### Phase A — Local MVP (즉시 사용)

**목표:** 사용자가 오늘부터 사용 가능

**구현:**
- 백지 입력
- 자동 저장
- 달력 시각화
- 몰입주간 (RUN/STAND/SIT)

**완료 기준:**
- 앱을 열고 즉시 쓸 수 있음
- 달력에서 기록 확인 가능
- Sprint 생성 및 표시 가능

### Phase B — 제품 완성도

**목표:** 실용적 도구로 성장

**구현:**
- 태그/탭/북마크 필터링
- 검색 (전체 텍스트)
- 데이터 백업/복구 (JSON export/import)
- 성능 최적화 (대량 페이지 처리)

### Phase C — 플랫폼 확장

**목표:** PC/모바일 동일 경험

**구현:**
- Desktop: Tauri + SQLite
- Mobile: Capacitor + SQLite
- 동기화 (로컬 우선, 선택적)

**Storage 전환:**
- IndexedDB → SQLite
- StorageAdapter 덕분에 비즈니스 로직 변경 없음

--------------------------------------------------
## 11. Phase A - 오늘 개발 목표 (절대 기준)
--------------------------------------------------

**다음 5가지를 반드시 구현:**

1. **백지 펼치기 → 즉시 타이핑**
   - 앱 열기 → Editor 자동 열림 → 커서 포커스 → 타이핑
   - 1초 내 완료

2. **자동 저장 + 재접속 시 복원**
   - 500ms debounce 자동 저장
   - 앱 재시작 시 오늘 페이지 자동 로드

3. **달력 ↔ 에디터 전환**
   - TopBar에서 뷰 토글
   - 달력 날짜 클릭 → 에디터로 전환 + 해당 날짜 페이지 로드

4. **기록 존재 날짜 표시**
   - 달력에 초록 점 (또는 아이콘)
   - 내용이 있는 날짜 시각화

5. **몰입주간 생성 및 표시**
   - Sprint 생성 UI
   - RUN/STAND/SIT 주간 설정
   - 하단 섹션에 Week Strip 표시

**이 상태 = "실사용 가능 상태"**

--------------------------------------------------
## 12. Phase A - PR 기반 실행 계획
--------------------------------------------------

### PR1 — Storage

**구현:**
- `/types/*.ts` - Page, Bundle, Sprint, Week 타입 정의
- `/lib/storage/adapter.ts` - StorageAdapter 인터페이스
- `/lib/storage/db.ts` - Dexie schema + versioning
- `/lib/storage/indexedDBAdapter.ts` - Adapter 구현
- `/lib/storage/storage.ts` - Singleton 서비스

**완료 조건:**
- 모든 CRUD 동작 테스트 완료
- IndexedDB에서 데이터 확인 가능

### PR2 — Layout

**구현:**
- `/components/layout/TopBar.tsx` - 뷰 전환, 북마크 토글
- `/components/layout/LeftNav.tsx` - 접을 수 있는 사이드바
- `/components/layout/FlowSection.tsx` - Sprint 표시
- `/app/layout.tsx` - 전체 레이아웃 조립

**완료 조건:**
- 레이아웃 렌더링 확인
- TopBar 뷰 전환 동작

### PR3 — Editor (핵심)

**구현:**
- `/components/editor/BlankEditor.tsx` - TipTap 에디터
  - autofocus: 'end'
  - onUpdate + 500ms debounce
  - Placeholder 확장
  - Prose 스타일링
- `/store/pageStore.ts` - 페이지 상태 관리
  - loadTodayPage()
  - updatePageContent() - debounced
  - updatePageTitle/addTag/removeTag/toggleBookmark()
- `/app/page.tsx` - 메인 진입점
  - useEffect로 오늘 페이지 로드
  - Editor 렌더링

**완료 조건:**
- 앱 열기 → 즉시 타이핑 가능 (< 1초)
- 자동 저장 동작 확인
- 재시작 시 내용 복원 확인

### PR4 — Calendar

**구현:**
- `/app/calendar/page.tsx` - Calendar 라우트
- `/components/calendar/CalendarView.tsx` - 월 그리드
  - date-fns 사용
  - 이전/다음 월, 오늘 버튼
- `/components/calendar/CalendarDay.tsx` - 날짜 셀
  - 날짜 번호
  - 초록 점 (내용 존재 시)
  - 노랑 별 (북마크 시)
  - 클릭 → 페이지 로드 → Editor 전환

**완료 조건:**
- 달력 렌더링 확인
- 내용 있는 날짜에 초록 점 표시
- 날짜 클릭 시 페이지 로드 확인

### PR5 — Sprint

**구현:**
- `/components/sprint/SprintDisplay.tsx` - Sprint 카드
- `/components/sprint/WeekCard.tsx` - 주간 카드
  - RUN (빨강), STAND (노랑), SIT (파랑)
- `/store/sprintStore.ts` - Sprint 상태 관리
  - loadCurrentSprint()
  - createSprint(theme, weeks[])

**완료 조건:**
- Sprint 생성 가능
- 하단 섹션에 Week Strip 표시
- 색상 구분 확인

### PR6 — Editor Tools

**구현:**
- TipTap 확장: Highlight, Color, TextStyle
- Bubble menu (선택 시 나타남)
- Toolbar (bold, italic, underline, heading, list)

**완료 조건:**
- 모든 허용 기능 동작 확인
- Bubble menu 표시 확인

### PR7 — Backup

**구현:**
- Export JSON (모든 데이터)
- Import JSON (복구)
- `/lib/utils/export.ts` - export 로직

**완료 조건:**
- Export 파일 다운로드 확인
- Import 시 데이터 복구 확인

--------------------------------------------------
## 13. 구현 우선순위
--------------------------------------------------

다음 순서로 구현:

1. **Layout** (기반)
2. **Blank Editor** (핵심)
3. **Local storage** (데이터)
4. **Calendar visualization** (흐름 지도)
5. **Flow system (Sprint)** (행동 모델)

**Editor가 가장 중요하다.** 이것이 동작하지 않으면 나머지는 의미 없다.

--------------------------------------------------
## 14. 성공 기준
--------------------------------------------------

사용자가 생각하지 않고

앱을 열고
→ 바로 쓰고
→ 자연스럽게 이어서 쓰는 것

**이게 가능하면 성공이다.**

### 구체적 검증

1. **즉시 쓰기:**
   - 앱 열기 → 1초 내 타이핑 시작 가능

2. **자동 저장:**
   - 타이핑 → 자동 저장 → 재시작 → 내용 복원

3. **흐름 시각화:**
   - 달력에서 기록 존재 확인
   - 빈 날에 대한 죄책감 없음

4. **몰입 주기:**
   - Sprint 생성 → Week Strip 표시
   - RUN/STAND/SIT 구분 명확

5. **압박 없음:**
   - 저장 버튼 없음
   - 에러 메시지 없음
   - 강제 입력 없음

**사용자는 편안함을 느껴야 한다.**

--------------------------------------------------
## 15. 최종 정의
--------------------------------------------------

gangji는 도구가 아니다.

이것은

**"내 안의 흐름을 내가 다루게 만드는 시스템"**

이다.

### 핵심 원칙 재확인

1. **Execute first, organize later**
   - 행동이 먼저, 구조는 나중

2. **RUN → STAND → SIT**
   - 인간의 에너지 순환을 존중

3. **Blank-first interface**
   - 백지를 펼치는 순간부터 시작

4. **No pressure**
   - 시스템은 압박하지 않는다

5. **Local-first**
   - 사용자가 자신의 데이터를 소유

### 최종 목표

사용자가 자신의 내면 혼돈을 제어하는 것이 아니라,

**흐름을 통해 형태화하도록 돕는다.**

gangji는 사용자의 흐름을 신뢰하고 비켜선다.

그것이 이 시스템의 존재 이유다.
