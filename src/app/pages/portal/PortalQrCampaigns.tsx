import { useState } from 'react';
import { Link, useLoaderData, useRevalidator } from 'react-router';
import PageHeader from '../../components/portal/PageHeader';
import Reveal from '../../components/Reveal';
import Modal from '../../components/portal/Modal';
import { Switch } from '../../components/ui/switch';
import { Plus, Trash2, QrCode as QrCodeIcon, Users, Sparkles } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth';
import type { QrCampaignRow, QrQuestion } from '../../lib/queries';

interface LoaderData {
  campaigns: QrCampaignRow[];
  stats: { total: number; unverified: number };
}

type DraftQuestion = QrQuestion & { optionsText?: string };

const EMPTY_FORM = { name: '', slug: '', destination_url: '', questions: [] as DraftQuestion[] };

function slugify(name: string) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function newQuestion(): DraftQuestion {
  return { id: crypto.randomUUID(), label: '', type: 'text', required: true };
}

export default function PortalQrCampaigns() {
  const { campaigns, stats } = useLoaderData() as LoaderData;
  const revalidator = useRevalidator();
  const { profile } = useAuth();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [slugEdited, setSlugEdited] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeCount = campaigns.filter((c) => c.active).length;

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setSlugEdited(false);
    setError(null);
    setShowForm(true);
  };

  const openEdit = (c: QrCampaignRow) => {
    setEditingId(c.id);
    setForm({
      name: c.name,
      slug: c.slug,
      destination_url: c.destination_url,
      questions: c.questions.map((q) => ({ ...q, optionsText: (q.options ?? []).join(', ') })),
    });
    setSlugEdited(true);
    setError(null);
    setShowForm(true);
  };

  const updateQuestion = (id: string, patch: Partial<DraftQuestion>) => {
    setForm((f) => ({ ...f, questions: f.questions.map((q) => (q.id === id ? { ...q, ...patch } : q)) }));
  };

  const removeQuestion = (id: string) => {
    setForm((f) => ({ ...f, questions: f.questions.filter((q) => q.id !== id) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const questions: QrQuestion[] = form.questions.map(({ optionsText, ...q }) => ({
        ...q,
        options: q.type === 'select' ? (optionsText ?? '').split(',').map((o) => o.trim()).filter(Boolean) : undefined,
      }));
      const payload = {
        name: form.name,
        slug: form.slug,
        destination_url: form.destination_url,
        questions,
      };
      const { error: saveError } = editingId
        ? await supabase.from('qr_campaigns').update(payload).eq('id', editingId)
        : await supabase.from('qr_campaigns').insert({ ...payload, created_by: profile?.id });
      if (saveError) throw saveError;
      setShowForm(false);
      revalidator.revalidate();
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (c: QrCampaignRow, active: boolean) => {
    await supabase.from('qr_campaigns').update({ active }).eq('id', c.id);
    revalidator.revalidate();
  };

  return (
    <div>
      <PageHeader
        title="QR Campaigns"
        subtitle="Build QR codes for giveaways, track entries, and verify them by hand"
        action={
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#fa4e5b] to-[#ff7a65] text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-md hover:-translate-y-0.5 transition-transform"
          >
            <Plus size={16} /> New Campaign
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-4">
          {campaigns.map((c) => (
            <Reveal key={c.id} className="bg-white dark:bg-[#1a1b1e] rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div className="flex items-start gap-4 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#ffbba1] to-[#fa4e5b] flex items-center justify-center shrink-0 shadow-sm">
                    <QrCodeIcon size={20} className="text-white" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-lg font-semibold truncate">{c.name}</h2>
                    <p className="text-xs text-[#555555] dark:text-gray-400 break-all">/qr/{c.slug}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="inline-flex items-center gap-1 text-xs bg-[#FFF8F6] dark:bg-white/5 text-[#555555] dark:text-gray-300 px-2.5 py-1 rounded-full">
                        <Users size={12} /> {c.entries?.[0]?.count ?? 0} {c.entries?.[0]?.count === 1 ? 'entry' : 'entries'}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs bg-[#FFF8F6] dark:bg-white/5 text-[#555555] dark:text-gray-300 px-2.5 py-1 rounded-full">
                        <Sparkles size={12} /> {c.questions.length} question{c.questions.length === 1 ? '' : 's'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-[#555555] dark:text-gray-400">{c.active ? 'Active' : 'Paused'}</span>
                  <Switch checked={c.active} onCheckedChange={(checked) => toggleActive(c, checked)} />
                </div>
              </div>
              <div className="flex gap-2 mt-5">
                <Link to={`/portal/qr-campaigns/${c.id}`} className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#fa4e5b] to-[#ff7a65] text-white rounded-lg px-4 py-2 text-sm font-medium shadow-sm hover:-translate-y-0.5 transition-transform">
                  <QrCodeIcon size={16} /> View QR & Entries
                </Link>
                <button onClick={() => openEdit(c)} className="border border-border rounded-lg px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-white/5">
                  Edit
                </button>
              </div>
            </Reveal>
          ))}
          {campaigns.length === 0 && (
            <Reveal className="bg-white dark:bg-[#1a1b1e] rounded-2xl p-8 text-center text-[#555555] dark:text-gray-400 shadow-sm border border-gray-100 dark:border-white/10">
              No campaigns yet. Create one to generate your first QR code.
            </Reveal>
          )}
        </div>

        <Reveal className="bg-gradient-to-br from-[#fa4e5b] to-[#ff7a65] rounded-2xl p-6 text-white lg:sticky lg:top-8">
          <h2 className="text-xl mb-4">Overview</h2>
          <div className="space-y-3">
            <div className="flex justify-between"><span>Campaigns</span><span>{campaigns.length}</span></div>
            <div className="flex justify-between"><span>Active</span><span>{activeCount}</span></div>
            <div className="flex justify-between"><span>Total Entries</span><span>{stats.total}</span></div>
            <div className="flex justify-between"><span>Awaiting Verification</span><span>{stats.unverified}</span></div>
          </div>
          <div className="mt-6 pt-6 border-t border-white/20 text-sm text-white/85 leading-relaxed">
            Instagram doesn't expose who followed from a link, so spot-check a sample of submitted handles against your real follower list before picking a winner.
          </div>
        </Reveal>
      </div>

      <Modal open={showForm} onOpenChange={setShowForm} title={editingId ? 'Edit Campaign' : 'New Campaign'} className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm">Campaign Name</label>
            <input
              required
              value={form.name}
              onChange={(e) => {
                const name = e.target.value;
                setForm((f) => ({ ...f, name, slug: slugEdited ? f.slug : slugify(name) }));
              }}
              className="w-full px-4 py-2 border border-border rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm">Slug (used in the QR link)</label>
            <input
              required
              value={form.slug}
              onChange={(e) => {
                setSlugEdited(true);
                setForm((f) => ({ ...f, slug: slugify(e.target.value) }));
              }}
              className="w-full px-4 py-2 border border-border rounded-lg"
            />
            <p className="text-xs text-[#555555] dark:text-gray-400 mt-1">{window.location.origin}/qr/{form.slug || '…'}</p>
          </div>
          <div>
            <label className="block mb-1 text-sm">Destination Link (where they land after submitting)</label>
            <input
              required
              type="url"
              placeholder="https://instagram.com/hkes_binghamton"
              value={form.destination_url}
              onChange={(e) => setForm((f) => ({ ...f, destination_url: e.target.value }))}
              className="w-full px-4 py-2 border border-border rounded-lg"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm">Entry Form Questions</label>
              <button type="button" onClick={() => setForm((f) => ({ ...f, questions: [...f.questions, newQuestion()] }))} className="inline-flex items-center gap-1 text-xs text-[#fa4e5b] font-semibold">
                <Plus size={14} /> Add Question
              </button>
            </div>
            <div className="space-y-3">
              {form.questions.map((q) => (
                <div key={q.id} className="border border-border rounded-lg p-3 space-y-2">
                  <div className="flex gap-2">
                    <input
                      required
                      placeholder="Question label (e.g. Instagram handle)"
                      value={q.label}
                      onChange={(e) => updateQuestion(q.id, { label: e.target.value })}
                      className="flex-1 px-3 py-2 border border-border rounded-lg text-sm"
                    />
                    <select
                      value={q.type}
                      onChange={(e) => updateQuestion(q.id, { type: e.target.value as QrQuestion['type'] })}
                      className="px-3 py-2 border border-border rounded-lg text-sm"
                    >
                      <option value="text">Short answer</option>
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                      <option value="select">Dropdown</option>
                      <option value="checkbox">Checkbox</option>
                    </select>
                    <button type="button" onClick={() => removeQuestion(q.id)} className="text-red-500 px-2">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  {q.type === 'select' && (
                    <input
                      placeholder="Options, comma separated"
                      value={q.optionsText ?? ''}
                      onChange={(e) => updateQuestion(q.id, { optionsText: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                    />
                  )}
                  <label className="flex items-center gap-2 text-xs">
                    <input type="checkbox" checked={q.required} onChange={(e) => updateQuestion(q.id, { required: e.target.checked })} />
                    Required
                  </label>
                </div>
              ))}
              {form.questions.length === 0 && (
                <p className="text-xs text-[#555555] dark:text-gray-400">No questions yet — add at least one so you have something to verify entrants by (e.g. Instagram handle).</p>
              )}
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-gradient-to-r from-[#fa4e5b] to-[#ff7a65] text-white px-6 py-3 rounded-lg shadow-md disabled:opacity-60"
          >
            {saving ? 'Saving…' : editingId ? 'Save Changes' : 'Create Campaign'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
