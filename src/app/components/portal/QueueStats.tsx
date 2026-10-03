import { Panel, PanelHeader } from './Panel';

interface QueueStatsProps {
  title: string;
  stats: { label: string; value: string | number }[];
}

export default function QueueStats({ title, stats }: QueueStatsProps) {
  return (
    <Panel>
      <PanelHeader title={title} />
      <dl className="divide-y divide-hk-line">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-baseline justify-between gap-4 py-3 first:pt-0 last:pb-0">
            <dt className="text-sm font-semibold text-hk-ink-soft">{stat.label}</dt>
            <dd className="font-display text-2xl leading-none text-hk-red">{stat.value}</dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
}

export function Tips({ title, tips }: { title: string; tips: string[] }) {
  return (
    <Panel className="bg-hk-blush/40">
      <PanelHeader title={title} />
      <ul className="space-y-2.5 text-sm leading-relaxed text-hk-ink-soft">
        {tips.map((tip) => (
          <li key={tip} className="flex gap-2.5">
            <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-hk-red" />
            {tip}
          </li>
        ))}
      </ul>
    </Panel>
  );
}
