import { useMemo, useState, type FormEvent } from 'react';
import { useLoaderData, useRevalidator } from 'react-router';
import { CalendarDays, ChevronLeft, ChevronRight, List, Pencil, Plus, Trash2 } from 'lucide-react';
import FilterChips from '../../components/site/FilterChips';
import SiteButton from '../../components/site/SiteButton';
import { IconButton, Segmented, Switch, TABLE } from '../../components/portal/Controls';
import { Field, FormError, INPUT } from '../../components/portal/Form';
import Modal, { ConfirmDialog } from '../../components/portal/Modal';
import PageHeader from '../../components/portal/PageHeader';
import { EmptyState, Panel } from '../../components/portal/Panel';
import { StatusPill, StatusSelect, statusLabel } from '../../components/portal/Status';
import { useAuth } from '../../lib/auth';
import { dueInfo, mutate, URGENCY_DOT } from '../../lib/portal';
import { formatDate, todayISO } from '../../lib/site';
import { supabase } from '../../lib/supabase';
import type { DeadlineRow } from '../../lib/queries';

interface LoaderData {
  deadlines: DeadlineRow[];
}

const STATUS_OPTIONS = ['not-started', 'in-progress', 'on-track', 'complete'] as const;
const EMPTY_FORM = { task: '', description: '', assigned_chair: '', due_date: '', status: 'not-started' as string };
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function isoOf(date: Date) {
  return todayISO(date);
}

// Sunday-to-Saturday weeks covering the whole month.
function monthGrid(month: Date) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const start = new Date(first);
  start.setDate(1 - first.getDay());
  const last = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  const cells = Math.ceil((first.getDay() + last.getDate()) / 7) * 7;
  return Array.from({ length: cells }, (_, i) => {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    return day;
  });
}

const CHIP_TONES: Record<string, string> = {
  'not-started': 'bg-amber-500/15 text-amber-900 dark:text-amber-200',
  'in-progress': 'bg-sky-600/15 text-sky-900 dark:text-sky-200',
  'on-track': 'bg-emerald-600/15 text-emerald-900 dark:text-emerald-200',
  complete: 'bg-hk-ink/[0.07] text-hk-ink-soft line-through',
};

export default function PortalDeadlines() {
  const { deadlines } = useLoaderData() as LoaderData;
  const revalidator = useRevalidator();
  const { profile, isExecutive } = useAuth();

  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [chair, setChair] = useState('All');
  const [hideComplete, setHideComplete] = useState(false);
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));

  const [editing, setEditing] = useState<DeadlineRow | 'new' | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<DeadlineRow | null>(null);
  const [busy, setBusy] = useState(false);

  const chairs = useMemo(() => Array.from(new Set(deadlines.map((d) => d.assigned_chair))).sort(), [deadlines]);
  const shown = deadlines
    .filter((d) => (chair === 'All' || d.assigned_chair === chair) && (!hideComplete || d.status !== 'complete'))
    .sort((a, b) => a.due_date.localeCompare(b.due_date));

  const openAdd = (dueDate = '') => {
    setEditing('new');
    setForm({ ...EMPTY_FORM, due_date: dueDate });
    setError(null);
  };

  const openEdit = (d: DeadlineRow) => {
    setEditing(d);
    setForm({ task: d.task, description: d.description ?? '', assigned_chair: d.assigned_chair, due_date: d.due_date, status: d.status });
    setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload = {
      task: form.task,
      description: form.description || null,
      assigned_chair: form.assigned_chair || 'Unassigned',
      due_date: form.due_date,
      status: form.status,
    };
    const { error } =
      editing && editing !== 'new'
        ? await supabase.from('deadlines').update(payload).eq('id', editing.id)
        : await supabase.from('deadlines').insert({ ...payload, created_by: profile?.id });
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    setEditing(null);
    revalidator.revalidate();
  };

  const updateStatus = async (d: DeadlineRow, status: string) => {
    if (await mutate(supabase.from('deadlines').update({ status }).eq('id', d.id), `Marked "${d.task}" ${statusLabel(status).toLowerCase()}`)) {
      revalidator.revalidate();
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setBusy(true);
    const ok = await mutate(supabase.from('deadlines').delete().eq('id', deleting.id), 'Deadline deleted');
    setBusy(false);
    if (ok) {
      setDeleting(null);
      revalidator.revalidate();
    }
  };

  const today = todayISO();
  const days = monthGrid(month);
  const monthKey = isoOf(month).slice(0, 7);
  const inMonth = shown.filter((d) => d.due_date.startsWith(monthKey));
  const byDay = new Map<string, DeadlineRow[]>();
  for (const d of shown) byDay.set(d.due_date, [...(byDay.get(d.due_date) ?? []), d]);
  const shiftMonth = (delta: number) => setMonth((m) => new Date(m.getFullYear(), m.getMonth() + delta, 1));

  return (
    <>
      <PageHeader
        zh="限期"
        title="Deadlines"
        subtitle="Everything the E-Board is working on, by chair and due date."
        action={
          <SiteButton type="button" size="sm" onClick={() => openAdd()}>
            <Plus size={16} aria-hidden="true" />
            Add deadline
          </SiteButton>
        }
      />

      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center gap-4">
          <Segmented
            label="View"
            value={view}
            onChange={setView}
            options={[
              { value: 'list', label: 'List', icon: <List size={15} aria-hidden="true" /> },
              { value: 'calendar', label: 'Calendar', icon: <CalendarDays size={15} aria-hidden="true" /> },
            ]}
          />
          <label className="inline-flex items-center gap-2.5 text-sm font-semibold text-hk-ink-soft">
            <Switch checked={hideComplete} onChange={setHideComplete} label="Hide completed" />
            Hide completed
          </label>
        </div>
        {chairs.length > 1 && <FilterChips label="Filter by chair" options={['All', ...chairs]} value={chair} onChange={setChair} />}
      </div>

      {view === 'list' ? (
        <Panel flush>
          <div className={TABLE.wrap}>
            <table className={`${TABLE.table} min-w-[760px]`}>
              <thead className={TABLE.head}>
                <tr>
                  <th className={TABLE.th}>Task</th>
                  <th className={TABLE.th}>Chair</th>
                  <th className={TABLE.th}>Due</th>
                  <th className={TABLE.th}>Status</th>
                  <th className={`${TABLE.th} text-right`}>
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {shown.map((d) => {
                  const due = dueInfo(d.due_date);
                  return (
                    <tr key={d.id} className={TABLE.tr}>
                      <td className={`${TABLE.td} max-w-sm`}>
                        <p className="font-semibold">{d.task}</p>
                        {d.description && <p className="mt-0.5 line-clamp-2 text-hk-ink-soft">{d.description}</p>}
                      </td>
                      <td className={TABLE.td}>
                        <StatusPill status={d.assigned_chair} tone="neutral" />
                      </td>
                      <td className={`${TABLE.td} whitespace-nowrap`}>
                        <p className="font-semibold">{formatDate(d.due_date, { month: 'short', day: 'numeric' })}</p>
                        {d.status !== 'complete' && (
                          <p className={`mt-0.5 flex items-center gap-1.5 text-xs ${due.urgency === 'overdue' ? 'font-semibold text-hk-red' : 'text-hk-ink-soft'}`}>
                            <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${URGENCY_DOT[due.urgency]}`} />
                            {due.text}
                          </p>
                        )}
                      </td>
                      <td className={TABLE.td}>
                        <StatusSelect label={`Status of ${d.task}`} value={d.status} options={STATUS_OPTIONS} onChange={(status) => updateStatus(d, status)} />
                      </td>
                      <td className={`${TABLE.td} text-right`}>
                        <div className="inline-flex gap-1">
                          <IconButton label={`Edit ${d.task}`} onClick={() => openEdit(d)}>
                            <Pencil size={16} />
                          </IconButton>
                          {isExecutive && (
                            <IconButton label={`Delete ${d.task}`} onClick={() => setDeleting(d)} danger>
                              <Trash2 size={16} />
                            </IconButton>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {shown.length === 0 && (
                  <tr>
                    <td colSpan={5} className={TABLE.empty}>
                      {deadlines.length === 0 ? 'No deadlines yet.' : 'Nothing matches these filters.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Panel>
      ) : (
        <Panel>
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="font-display text-xl font-normal uppercase text-hk-ink">
              {month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex items-center gap-1">
              <IconButton label="Previous month" onClick={() => shiftMonth(-1)}>
                <ChevronLeft size={18} />
              </IconButton>
              <button
                type="button"
                onClick={() => setMonth(new Date(new Date().getFullYear(), new Date().getMonth(), 1))}
                className="rounded-full px-3 py-1.5 text-sm font-semibold text-hk-red hover:bg-hk-blush"
              >
                Today
              </button>
              <IconButton label="Next month" onClick={() => shiftMonth(1)}>
                <ChevronRight size={18} />
              </IconButton>
            </div>
          </div>

          <div className="grid grid-cols-7 border-l border-t border-hk-line">
            {WEEKDAYS.map((day) => (
              <div key={day} className="border-b border-r border-hk-line bg-hk-paper px-2 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-hk-ink-soft">
                <span className="sm:hidden">{day[0]}</span>
                <span className="hidden sm:inline">{day}</span>
              </div>
            ))}
            {days.map((day) => {
              const iso = isoOf(day);
              const items = byDay.get(iso) ?? [];
              const outside = day.getMonth() !== month.getMonth();
              const isToday = iso === today;
              return (
                <div key={iso} className={`min-h-16 border-b border-r border-hk-line p-1.5 sm:min-h-28 sm:p-2 ${outside ? 'bg-hk-paper/60' : ''}`}>
                  <button
                    type="button"
                    onClick={() => openAdd(iso)}
                    aria-label={`Add a deadline on ${day.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`}
                    className={`grid h-7 w-7 place-items-center rounded-full text-xs font-semibold transition-colors hover:bg-hk-blush ${
                      isToday ? 'bg-hk-red text-white hover:bg-hk-red-dark' : outside ? 'text-hk-ink-soft/50' : 'text-hk-ink'
                    }`}
                  >
                    {day.getDate()}
                  </button>
                  <ul className="mt-1 space-y-1">
                    {items.map((d) => (
                      <li key={d.id}>
                        <button
                          type="button"
                          onClick={() => openEdit(d)}
                          title={d.task}
                          className={`hidden w-full truncate rounded-md px-1.5 py-1 text-left text-[11px] font-semibold sm:block ${CHIP_TONES[d.status] ?? CHIP_TONES.complete}`}
                        >
                          {d.task}
                        </button>
                        <span aria-hidden="true" className={`block h-1.5 w-1.5 rounded-full sm:hidden ${d.status === 'complete' ? 'bg-hk-ink-soft/50' : URGENCY_DOT[dueInfo(d.due_date).urgency]}`} />
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <h3 className="mb-3 mt-8 text-xs font-semibold uppercase tracking-[0.16em] text-hk-ink-soft">Due this month</h3>
          {inMonth.length === 0 ? (
            <EmptyState>Nothing due this month.</EmptyState>
          ) : (
            <ul className="divide-y divide-hk-line">
              {inMonth.map((d) => (
                <li key={d.id}>
                  <button type="button" onClick={() => openEdit(d)} className="flex w-full items-center gap-4 py-3 text-left hover:text-hk-red">
                    <span className="w-20 shrink-0 whitespace-nowrap font-display text-base leading-none">{formatDate(d.due_date, { month: 'short', day: 'numeric' })}</span>
                    <span className="min-w-0 flex-1 truncate font-semibold">{d.task}</span>
                    <StatusPill status={d.status} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      )}

      <Modal open={editing !== null} onOpenChange={(open) => !open && setEditing(null)} title={editing === 'new' ? 'Add deadline' : 'Edit deadline'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Task">
            <input required value={form.task} onChange={(e) => setForm({ ...form, task: e.target.value })} className={INPUT} />
          </Field>
          <Field label="Description">
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={INPUT} rows={3} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Assigned chair">
              <input
                required
                list="deadline-chairs"
                value={form.assigned_chair}
                onChange={(e) => setForm({ ...form, assigned_chair: e.target.value })}
                className={INPUT}
                placeholder="e.g. Publicity"
              />
              <datalist id="deadline-chairs">
                {chairs.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </Field>
            <Field label="Due date">
              <input required type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} className={INPUT} />
            </Field>
          </div>
          <Field label="Status">
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={INPUT}>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {statusLabel(s)}
                </option>
              ))}
            </select>
          </Field>
          {error && <FormError>{error}</FormError>}
          <SiteButton type="submit" disabled={saving} className="w-full">
            {saving ? 'Saving…' : editing === 'new' ? 'Add deadline' : 'Save changes'}
          </SiteButton>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Delete deadline?"
        body={
          <>
            <span className="font-semibold text-hk-ink">{deleting?.task}</span> will be removed for everyone. This can't be undone.
          </>
        }
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        busy={busy}
      />
    </>
  );
}
