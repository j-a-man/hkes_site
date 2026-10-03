import type { ReactNode } from 'react';
import { Link } from 'react-router';

type Variant = 'red' | 'white' | 'outline-white' | 'outline-ink';

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-full border-2 font-semibold uppercase transition-[transform,box-shadow,background-color,color] duration-150 ease-out select-none focus-visible:outline-3 focus-visible:outline-offset-4 disabled:pointer-events-none disabled:opacity-60';

const SIZES = {
  md: 'px-6 py-3 text-sm tracking-[0.12em]',
  sm: 'px-4 py-2 text-xs tracking-[0.14em]',
};

// Solid buttons get a hard offset "print" shadow and press down when clicked.
const PRESS =
  'hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none';

const VARIANTS: Record<Variant, string> = {
  red: `border-hk-ink bg-hk-red text-white shadow-[4px_4px_0_0_var(--color-hk-ink)] hover:shadow-[6px_6px_0_0_var(--color-hk-ink)] focus-visible:outline-hk-ink ${PRESS}`,
  white: `border-hk-red-deep bg-white text-hk-red shadow-[4px_4px_0_0_var(--color-hk-red-deep)] hover:shadow-[6px_6px_0_0_var(--color-hk-red-deep)] focus-visible:outline-white ${PRESS}`,
  'outline-white': 'border-white/90 text-white hover:bg-white hover:text-hk-red focus-visible:outline-white',
  'outline-ink': 'border-hk-ink text-hk-ink hover:bg-hk-ink hover:text-white focus-visible:outline-hk-red',
};

interface CommonProps {
  variant?: Variant;
  size?: keyof typeof SIZES;
  className?: string;
  children: ReactNode;
}

type SiteButtonProps = CommonProps &
  (
    | { to: string; href?: never; type?: never; disabled?: never }
    | { href: string; to?: never; type?: never; disabled?: never }
    | { type: 'submit' | 'button'; to?: never; href?: never; disabled?: boolean; onClick?: () => void }
  );

export default function SiteButton(props: SiteButtonProps) {
  const { variant = 'red', size = 'md', className = '', children } = props;
  const classes = `${BASE} ${SIZES[size]} ${VARIANTS[variant]} ${className}`;

  if (props.to !== undefined) {
    return (
      <Link to={props.to} className={classes}>
        {children}
      </Link>
    );
  }
  if (props.href !== undefined) {
    return (
      <a href={props.href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }
  return (
    <button type={props.type} disabled={props.disabled} onClick={'onClick' in props ? props.onClick : undefined} className={classes}>
      {children}
    </button>
  );
}
