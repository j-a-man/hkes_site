import { useState, type FormEvent } from 'react';
import { useLoaderData, useRevalidator } from 'react-router';
import { ExternalLink, Send } from 'lucide-react';
import { toast } from 'sonner';
import FilterChips from '../../components/site/FilterChips';
import SiteButton from '../../components/site/SiteButton';
import { Segmented, TABLE } from '../../components/portal/Controls';
import { ChipCheckboxes, Field, FileDrop, FormError, INPUT } from '../../components/portal/Form';
import PageHeader from '../../components/portal/PageHeader';
import { Panel, PanelHeader } from '../../components/portal/Panel';
import QueueStats from '../../components/portal/QueueStats';
import { StatusPill, StatusSelect } from '../../components/portal/Status';
import { useAuth } from '../../lib/auth';
import { dueInfo, formatTimestamp, mutate } from '../../lib/portal';
import { formatDate, safeUrl } from '../../lib/site';
import { supabase } from '../../lib/supabase';
import { uploadFile } from '../../lib/uploads';
import type { GraphicRequestRow } from '../../lib/queries';

interface LoaderData {
  requests: GraphicRequestRow[];
}

const GRAPHIC_TYPES = ['Social Media Post', 'Story', 'Flyer', 'Banner', 'Email Header'];
const PLATFORMS = ['Instagram', 'Facebook', 'Email', 'Print'];
const STATUS_OPTIONS = ['Pending', 'In Progress', 'Complete'] as const;

const EMPTY_FORM = {
  event_name: '',
  graphic_type: GRAPHIC_TYPES[0],
  platforms: [] as string[],
  event_datetime: '',
  due_date: '',
  description: '',
  priority: 'Normal' as 'Normal' | 'Urgent',
};

export default function PortalGraphicRequests() {
  const { requests } = useLoaderData() as LoaderData;
  const revalidator = useRevalidator();
  const { profile } = useAuth();

  const [form, setForm] = useState(EMPTY_FORM);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('All');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (form.platforms.length === 0) {
      setError('Pick at least one platform.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const reference_image_url = file ? (await uploadFile('graphics', file, profile?.id ?? 'anon')).publicUrl : null;
      const { error } = await supabase.from('graphic_requests').insert({
        requested_by: profile?.id,
        event_name: form.event_name,
        graphic_type: form.graphic_type,
        platforms: form.platforms,
        event_datetime: form.event_datetime || null,
        due_date: form.due_date,
        description: form.description || null,
        reference_image_url,
        priority: form.priority,
      });
      if (error) throw error;
      setForm(EMPTY_FORM);
      setFile(null);
      toast.success('Request sent to Publicity');
      revalidator.revalidate();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    if (await mutate(supabase.from('graphic_requests').update({ status }).eq('id', id), `Moved to ${status}`)) revalidator.revalidate();
  };

  const count = (status: string) => requests.filter((r) => r.status === status).length;
  const shown = statusFilter === 'All' ? requests : requests.filter((r) => r.status === statusFilter);

  return (
    <>
      <PageHeader zh="設計" title="Graphic requests" subtitle="Ask Publicity for a flyer, story, or banner, then follow it through the queue." />

      <div className="grid items-start gap-6 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <PanelHeader title="New request" />
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Event or post name">
                <input required value={form.event_name} onChange={(e) => setForm({ ...form, event_name: e.target.value })} className={INPUT} />
              </Field>
              <Field label="Type of graphic">
                <select value={form.graphic_type} onChange={(e) => setForm({ ...form, graphic_type: e.target.value })} className={INPUT}>
                  {GRAPHIC_TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </Field>
            </div>
            <ChipCheckboxes legend="Platforms" options={PLATFORMS} value={form.platforms} onChange={(platforms) => setForm({ ...form, platforms })} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Event date & time" hint="Optional">
                <input type="datetime-local" value={form.event_datetime} onChange={(e) => setForm({ ...form, event_datetime: e.target.value })} className={INPUT} />
              </Field>
              <Field label="Needed by">
                <input required type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} className={INPUT} />
              </Field>
            </div>
            <Field label="Content & vibe" hint="What should it say, and how should it feel?">
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={INPUT} rows={3} />
            </Field>
            <FileDrop label="Reference image (optional)" accept="image/*" file={file} onFile={setFile} prompt="Drop an image here or click to choose" />
            <div>
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-hk-ink-soft">Priority</span>
              <Segmented
                label="Priority"
                value={form.priority}
                onChange={(priority) => setForm({ ...form, priority })}
                options={[
                  { value: 'Normal', label: 'Normal' },
                  { value: 'Urgent', label: 'Urgent' },
                ]}
              />
            </div>
            {error && <FormError>{error}</FormError>}
            <SiteButton type="submit" disabled={submitting}>
              <Send size={16} aria-hidden="true" />
              {submitting ? 'Sending…' : 'Send request'}
            </SiteButton>
          </form>
        </Panel>

        <QueueStats
          title="The queue"
          stats={[
            { label: 'Pending', value: count('Pending') },
            { label: 'In progress', value: count('In Progress') },
            { label: 'Complete', value: count('Complete') },
          ]}
        />
      </div>

      <Panel flush className="mt-8">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <h2 className="font-display text-lg font-normal uppercase text-hk-ink">Current queue</h2>
          <FilterChips label="Filter by status" options={['All', ...STATUS_OPTIONS]} value={statusFilter} onChange={setStatusFilter} />
        </div>
        <div className={TABLE.wrap}>
          <table className={`${TABLE.table} min-w-[860px]`}>
            <thead className={TABLE.head}>
              <tr>
                <th className={TABLE.th}>Request</th>
                <th className={TABLE.th}>Type</th>
                <th className={TABLE.th}>Platforms</th>
                <th className={TABLE.th}>Needed by</th>
                <th className={TABLE.th}>Priority</th>
                <th className={TABLE.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((r) => {
                const reference = safeUrl(r.reference_image_url);
                const due = dueInfo(r.due_date);
                return (
                  <tr key={r.id} className={TABLE.tr}>
                    <td className={`${TABLE.td} max-w-xs`}>
                      <p className="font-semibold">{r.event_name}</p>
                      <p className="mt-0.5 text-xs text-hk-ink-soft">
                        {r.profiles?.full_name ?? 'Unknown'} · {formatTimestamp(r.created_at)}
                      </p>
                      {r.description && <p className="mt-1 line-clamp-2 text-hk-ink-soft">{r.description}</p>}
                      {reference && (
                        <a href={reference} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-hk-red hover:underline">
                          Reference image <ExternalLink size={12} aria-hidden="true" />
                        </a>
                      )}
                    </td>
                    <td className={TABLE.td}>{r.graphic_type}</td>
                    <td className={TABLE.td}>{r.platforms.join(', ')}</td>
                    <td className={`${TABLE.td} whitespace-nowrap`}>
                      <p className="font-semibold">{formatDate(r.due_date, { month: 'short', day: 'numeric' })}</p>
                      {r.status !== 'Complete' && (
                        <p className={`mt-0.5 text-xs ${due.urgency === 'overdue' ? 'font-semibold text-hk-red' : 'text-hk-ink-soft'}`}>{due.text}</p>
                      )}
                    </td>
                    <td className={TABLE.td}>
                      <StatusPill status={r.priority} />
                    </td>
                    <td className={TABLE.td}>
                      <StatusSelect label={`Status of ${r.event_name}`} value={r.status} options={STATUS_OPTIONS} onChange={(status) => updateStatus(r.id, status)} />
                    </td>
                  </tr>
                );
              })}
              {shown.length === 0 && (
                <tr>
                  <td colSpan={6} className={TABLE.empty}>
                    {requests.length === 0 ? 'No requests yet.' : 'Nothing with that status.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}
