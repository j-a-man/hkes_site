import type { ReactNode } from 'react';

interface PanelProps {
  children: ReactNode;
  className?: string;
  // Edge-to-edge content such as tables; the header keeps its own padding.
  flush?: boolean;
}

// The portal's basic card: a sheet of paper on the desk.
export function Panel({ children, className = '', flush = false }: PanelProps) {
  return (
    <section
      className={`rounded-[22px] border border-hk-line bg-hk-card shadow-[0_18px_34px_-28px_rgba(30,23,20,0.5)] ${flush ? 'overflow-hidden' : 'p-5 sm:p-6'} ${className}`}
    >
      {children}
    </section>
  );
}

interface PanelHeaderProps {
  title: string;
  action?: ReactNode;
  className?: string;
}

export function PanelHeader({ title, action, className = '' }: PanelHeaderProps) {
  return (
    <div className={`mb-5 flex items-center justify-between gap-4 ${className}`}>
      <h2 className="font-display text-lg font-normal uppercase leading-tight text-hk-ink">{title}</h2>
      {action}
    </div>
  );
}

export function EmptyState({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="rounded-[18px] border-2 border-dashed border-hk-line px-6 py-10 text-center">
      <p className="font-hand text-2xl font-semibold text-hk-ink-soft">{children}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
