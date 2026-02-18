/**
 * PeriodIcons — 기간 타입별 SVG 졸라맨 아이콘
 * RUN(달리기) / STAND(서기) / SIT(앉기)
 * React import 없음 - 순수 SVG 컴포넌트
 */

interface IconProps {
  size?: number;
  color?: string;
}

/** 달리기 — 앞으로 기울어진 달리는 자세 */
export function RunIcon({ size = 16, color = "currentColor" }: IconProps) {
  return (
    <svg
      width={size}
      height={Math.round(size * 1.2)}
      viewBox="0 0 20 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* 머리 */}
      <circle cx="15" cy="3.5" r="2" fill={color} stroke="none" />
      {/* 몸통 (앞으로 기울어짐) */}
      <line x1="14" y1="5.5" x2="10" y2="13" />
      {/* 오른팔 (앞으로) */}
      <line x1="12.5" y1="8.5" x2="18" y2="6" />
      {/* 왼팔 (뒤로) */}
      <line x1="12.5" y1="8.5" x2="8" y2="12" />
      {/* 오른다리 (앞으로) */}
      <line x1="10" y1="13" x2="15" y2="19" />
      <line x1="15" y1="19" x2="19" y2="18" />
      {/* 왼다리 (뒤로) */}
      <line x1="10" y1="13" x2="6" y2="20" />
    </svg>
  );
}

/** 서기 — 직립 자세 */
export function StandIcon({ size = 16, color = "currentColor" }: IconProps) {
  return (
    <svg
      width={size}
      height={Math.round(size * 1.2)}
      viewBox="0 0 20 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* 머리 */}
      <circle cx="10" cy="3.5" r="2" fill={color} stroke="none" />
      {/* 몸통 */}
      <line x1="10" y1="5.5" x2="10" y2="14" />
      {/* 왼팔 */}
      <line x1="10" y1="9" x2="6" y2="13" />
      {/* 오른팔 */}
      <line x1="10" y1="9" x2="14" y2="13" />
      {/* 왼다리 */}
      <line x1="10" y1="14" x2="7" y2="23" />
      {/* 오른다리 */}
      <line x1="10" y1="14" x2="13" y2="23" />
    </svg>
  );
}

/** 앉기 — 의자에 앉은 자세 */
export function SitIcon({ size = 16, color = "currentColor" }: IconProps) {
  return (
    <svg
      width={size}
      height={Math.round(size * 1.2)}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* 머리 */}
      <circle cx="7" cy="3.5" r="2" fill={color} stroke="none" />
      {/* 상체 */}
      <line x1="7" y1="5.5" x2="7" y2="13" />
      {/* 왼팔 */}
      <line x1="7" y1="9" x2="3.5" y2="13" />
      {/* 오른팔 */}
      <line x1="7" y1="9" x2="11" y2="11" />
      {/* 좌석 (수평) */}
      <line x1="7" y1="13" x2="17" y2="13" />
      {/* 왼다리 (아래로) */}
      <line x1="7" y1="13" x2="5.5" y2="21" />
      {/* 오른다리 (아래로) */}
      <line x1="17" y1="13" x2="18.5" y2="21" />
    </svg>
  );
}

/** 타입에 따라 아이콘 반환 */
export function PeriodIcon({
  type,
  size = 16,
  color = "currentColor",
}: {
  type: "run" | "stand" | "sit";
  size?: number;
  color?: string;
}) {
  if (type === "run") return <RunIcon size={size} color={color} />;
  if (type === "stand") return <StandIcon size={size} color={color} />;
  return <SitIcon size={size} color={color} />;
}
