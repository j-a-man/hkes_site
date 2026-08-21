import { ReactNode } from 'react';
import Reveal from '../Reveal';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  action?: ReactNode;
}

export default function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <Reveal className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl mb-2">{title}</h1>
        <p className="text-[#555555] dark:text-gray-400">{subtitle}</p>
      </div>
      {action}
    </Reveal>
  );
}
