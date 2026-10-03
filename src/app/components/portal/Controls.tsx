import type { ReactNode } from 'react';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
}

export function Switch({ checked, onChange, label, disabled }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 shrink-0 rounded-full border-2 transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-hk-red disabled:opacity-60 ${
        checked ? 'border-hk-red bg-hk-red' : 'border-hk-line bg-hk-ink/10'
      }`}
    >
      <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : ''}`} />
    </button>
  );
}

interface IconButtonProps {
  label: string;
  onClick: () => void;
  children: ReactNode;
  danger?: boolean;
}

export function IconButton({ label, onClick, children, danger = false }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-hk-ink-soft transition-colors focus-visible:outline-3 focus-visible:outline-hk-red ${
        danger ? 'hover:bg-hk-red/10 hover:text-hk-red' : 'hover:bg-hk-blush hover:text-hk-red'
      }`}
    >
      {children}
    </button>
  );
}

interface SegmentedProps<T extends string> {
  label: string;
  options: { value: T; label: string; icon?: ReactNode }[];
  value: T;
  onChange: (value: T) => void;
}

export function Segmented<T extends string>({ label, options, value, onChange }: SegmentedProps<T>) {
  return (
    <div role="group" aria-label={label} className="inline-flex rounded-full border-2 border-hk-line bg-hk-card p-1">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors focus-visible:outline-3 focus-visible:outline-hk-red ${
              active ? 'bg-hk-red text-white' : 'text-hk-ink-soft hover:text-hk-ink'
            }`}
          >
            {option.icon}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

// Table styling shared by every portal list.
export const TABLE = {
  // Relative so absolutely positioned children (e.g. sr-only labels) stay inside the scroller.
  wrap: 'relative overflow-x-auto',
  table: 'w-full text-left text-sm',
  head: 'bg-hk-paper',
  th: 'px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-hk-ink-soft whitespace-nowrap',
  tr: 'border-t border-hk-line transition-colors hover:bg-hk-blush/35',
  td: 'px-5 py-4 align-middle text-hk-ink',
  empty: 'px-5 py-12 text-center font-hand text-2xl font-semibold text-hk-ink-soft',
};
