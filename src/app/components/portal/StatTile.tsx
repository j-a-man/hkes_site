import { Link } from 'react-router';

interface StatTileProps {
  value: string | number;
  label: string;
  to?: string;
  className?: string;
}

const TILE = 'block rounded-[20px] border border-hk-line bg-hk-card px-5 py-5 shadow-[0_18px_34px_-28px_rgba(30,23,20,0.5)]';

export default function StatTile({ value, label, to, className = '' }: StatTileProps) {
  const body = (
    <>
      <span className="block font-display text-[2.4rem] leading-none text-hk-red">{value}</span>
      <span className="mt-3 block text-xs font-semibold uppercase tracking-[0.16em] text-hk-ink-soft">{label}</span>
    </>
  );
  if (!to) return <div className={`${TILE} ${className}`}>{body}</div>;
  return (
    <Link
      to={to}
      className={`${TILE} transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_var(--color-hk-red)] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-hk-red ${className}`}
    >
      {body}
    </Link>
  );
}
