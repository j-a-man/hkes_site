import { useState } from 'react';
import { useLoaderData, useRevalidator } from 'react-router';
import QRCode from 'qrcode';
import PortalLayout from '../../components/PortalLayout';
import PageHeader from '../../components/portal/PageHeader';
import Reveal from '../../components/Reveal';
import Modal from '../../components/portal/Modal';
import { Switch } from '../../components/ui/switch';
import { Plus, Trash2, Copy, Download, QrCode as QrCodeIcon, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth';
import { getQrCampaignEntries, type QrCampaignRow, type QrCampaignEntryRow, type QrQuestion } from '../../lib/queries';

interface LoaderData {
  campaigns: QrCampaignRow[];
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
  const { campaigns } = useLoaderData() as LoaderData;
  const revalidator = useRevalidator();
  const { profile } = useAuth();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [slugEdited, setSlugEdited] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [detailCampaign, setDetailCampaign] = useState<QrCampaignRow | null>(null);
  const [entries, setEntries] = useState<QrCampaignEntryRow[]>([]);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const publicUrl = (slug: string) => `${window.location.origin}/qr/${slug}`;

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

  const openDetail = async (c: QrCampaignRow) => {
    setDetailCampaign(c);
    setCopied(false);
    const [dataUrl, campaignEntries] = await Promise.all([
      QRCode.toDataURL(publicUrl(c.slug), { width: 320, margin: 2 }),
      getQrCampaignEntries(c.id),
    ]);
    setQrDataUrl(dataUrl);
    setEntries(campaignEntries);
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

  const toggleVerified = async (entry: QrCampaignEntryRow) => {
    const verified = !entry.verified;
    await supabase
      .from('qr_campaign_entries')
      .update({ verified, verified_by: verified ? profile?.id : null, verified_at: verified ? new Date().toISOString() : null })
      .eq('id', entry.id);
    setEntries((rows) => rows.map((r) => (r.id === entry.id ? { ...r, verified } : r)));
  };

  const copyLink = async (slug: string) => {
    await navigator.clipboard.writeText(publicUrl(slug));
    setCopied(true);
  };

  const downloadQr = () => {
    if (!qrDataUrl || !detailCampaign) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `${detailCampaign.slug}-qr.png`;
    a.click();
  };

  const exportCsv = () => {
    if (!detailCampaign) return;
    const headers = ['Submitted At', ...detailCampaign.questions.map((q) => q.label), 'Verified'];
    const rows = entries.map((e) => [
      new Date(e.created_at).toLocaleString(),
      ...detailCampaign.questions.map((q) => String(e.answers[q.id] ?? '')),
      e.verified ? 'Yes' : 'No',
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${detailCampaign.slug}-entries.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <PortalLayout>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {campaigns.map((c) => (
            <Reveal key={c.id} className="bg-white dark:bg-[#1a1b1e] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/10">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h2 className="text-xl mb-1">{c.name}</h2>
                  <p className="text-xs text-[#555555] dark:text-gray-400 break-all">/qr/{c.slug}</p>
                </div>
                <Switch checked={c.active} onCheckedChange={(checked) => toggleActive(c, checked)} />
              </div>
              <p className="text-sm text-[#555555] dark:text-gray-400 mb-4">
                {c.entries?.[0]?.count ?? 0} {c.entries?.[0]?.count === 1 ? 'entry' : 'entries'} · {c.questions.length} question{c.questions.length === 1 ? '' : 's'}
              </p>
              <div className="flex gap-2">
                <button onClick={() => openDetail(c)} className="flex-1 inline-flex items-center justify-center gap-2 border border-border rounded-lg px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-white/5">
                  <QrCodeIcon size={16} /> View QR & Entries
                </button>
                <button onClick={() => openEdit(c)} className="border border-border rounded-lg px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-white/5">
                  Edit
                </button>
              </div>
            </Reveal>
          ))}
          {campaigns.length === 0 && (
            <Reveal className="md:col-span-2 bg-white dark:bg-[#1a1b1e] rounded-2xl p-8 text-center text-[#555555] dark:text-gray-400 shadow-sm border border-gray-100 dark:border-white/10">
              No campaigns yet. Create one to generate your first QR code.
            </Reveal>
          )}
        </div>

        {/* Create/Edit Modal */}
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

        {/* Detail Modal */}
        <Modal open={!!detailCampaign} onOpenChange={(open) => !open && setDetailCampaign(null)} title={detailCampaign?.name ?? ''} className="max-w-3xl">
          {detailCampaign && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                {qrDataUrl && <img src={qrDataUrl} alt="QR code" className="w-40 h-40 rounded-lg border border-border" />}
                <div className="flex-1 space-y-2 w-full">
                  <p className="text-sm text-[#555555] dark:text-gray-400 break-all">{publicUrl(detailCampaign.slug)}</p>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => copyLink(detailCampaign.slug)} className="inline-flex items-center gap-2 border border-border rounded-lg px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-white/5">
                      {copied ? <CheckCircle2 size={16} className="text-green-500" /> : <Copy size={16} />} {copied ? 'Copied' : 'Copy Link'}
                    </button>
                    <button onClick={downloadQr} className="inline-flex items-center gap-2 border border-border rounded-lg px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-white/5">
                      <Download size={16} /> Download PNG
                    </button>
                    <button onClick={exportCsv} className="inline-flex items-center gap-2 border border-border rounded-lg px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-white/5">
                      <Download size={16} /> Export CSV
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg mb-3">Entries ({entries.length})</h3>
                <div className="overflow-x-auto border border-border rounded-lg">
                  <table className="w-full min-w-[480px]">
                    <thead className="bg-[#FFF8F6] dark:bg-white/5">
                      <tr>
                        <th className="text-left p-3 text-sm">Submitted</th>
                        {detailCampaign.questions.map((q) => (
                          <th key={q.id} className="text-left p-3 text-sm">{q.label}</th>
                        ))}
                        <th className="text-left p-3 text-sm">Verified</th>
                      </tr>
                    </thead>
                    <tbody>
                      {entries.map((entry) => (
                        <tr key={entry.id} className="border-t border-border">
                          <td className="p-3 text-sm text-[#555555] dark:text-gray-400">{new Date(entry.created_at).toLocaleDateString()}</td>
                          {detailCampaign.questions.map((q) => (
                            <td key={q.id} className="p-3 text-sm">{q.type === 'checkbox' ? (entry.answers[q.id] ? 'Yes' : 'No') : String(entry.answers[q.id] ?? '—')}</td>
                          ))}
                          <td className="p-3">
                            <input type="checkbox" checked={entry.verified} onChange={() => toggleVerified(entry)} />
                          </td>
                        </tr>
                      ))}
                      {entries.length === 0 && (
                        <tr>
                          <td colSpan={detailCampaign.questions.length + 2} className="p-6 text-center text-sm text-[#555555] dark:text-gray-400">
                            No entries yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </PortalLayout>
  );
}
