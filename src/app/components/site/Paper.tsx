// Physical paper details: masking tape and torn edges between sections.

const TAPE_CLIP =
  'polygon(3% 0, 97% 0, 100% 14%, 96.5% 28%, 100% 42%, 96.5% 57%, 100% 71%, 96.5% 86%, 98% 100%, 2% 100%, 0 86%, 3.5% 71%, 0 57%, 3.5% 42%, 0 28%, 3.5% 14%)';

interface TapeProps {
  className?: string;
  tone?: 'paper' | 'red';
}

export function Tape({ className = '', tone = 'paper' }: TapeProps) {
  const toneClass =
    tone === 'red'
      ? 'bg-hk-red/85 [background-image:repeating-linear-gradient(-45deg,transparent_0_6px,rgba(255,255,255,0.22)_6px_9px)]'
      : 'bg-[#fbf3e3]/80 [background-image:linear-gradient(rgba(255,255,255,0.45),rgba(0,0,0,0.04))]';
  return <span aria-hidden="true" className={`pointer-events-none absolute block h-7 w-24 ${toneClass} ${className}`} style={{ clipPath: TAPE_CLIP }} />;
}

const EDGE_BACK =
  'M0 24L0 12.8L26 10.6L40 12.2L61 13.7L94 14.9L119 14.2L146 8.5L178 15.8L210 16L231 12L248 14.3L263 8.7L281 9.6L302 8.5L316 9.5L332 11.6L346 16.7L373 9.5L392 11.5L413 9.2L444 17.9L467 12.8L483 9L504 10.6L534 9.6L549 17.5L573 9.5L598 8.3L623 17.8L654 15L673 11.7L691 15.7L715 15.8L736 10.2L766 17.8L797 16.1L828 15.4L846 13.2L867 8.3L882 10.8L901 14.9L934 12.5L967 17.9L1000 11.6L1018 10.3L1036 10L1063 17L1094 12.8L1121 16L1136 14.6L1168 15.8L1197 12.8L1200 15.9L1200 24Z';
const EDGE_FRONT =
  'M0 24L0 9.2L17 12.5L32 11.4L54 6.6L78 6.4L101 6.7L116 10.2L147 7.2L165 12.3L198 11.8L220 15.8L235 14.6L255 7.4L271 9.1L302 7.8L327 12.4L349 11.5L364 6.6L382 12.8L405 9.1L430 10.5L450 13.9L478 8.4L504 11.3L535 13.3L555 15.8L572 10.2L601 7.5L624 6.4L652 13.6L677 14.8L698 13L723 11.8L747 14.4L779 10.7L807 6.6L835 12.5L869 14.2L888 9.9L916 6.2L939 7.7L955 6.6L985 7.3L1004 9.9L1035 6.8L1058 11.5L1090 14.2L1121 8.8L1143 9.6L1175 15.6L1192 7.8L1200 8.3L1200 24Z';

interface TornEdgeProps {
  // Where the edge sits on its (positioned) parent section.
  position: 'top' | 'bottom';
  // Text color utility for the paper being torn, e.g. "text-hk-paper".
  colorClass?: string;
  className?: string;
}

// Paper torn along one edge of a section, drawn in the color of the
// neighbouring section. Keeps a fixed jag size on every screen width.
export function TornEdge({ position, colorClass = 'text-hk-paper', className = '' }: TornEdgeProps) {
  const placement = position === 'bottom' ? 'bottom-[-1px]' : 'top-[-1px] rotate-180';
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-x-0 h-[18px] overflow-hidden ${placement} ${colorClass} ${className}`}>
      <svg viewBox="0 0 1200 24" preserveAspectRatio="none" className="absolute left-1/2 top-0 h-full w-[max(100%,1200px)] -translate-x-1/2">
        <path d={EDGE_BACK} fill="currentColor" opacity="0.45" />
        <path d={EDGE_FRONT} fill="currentColor" />
      </svg>
    </div>
  );
}
