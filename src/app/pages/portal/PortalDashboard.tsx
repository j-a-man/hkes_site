import { Link, useLoaderData } from 'react-router';
import { ArrowRight, CalendarDays, DollarSign, Image, Pin, Send } from 'lucide-react';
import { Sparkle } from '../../components/site/Doodles';
import Placard from '../../components/site/Placard';
import Stamp from '../../components/site/Stamp';
import { EmptyState, Panel, PanelHeader } from '../../components/portal/Panel';
import StatTile from '../../components/portal/StatTile';
import Reveal from '../../components/Reveal';
import { useAuth } from '../../lib/auth';
import { dueInfo, formatTimestamp, URGENCY_DOT } from '../../lib/portal';
import { splitEvents, todayISO } from '../../lib/site';
import type { AnnouncementRow, DeadlineRow, EventRow, StatusRow } from '../../lib/queries';

interface LoaderData {
  deadlines: DeadlineRow[];
  graphics: StatusRow[];
  posts: StatusRow[];
  reimbursements: StatusRow[];
  announcements: AnnouncementRow[];
  events: EventRow[];
}

const QUICK_ACTIONS = [
  { label: 'Request a graphic', icon: Image, to: '/portal/graphics' },
  { label: 'Request a post', icon: Send, to: '/portal/posts' },
  { label: 'File a reimbursement', icon: DollarSign, to: '/portal/reimbursements' },
  { label: 'View deadlines', icon: CalendarDays, to: '/portal/deadlines' },
];

export default function PortalDashboard() {
  const { deadlines, graphics, posts, reimbursements, announcements, events } = useLoaderData() as LoaderData;
  const { profile, isExecutive } = useAuth();

  const openDeadlines = deadlines.filter((d) => d.status !== 'complete').sort((a, b) => a.due_date.localeCompare(b.due_date));
  const weekOut = todayISO(new Date(Date.now() + 7 * 86_400_000));
  const dueThisWeek = openDeadlines.filter((d) => d.due_date <= weekOut).length;
  const { upcoming } = splitEvents(events);

  // Members only see their own reimbursements, so only count those.
  const myReimbursements = isExecutive ? reimbursements : reimbursements.filter((r) => r.requested_by === profile?.id);
  const pending = [
    { label: 'Graphic requests', icon: Image, to: '/portal/graphics', count: graphics.filter((r) => r.status === 'Pending').length },
    { label: 'Post requests', icon: Send, to: '/portal/posts', count: posts.filter((r) => r.status === 'Pending').length },
    { label: 'Reimbursements', icon: DollarSign, to: '/portal/reimbursements', count: myReimbursements.filter((r) => r.status === 'Pending').length },
  ];
  const pendingTotal = pending.reduce((sum, p) => sum + p.count, 0);

  const firstName = profile?.full_name?.split(' ')[0] ?? 'there';
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-6">
      <Reveal className="paper-grain relative overflow-hidden rounded-[26px] bg-hk-red px-6 py-8 text-white [--grain-opacity:0.1] sm:px-9 sm:py-10">
        <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em]">
              <span lang="zh-HK" className="font-zh text-base normal-case tracking-normal">
                你好
              </span>
              {today}
            </p>
            <h1 className="mt-3 -rotate-1 font-marker text-[clamp(2.2rem,5vw,3.5rem)] leading-[1.02] text-hard-shadow">Welcome back, {firstName}!</h1>
            <p className="mt-4 max-w-md">Here's what's happening with HKES this week.</p>
          </div>
          {upcoming[0] ? (
            <div className="w-full max-w-sm rotate-1 text-hk-ink lg:w-80">
              <Placard event={upcoming[0]} />
            </div>
          ) : (
            <Stamp size={150} className="hidden rotate-12 text-white/90 lg:block" />
          )}
        </div>
        <Sparkle className="absolute right-[44%] top-8 hidden h-8 w-8 lg:block" />
      </Reveal>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile value={upcoming.length} label="Upcoming events" to="/events" />
        <StatTile value={openDeadlines.length} label="Open tasks" to="/portal/deadlines" />
        <StatTile value={pendingTotal} label="Pending requests" to="/portal/graphics" />
        <StatTile value={dueThisWeek} label="Due this week" to="/portal/deadlines" />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Panel className="lg:col-span-3">
          <PanelHeader
            title="Due soon"
            action={
              <Link to="/portal/deadlines" className="inline-flex items-center gap-1 text-sm font-semibold text-hk-red hover:underline">
                All deadlines <ArrowRight size={14} aria-hidden="true" />
              </Link>
            }
          />
          {openDeadlines.length === 0 ? (
            <EmptyState>Nothing due. You're all caught up!</EmptyState>
          ) : (
            <ul className="divide-y divide-hk-line">
              {openDeadlines.slice(0, 5).map((deadline) => {
                const due = dueInfo(deadline.due_date);
                return (
                  <li key={deadline.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                    <span aria-hidden="true" className={`mt-2 h-2.5 w-2.5 shrink-0 rounded-full ${URGENCY_DOT[due.urgency]}`} />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-hk-ink">{deadline.task}</p>
                      <p className="mt-0.5 text-sm text-hk-ink-soft">
                        {deadline.assigned_chair} · <span className={due.urgency === 'overdue' ? 'font-semibold text-hk-red' : ''}>{due.text}</span>
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>

        <Panel className="lg:col-span-2">
          <PanelHeader title="Waiting in the queue" />
          <ul className="space-y-2">
            {pending.map(({ label, icon: Icon, to, count }) => (
              <li key={label}>
                <Link
                  to={to}
                  className="flex items-center gap-3 rounded-xl border border-hk-line px-4 py-3 transition-colors hover:border-hk-red hover:bg-hk-blush/40 focus-visible:outline-3 focus-visible:outline-hk-red"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-hk-red/10 text-hk-red">
                    <Icon size={16} aria-hidden="true" />
                  </span>
                  <span className="flex-1 font-semibold">{label}</span>
                  <span className={`min-w-8 rounded-full px-2.5 py-0.5 text-center text-sm font-bold ${count > 0 ? 'bg-hk-red text-white' : 'bg-hk-ink/[0.07] text-hk-ink-soft'}`}>{count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Panel className="lg:col-span-3">
          <PanelHeader
            title="Announcements"
            action={
              <Link to="/portal/announcements" className="inline-flex items-center gap-1 text-sm font-semibold text-hk-red hover:underline">
                See all <ArrowRight size={14} aria-hidden="true" />
              </Link>
            }
          />
          {announcements.length === 0 ? (
            <EmptyState>No announcements yet.</EmptyState>
          ) : (
            <ul className="space-y-5">
              {announcements.map((announcement) => (
                <li key={announcement.id} className="border-l-4 border-hk-red pl-4">
                  <p className="flex items-center gap-2 font-semibold text-hk-ink">
                    {announcement.pinned && <Pin size={14} aria-label="Pinned" className="shrink-0 text-hk-red" />}
                    {announcement.title}
                  </p>
                  <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-hk-ink-soft">{announcement.message}</p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-hk-ink-soft">
                    {announcement.profiles?.full_name ?? 'HKES'} · {formatTimestamp(announcement.created_at)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel className="lg:col-span-2">
          <PanelHeader title="Quick actions" />
          <ul className="grid grid-cols-2 gap-3">
            {QUICK_ACTIONS.map(({ label, icon: Icon, to }) => (
              <li key={label}>
                <Link
                  to={to}
                  className="flex h-full flex-col items-start gap-3 rounded-2xl border-2 border-hk-ink bg-hk-card p-4 text-sm font-semibold shadow-[3px_3px_0_0_var(--color-hk-red)] transition-[transform,box-shadow] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_var(--color-hk-red)] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-hk-red"
                >
                  <Icon size={20} aria-hidden="true" className="text-hk-red" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
