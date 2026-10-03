import { ChevronDown } from 'lucide-react';

type Tone = 'red' | 'amber' | 'green' | 'blue' | 'neutral';

const TONES: Record<Tone, string> = {
  red: 'bg-hk-red/12 text-hk-red-dark dark:text-[#ff8f94]',
  amber: 'bg-amber-500/15 text-amber-800 dark:text-amber-300',
  green: 'bg-emerald-600/12 text-emerald-800 dark:text-emerald-300',
  blue: 'bg-sky-600/12 text-sky-800 dark:text-sky-300',
  neutral: 'bg-hk-ink/[0.07] text-hk-ink-soft',
};

// Every workflow status in the portal, mapped to one shared set of tones.
const STATUS_TONES: Record<string, Tone> = {
  'not-started': 'amber',
  'in-progress': 'blue',
  'on-track': 'green',
  complete: 'neutral',
  Pending: 'amber',
  'In Progress': 'blue',
  Complete: 'green',
  Scheduled: 'blue',
  Published: 'green',
  Approved: 'blue',
  Paid: 'green',
  Rejected: 'red',
  Urgent: 'red',
  Normal: 'neutral',
  Active: 'green',
  Paused: 'neutral',
};

const LABELS: Record<string, string> = {
  'not-started': 'Not started',
  'in-progress': 'In progress',
  'on-track': 'On track',
  complete: 'Complete',
};

export function statusLabel(status: string) {
  return LABELS[status] ?? status;
}

const PILL = 'inline-flex items-center whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold';

export function StatusPill({ status, tone }: { status: string; tone?: Tone }) {
  return <span className={`${PILL} ${TONES[tone ?? STATUS_TONES[status] ?? 'neutral']}`}>{statusLabel(status)}</span>;
}

interface StatusSelectProps {
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
  label: string;
  disabled?: boolean;
}

// A status pill you can change in place.
export function StatusSelect({ value, options, onChange, label, disabled }: StatusSelectProps) {
  return (
    <span className={`relative inline-flex ${disabled ? 'opacity-60' : ''}`}>
      <select
        aria-label={label}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={`${PILL} ${TONES[STATUS_TONES[value] ?? 'neutral']} cursor-pointer appearance-none border-0 pr-7 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hk-red`}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {statusLabel(option)}
          </option>
        ))}
      </select>
      <ChevronDown size={13} aria-hidden="true" className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 opacity-70" />
    </span>
  );
}
