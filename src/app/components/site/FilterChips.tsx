interface FilterChipsProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

export default function FilterChips({ label, options, value, onChange }: FilterChipsProps) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = option === value;
        return (
          <button
            key={option}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option)}
            className={`rounded-full border-2 px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-hk-red ${
              active ? 'border-hk-red bg-hk-red text-white' : 'border-hk-ink/15 bg-hk-card text-hk-ink hover:border-hk-ink'
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
