import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { Squiggle } from '../site/Doodles';

interface PageHeaderProps {
  // Cantonese label above the title, matching the public site's section labels.
  zh: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  back?: { to: string; label: string };
}

export default function PageHeader({ zh, title, subtitle, action, back }: PageHeaderProps) {
  return (
    <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {back && (
          <Link to={back.to} className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-hk-red hover:underline">
            <ArrowLeft size={16} aria-hidden="true" />
            {back.label}
          </Link>
        )}
        <p lang="zh-HK" className="font-zh text-xl leading-none text-hk-red">
          {zh}
        </p>
        <h1 className="mt-2 break-words font-display text-[clamp(1.75rem,3.2vw,2.5rem)] font-normal uppercase leading-[1.05] text-hk-ink">{title}</h1>
        <Squiggle className="mt-2 h-2.5 w-28 text-hk-red" />
        {subtitle && <p className="mt-3 max-w-2xl text-hk-ink-soft">{subtitle}</p>}
      </div>
      {action && <div className="flex shrink-0 flex-wrap gap-3">{action}</div>}
    </header>
  );
}
