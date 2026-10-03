import { useState, type FormEvent } from 'react';
import { useLoaderData, useRevalidator } from 'react-router';
import { Pencil, Pin, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Tape } from '../../components/site/Paper';
import SiteButton from '../../components/site/SiteButton';
import { IconButton, Switch } from '../../components/portal/Controls';
import { Field, FormError, INPUT } from '../../components/portal/Form';
import Modal, { ConfirmDialog } from '../../components/portal/Modal';
import PageHeader from '../../components/portal/PageHeader';
import { EmptyState } from '../../components/portal/Panel';
import { useAuth } from '../../lib/auth';
import { formatTimestamp, mutate } from '../../lib/portal';
import { supabase } from '../../lib/supabase';
import type { AnnouncementRow } from '../../lib/queries';

interface LoaderData {
  announcements: AnnouncementRow[];
}

const EMPTY_FORM = { title: '', message: '', pinned: false };

export default function PortalAnnouncements() {
  const { announcements } = useLoaderData() as LoaderData;
  const revalidator = useRevalidator();
  const { profile, isExecutive } = useAuth();

  const [editing, setEditing] = useState<AnnouncementRow | 'new' | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<AnnouncementRow | null>(null);
  const [busy, setBusy] = useState(false);

  const openAdd = () => {
    setEditing('new');
    setForm(EMPTY_FORM);
    setError(null);
  };

  const openEdit = (a: AnnouncementRow) => {
    setEditing(a);
    setForm({ title: a.title, message: a.message, pinned: a.pinned });
    setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const { error } =
      editing && editing !== 'new'
        ? await supabase.from('announcements').update(form).eq('id', editing.id)
        : await supabase.from('announcements').insert({ ...form, author_id: profile?.id });
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    toast.success(editing === 'new' ? 'Announcement posted' : 'Announcement updated');
    setEditing(null);
    revalidator.revalidate();
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setBusy(true);
    const ok = await mutate(supabase.from('announcements').delete().eq('id', deleting.id), 'Announcement deleted');
    setBusy(false);
    if (ok) {
      setDeleting(null);
      revalidator.revalidate();
    }
  };

  return (
    <>
      <PageHeader
        zh="公告"
        title="Announcements"
        subtitle="Updates from the E-Board. Pinned notes stay on top."
        action={
          isExecutive ? (
            <SiteButton type="button" size="sm" onClick={openAdd}>
              <Plus size={16} aria-hidden="true" />
              New announcement
            </SiteButton>
          ) : undefined
        }
      />

      {announcements.length === 0 ? (
        <EmptyState>No announcements yet.</EmptyState>
      ) : (
        <ul className="space-y-6">
          {announcements.map((a) => (
            <li
              key={a.id}
              className={`relative rounded-[22px] border bg-hk-card p-6 shadow-[0_18px_34px_-28px_rgba(30,23,20,0.5)] sm:p-7 ${a.pinned ? 'border-2 border-hk-red' : 'border-hk-line'}`}
            >
              {a.pinned && <Tape tone="red" className="-top-3.5 left-8 w-20 -rotate-3" />}
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  {a.pinned && (
                    <p className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-hk-red">
                      <Pin size={13} aria-hidden="true" /> Pinned
                    </p>
                  )}
                  <h2 className="text-lg font-semibold leading-snug text-hk-ink">{a.title}</h2>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-hk-ink-soft">
                    {a.profiles?.full_name ?? 'HKES'}
                    {a.profiles?.title ? `, ${a.profiles.title}` : ''} · {formatTimestamp(a.created_at)}
                  </p>
                </div>
                {isExecutive && (
                  <div className="flex shrink-0 gap-1">
                    <IconButton label={`Edit ${a.title}`} onClick={() => openEdit(a)}>
                      <Pencil size={16} />
                    </IconButton>
                    <IconButton label={`Delete ${a.title}`} onClick={() => setDeleting(a)} danger>
                      <Trash2 size={16} />
                    </IconButton>
                  </div>
                )}
              </div>
              <p className="mt-4 whitespace-pre-line leading-relaxed text-hk-ink">{a.message}</p>
            </li>
          ))}
        </ul>
      )}

      <Modal open={editing !== null} onOpenChange={(open) => !open && setEditing(null)} title={editing === 'new' ? 'New announcement' : 'Edit announcement'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Title">
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={INPUT} />
          </Field>
          <Field label="Message">
            <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={INPUT} rows={5} />
          </Field>
          <label className="flex items-center gap-3 text-sm font-semibold text-hk-ink">
            <Switch checked={form.pinned} onChange={(pinned) => setForm({ ...form, pinned })} label="Pin to top" />
            Pin to top
          </label>
          {error && <FormError>{error}</FormError>}
          <SiteButton type="submit" disabled={saving} className="w-full">
            {saving ? 'Saving…' : editing === 'new' ? 'Post announcement' : 'Save changes'}
          </SiteButton>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Delete announcement?"
        body={
          <>
            <span className="font-semibold text-hk-ink">{deleting?.title}</span> will be removed for everyone. This can't be undone.
          </>
        }
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        busy={busy}
      />
    </>
  );
}
