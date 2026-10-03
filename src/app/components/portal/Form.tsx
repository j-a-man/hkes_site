import { useRef, useState, type ReactNode } from 'react';
import { Check, Upload, X } from 'lucide-react';

export const INPUT =
  'block w-full rounded-xl border-2 border-hk-line bg-hk-card px-3.5 py-2.5 text-[15px] text-hk-ink placeholder:text-hk-ink-soft/60 transition-colors focus:border-hk-red focus:outline-none disabled:opacity-60';

const LABEL = 'mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-hk-ink-soft';

interface FieldProps {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}

export function Field({ label, hint, children, className = '' }: FieldProps) {
  return (
    <label className={`block ${className}`}>
      <span className={LABEL}>{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-hk-ink-soft">{hint}</span>}
    </label>
  );
}

interface ChipCheckboxesProps {
  legend: string;
  options: readonly string[];
  value: string[];
  onChange: (value: string[]) => void;
}

// Multi-select as toggle chips (platforms and the like).
export function ChipCheckboxes({ legend, options, value, onChange }: ChipCheckboxesProps) {
  const toggle = (option: string) => onChange(value.includes(option) ? value.filter((v) => v !== option) : [...value, option]);
  return (
    <fieldset>
      <legend className={LABEL}>{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const on = value.includes(option);
          return (
            <button
              key={option}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(option)}
              className={`inline-flex items-center gap-1.5 rounded-full border-2 px-3.5 py-1.5 text-sm font-semibold transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-hk-red ${
                on ? 'border-hk-red bg-hk-red text-white' : 'border-hk-line text-hk-ink hover:border-hk-ink'
              }`}
            >
              {on && <Check size={14} aria-hidden="true" />}
              {option}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

interface FileDropProps {
  label: string;
  accept: string;
  file: File | null;
  onFile: (file: File | null) => void;
  prompt?: string;
}

// Click or drag a file in. Clearing it resets the hidden input as well.
export function FileDrop({ label, accept, file, onFile, prompt = 'Drop a file here or click to choose' }: FileDropProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const clear = () => {
    onFile(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div>
      <span className={LABEL}>{label}</span>
      {file ? (
        <div className="flex items-center justify-between gap-3 rounded-xl border-2 border-hk-line bg-hk-paper px-4 py-3">
          <span className="min-w-0 truncate text-sm font-medium text-hk-ink">{file.name}</span>
          <button type="button" onClick={clear} aria-label="Remove file" className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-hk-ink-soft hover:bg-hk-blush hover:text-hk-red">
            <X size={16} />
          </button>
        </div>
      ) : (
        <label
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            onFile(e.dataTransfer.files[0] ?? null);
          }}
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors focus-within:border-hk-red ${
            dragging ? 'border-hk-red bg-hk-blush/50' : 'border-hk-line hover:border-hk-red'
          }`}
        >
          <Upload size={22} aria-hidden="true" className="text-hk-red" />
          <span className="text-sm text-hk-ink-soft">{prompt}</span>
          <input ref={inputRef} type="file" accept={accept} className="sr-only" onChange={(e) => onFile(e.target.files?.[0] ?? null)} />
        </label>
      )}
    </div>
  );
}

export function FormError({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="rounded-xl bg-hk-red/10 px-4 py-3 text-sm font-medium text-hk-red-dark dark:text-[#ff8f94]">
      {children}
    </p>
  );
}

export function FormSuccess({ children }: { children: ReactNode }) {
  return (
    <p role="status" className="rounded-xl bg-emerald-600/12 px-4 py-3 text-sm font-medium text-emerald-800 dark:text-emerald-300">
      {children}
    </p>
  );
}
