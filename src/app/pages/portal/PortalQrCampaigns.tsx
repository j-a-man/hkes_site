import { useState, type FormEvent } from 'react';
import { useLoaderData, useRevalidator } from 'react-router';
import { ListChecks, Pencil, Plus, QrCode, Trash2, Users } from 'lucide-react';
import { toast } from 'sonner';
import SiteButton from '../../components/site/SiteButton';
import { IconButton, Switch } from '../../components/portal/Controls';
import { Field, FormError, INPUT } from '../../components/portal/Form';
import Modal from '../../components/portal/Modal';
import PageHeader from '../../components/portal/PageHeader';
import { EmptyState, Panel } from '../../components/portal/Panel';
import QueueStats from '../../components/portal/QueueStats';
import { useAuth } from '../../lib/auth';
import { mutate } from '../../lib/portal';
import { supabase } from '../../lib/supabase';
import type { QrCampaignRow, QrQuestion } from '../../lib/queries';

interface LoaderData {
  campaigns: QrCampaignRow[];
  stats: { total: number; unverified: number };
}

type DraftQuestion = QrQuestion & { optionsText?: string };

const EMPTY_FORM = { name: '', slug: '', destination_url: '', questions: [] as DraftQuestion[] };

const QUESTION_TYPES: { value: QrQuestion['type']; label: string }[] = [
  { value: 'text', label: 'Short answer' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'select', label: 'Dropdown' },
  { value: 'checkbox', label: 'Checkbox' },
];

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function newQuestion(): DraftQuestion {
  return { id: crypto.randomUUID(), label: '', type: 'text', required: true };
}

function plural(count: number, one: string, many = `${one}s`) {
  return `${count} ${count === 1 ? one : many}`;
}

export default function PortalQrCampaigns() {
  const { campaigns, stats } = useLoaderData() as LoaderData;
  const revalidator = useRevalidator();
  const { profile } = useAuth();

  const [editing, setEditing] = useState<QrCampaignRow | 'new' | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [slugEdited, setSlugEdited] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openCreate = () => {
    setEditing('new');
    setForm({ ...EMPTY_FORM, questions: [{ ...newQuestion(), label: 'Instagram handle' }] });
    setSlugEdited(false);
    setError(null);
  };

  const openEdit = (c: QrCampaignRow) => {
    setEditing(c);
    setForm({
      name: c.name,
      slug: c.slug,
      destination_url: c.destination_url,
      questions: c.questions.map((q) => ({ ...q, optionsText: (q.options ?? []).join(', ') })),
    });
    setSlugEdited(true);
    setError(null);
  };

  const updateQuestion = (id: string, patch: Partial<DraftQuestion>) =>
    setForm((f) => ({ ...f, questions: f.questions.map((q) => (q.id === id ? { ...q, ...patch } : q)) }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // The public entry page redirects here, so only real web links are allowed.
    if (!/^https?:\/\//i.test(form.destination_url.trim())) {
      setError('The destination link must start with http:// or https://.');
      return;
    }
    if (form.questions.length === 0) {
      setError('Add at least one question so you can verify entrants.');
      return;
    }
    setSaving(true);
    setError(null);
    const questions: QrQuestion[] = form.questions.map(({ optionsText, ...q }) => ({
      ...q,
      options:
        q.type === 'select'
          ? (optionsText ?? '')
              .split(',')
              .map((o) => o.trim())
              .filter(Boolean)
          : undefined,
    }));
    const payload = { name: form.name, slug: form.slug, destination_url: form.destination_url.trim(), questions };
    const { error: saveError } =
      editing && editing !== 'new'
        ? await supabase.from('qr_campaigns').update(payload).eq('id', editing.id)
        : await supabase.from('qr_campaigns').insert({ ...payload, created_by: profile?.id });
    setSaving(false);
    if (saveError) {
      setError(saveError.message);
      return;
    }
    toast.success(editing === 'new' ? 'Campaign created' : 'Campaign saved');
    setEditing(null);
    revalidator.revalidate();
  };

  const toggleActive = async (c: QrCampaignRow, active: boolean) => {
    if (await mutate(supabase.from('qr_campaigns').update({ active }).eq('id', c.id), active ? `${c.name} is live` : `${c.name} is paused`)) {
      revalidator.revalidate();
    }
  };

  return (
    <>
      <PageHeader
        zh="抽獎"
        title="QR campaigns"
        subtitle="Make a QR code for a giveaway, collect entries, and verify them by hand."
        action={
          <SiteButton type="button" size="sm" onClick={openCreate}>
            <Plus size={16} aria-hidden="true" />
            New campaign
          </SiteButton>
        }
      />

      <div className="grid items-start gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {campaigns.length === 0 ? (
            <EmptyState action={<SiteButton type="button" size="sm" onClick={openCreate}>Create a campaign</SiteButton>}>
              No campaigns yet.
            </EmptyState>
          ) : (
            <ul className="grid gap-5 md:grid-cols-2">
              {campaigns.map((c) => {
                const entries = c.entries?.[0]?.count ?? 0;
                return (
                  <li key={c.id}>
                    <Panel className="flex h-full flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-hk-red/10 text-hk-red">
                          <QrCode size={20} aria-hidden="true" />
                        </span>
                        <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-hk-ink-soft">
                          {c.active ? 'Live' : 'Paused'}
                          <Switch checked={c.active} onChange={(active) => toggleActive(c, active)} label={`${c.name} accepting entries`} />
                        </label>
                      </div>
                      <h2 className="mt-4 text-lg font-semibold leading-snug text-hk-ink">{c.name}</h2>
                      <p className="mt-0.5 break-all text-sm text-hk-ink-soft">/qr/{c.slug}</p>
                      <p className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-hk-ink-soft">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-hk-ink/[0.06] px-3 py-1">
                          <Users size={13} aria-hidden="true" /> {plural(entries, 'entry', 'entries')}
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-hk-ink/[0.06] px-3 py-1">
                          <ListChecks size={13} aria-hidden="true" /> {plural(c.questions.length, 'question')}
                        </span>
                      </p>
                      <div className="mt-auto flex gap-2 pt-6">
                        <SiteButton to={`/portal/qr-campaigns/${c.id}`} size="sm" className="flex-1">
                          QR & entries
                        </SiteButton>
                        <SiteButton type="button" variant="outline-ink" size="sm" onClick={() => openEdit(c)}>
                          <Pencil size={14} aria-hidden="true" />
                          Edit
                        </SiteButton>
                      </div>
                    </Panel>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="space-y-6 lg:sticky lg:top-8">
          <QueueStats
            title="Overview"
            stats={[
              { label: 'Campaigns', value: campaigns.length },
              { label: 'Live now', value: campaigns.filter((c) => c.active).length },
              { label: 'Entries', value: stats.total },
              { label: 'To verify', value: stats.unverified },
            ]}
          />
          <Panel className="bg-hk-blush/40 text-sm leading-relaxed text-hk-ink-soft">
            Instagram doesn't tell us who followed from a link, so spot-check submitted handles against the real follower list before picking a winner.
          </Panel>
        </div>
      </div>

      <Modal open={editing !== null} onOpenChange={(open) => !open && setEditing(null)} title={editing === 'new' ? 'New campaign' : 'Edit campaign'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Campaign name">
              <input
                required
                value={form.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setForm((f) => ({ ...f, name, slug: slugEdited ? f.slug : slugify(name) }));
                }}
                className={INPUT}
              />
            </Field>
            <Field label="Link name" hint={`${window.location.origin}/qr/${form.slug || '…'}`}>
              <input
                required
                value={form.slug}
                onChange={(e) => {
                  setSlugEdited(true);
                  setForm((f) => ({ ...f, slug: slugify(e.target.value) }));
                }}
                className={INPUT}
              />
            </Field>
          </div>
          <Field label="Send people to" hint="Where entrants land after submitting, e.g. our Instagram.">
            <input
              required
              type="url"
              inputMode="url"
              placeholder="https://instagram.com/binghkes"
              value={form.destination_url}
              onChange={(e) => setForm((f) => ({ ...f, destination_url: e.target.value }))}
              className={INPUT}
            />
          </Field>

          <fieldset>
            <div className="mb-2 flex items-center justify-between">
              <legend className="text-xs font-semibold uppercase tracking-[0.14em] text-hk-ink-soft">Entry form questions</legend>
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, questions: [...f.questions, newQuestion()] }))}
                className="inline-flex items-center gap-1 text-sm font-semibold text-hk-red hover:underline"
              >
                <Plus size={14} aria-hidden="true" /> Add question
              </button>
            </div>
            <ol className="space-y-3">
              {form.questions.map((q, i) => (
                <li key={q.id} className="rounded-xl border-2 border-hk-line p-3">
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                      required
                      aria-label={`Question ${i + 1}`}
                      placeholder="Question, e.g. Instagram handle"
                      value={q.label}
                      onChange={(e) => updateQuestion(q.id, { label: e.target.value })}
                      className={`${INPUT} sm:flex-1`}
                    />
                    <div className="flex gap-2">
                      <select
                        aria-label={`Question ${i + 1} type`}
                        value={q.type}
                        onChange={(e) => updateQuestion(q.id, { type: e.target.value as QrQuestion['type'] })}
                        className={`${INPUT} sm:w-40`}
                      >
                        {QUESTION_TYPES.map((t) => (
                          <option key={t.value} value={t.value}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                      <IconButton label={`Remove question ${i + 1}`} danger onClick={() => setForm((f) => ({ ...f, questions: f.questions.filter((x) => x.id !== q.id) }))}>
                        <Trash2 size={16} />
                      </IconButton>
                    </div>
                  </div>
                  {q.type === 'select' && (
                    <input
                      aria-label={`Question ${i + 1} options`}
                      placeholder="Options, separated by commas"
                      value={q.optionsText ?? ''}
                      onChange={(e) => updateQuestion(q.id, { optionsText: e.target.value })}
                      className={`${INPUT} mt-2`}
                    />
                  )}
                  <label className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-hk-ink-soft">
                    <input type="checkbox" checked={q.required} onChange={(e) => updateQuestion(q.id, { required: e.target.checked })} className="h-4 w-4 accent-hk-red" />
                    Required
                  </label>
                </li>
              ))}
            </ol>
          </fieldset>

          {error && <FormError>{error}</FormError>}
          <SiteButton type="submit" disabled={saving} className="w-full">
            {saving ? 'Saving…' : editing === 'new' ? 'Create campaign' : 'Save changes'}
          </SiteButton>
        </form>
      </Modal>
    </>
  );
}
