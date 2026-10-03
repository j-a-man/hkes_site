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
import QueueStats, { Tips } from '../../components/portal/QueueStats';
import { StatusSelect } from '../../components/portal/Status';
import { useAuth } from '../../lib/auth';
import { formatTimestamp, mutate } from '../../lib/portal';
import { formatDate, safeUrl } from '../../lib/site';
import { supabase } from '../../lib/supabase';
import { uploadFile } from '../../lib/uploads';
import type { PostRequestRow } from '../../lib/queries';

interface LoaderData {
  requests: PostRequestRow[];
}

const PLATFORMS = ['Instagram', 'Facebook', 'GroupMe', 'Email List', 'LinkedIn'];
const POST_TYPES = ['Event Promo', 'Fundraiser', 'Recap', 'Announcement', 'Partnership'];
const STATUS_OPTIONS = ['Pending', 'Scheduled', 'Published'] as const;
const INSTAGRAM_SWEET_SPOT = 150;

const EMPTY_FORM = {
  platforms: [] as string[],
  post_type: POST_TYPES[0],
  caption: '',
  has_graphic: false,
  publish_date: '',
  link_url: '',
  audience_notes: '',
};

export default function PortalPostRequests() {
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
    if (form.link_url && !safeUrl(form.link_url)) {
      setError('The link needs to start with http:// or https://.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const graphic_url = form.has_graphic && file ? (await uploadFile('graphics', file, profile?.id ?? 'anon')).publicUrl : null;
      const { error } = await supabase.from('post_requests').insert({
        requested_by: profile?.id,
        platforms: form.platforms,
        post_type: form.post_type,
        caption: form.caption,
        has_graphic: form.has_graphic,
        graphic_url,
        publish_date: form.publish_date,
        link_url: form.link_url || null,
        audience_notes: form.audience_notes || null,
      });
      if (error) throw error;
      setForm(EMPTY_FORM);
      setFile(null);
      toast.success('Post request sent to Outreach');
      revalidator.revalidate();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    if (await mutate(supabase.from('post_requests').update({ status }).eq('id', id), `Moved to ${status}`)) revalidator.revalidate();
  };

  const count = (status: string) => requests.filter((r) => r.status === status).length;
  const shown = statusFilter === 'All' ? requests : requests.filter((r) => r.status === statusFilter);
  const captionLength = form.caption.length;

  return (
    <>
      <PageHeader zh="帖文" title="Post requests" subtitle="Ask Outreach to post on our socials and email list, then track it to published." />

      <div className="grid items-start gap-6 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <PanelHeader title="New post request" />
          <form onSubmit={handleSubmit} className="space-y-5">
            <ChipCheckboxes legend="Platforms" options={PLATFORMS} value={form.platforms} onChange={(platforms) => setForm({ ...form, platforms })} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Type of post">
                <select value={form.post_type} onChange={(e) => setForm({ ...form, post_type: e.target.value })} className={INPUT}>
                  {POST_TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </Field>
              <Field label="Publish on">
                <input required type="date" value={form.publish_date} onChange={(e) => setForm({ ...form, publish_date: e.target.value })} className={INPUT} />
              </Field>
            </div>
            <Field
              label="Caption"
              hint={`${captionLength} character${captionLength === 1 ? '' : 's'}${captionLength > INSTAGRAM_SWEET_SPOT ? ' · a little long for Instagram' : ''}`}
            >
              <textarea required value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} className={INPUT} rows={4} />
            </Field>
            <div>
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-hk-ink-soft">Graphic</span>
              <Segmented
                label="Graphic"
                value={form.has_graphic ? 'yes' : 'no'}
                onChange={(value) => setForm({ ...form, has_graphic: value === 'yes' })}
                options={[
                  { value: 'no', label: 'Need one from Publicity' },
                  { value: 'yes', label: 'I have one' },
                ]}
              />
            </div>
            {form.has_graphic && <FileDrop label="Upload your graphic" accept="image/*" file={file} onFile={setFile} prompt="Drop the graphic here or click to choose" />}
            <Field label="Link to include" hint="Optional">
              <input type="url" inputMode="url" placeholder="https://" value={form.link_url} onChange={(e) => setForm({ ...form, link_url: e.target.value })} className={INPUT} />
            </Field>
            <Field label="Audience notes" hint="Optional: who is this for?">
              <textarea value={form.audience_notes} onChange={(e) => setForm({ ...form, audience_notes: e.target.value })} className={INPUT} rows={2} />
            </Field>
            {error && <FormError>{error}</FormError>}
            <SiteButton type="submit" disabled={submitting}>
              <Send size={16} aria-hidden="true" />
              {submitting ? 'Sending…' : 'Send request'}
            </SiteButton>
          </form>
        </Panel>

        <div className="space-y-6">
          <QueueStats
            title="The queue"
            stats={[
              { label: 'Pending', value: count('Pending') },
              { label: 'Scheduled', value: count('Scheduled') },
              { label: 'Published', value: count('Published') },
            ]}
          />
          <Tips
            title="Outreach tips"
            tips={['Post 2 to 3 days before the event for the best reach.', 'Keep Instagram captions under 150 characters.', 'Tag @binghkes so we can reshare.']}
          />
        </div>
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
                <th className={TABLE.th}>Caption</th>
                <th className={TABLE.th}>Type</th>
                <th className={TABLE.th}>Platforms</th>
                <th className={TABLE.th}>Publish on</th>
                <th className={TABLE.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((r) => {
                const graphic = safeUrl(r.graphic_url);
                const link = safeUrl(r.link_url);
                return (
                  <tr key={r.id} className={TABLE.tr}>
                    <td className={`${TABLE.td} max-w-sm`}>
                      <p className="line-clamp-2 font-semibold" title={r.caption}>
                        {r.caption}
                      </p>
                      <p className="mt-0.5 text-xs text-hk-ink-soft">
                        {r.profiles?.full_name ?? 'Unknown'} · {formatTimestamp(r.created_at)}
                      </p>
                      {(graphic || link) && (
                        <p className="mt-1 flex flex-wrap gap-3 text-xs font-semibold">
                          {graphic && (
                            <a href={graphic} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-hk-red hover:underline">
                              Graphic <ExternalLink size={12} aria-hidden="true" />
                            </a>
                          )}
                          {link && (
                            <a href={link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-hk-red hover:underline">
                              Link <ExternalLink size={12} aria-hidden="true" />
                            </a>
                          )}
                        </p>
                      )}
                    </td>
                    <td className={TABLE.td}>{r.post_type}</td>
                    <td className={TABLE.td}>{r.platforms.join(', ')}</td>
                    <td className={`${TABLE.td} whitespace-nowrap font-semibold`}>{formatDate(r.publish_date, { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td className={TABLE.td}>
                      <StatusSelect label="Post status" value={r.status} options={STATUS_OPTIONS} onChange={(status) => updateStatus(r.id, status)} />
                    </td>
                  </tr>
                );
              })}
              {shown.length === 0 && (
                <tr>
                  <td colSpan={5} className={TABLE.empty}>
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
