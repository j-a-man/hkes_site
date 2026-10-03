// Hand-drawn marks lifted from the HKES flyer style. All decorative, all
// colored with `currentColor`, sized by the caller.

interface DoodleProps {
  className?: string;
  strokeWidth?: number;
}

export function Sparkle({ className = '', filled = true, strokeWidth = 2.5 }: DoodleProps & { filled?: boolean }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true" focusable="false">
      <path
        d="M20 2Q22.6 17.4 38 20Q22.6 22.6 20 38Q17.4 22.6 2 20Q17.4 17.4 20 2Z"
        fill={filled ? 'currentColor' : 'none'}
        stroke={filled ? 'none' : 'currentColor'}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Burst({ className = '', strokeWidth = 3 }: DoodleProps) {
  return (
    <svg viewBox="0 0 40 32" className={className} aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round">
      <path d="M13 26 4.5 21" />
      <path d="M19.3 22 18.4 12" />
      <path d="M26.1 24.9 33.8 18.4" />
    </svg>
  );
}

export function Squiggle({ className = '', strokeWidth = 3 }: DoodleProps) {
  return (
    <svg viewBox="0 0 120 12" preserveAspectRatio="none" className={className} aria-hidden="true" focusable="false" fill="none">
      <path
        d="M2 7C10 1 18 1 26 6S42 11 50 6 66 1 74 6 90 11 98 6 112 2 118 5"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

// The double underline from the egg tart flyer.
export function Swoosh({ className = '', strokeWidth = 4 }: DoodleProps) {
  return (
    <svg viewBox="0 0 200 24" preserveAspectRatio="none" className={className} aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeLinecap="round">
      <path d="M4 8C60 4 140 3 196 6" strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
      <path d="M34 18C84 15 132 14 168 16" strokeWidth={strokeWidth * 0.75} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function Arrow({ className = '', strokeWidth = 2.5 }: DoodleProps) {
  return (
    <svg viewBox="0 0 60 40" className={className} aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6C12 28 32 35 52 27" />
      <path d="M44.5 19.5 53 27 43.5 32" />
    </svg>
  );
}
