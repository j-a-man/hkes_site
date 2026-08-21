import { useState } from 'react';
import { useLoaderData, useRevalidator } from 'react-router';
import PortalLayout from '../../components/PortalLayout';
import PageHeader from '../../components/portal/PageHeader';
import Reveal from '../../components/Reveal';
import Modal from '../../components/portal/Modal';
import { Plus, Pin, Pencil, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth';
import type { AnnouncementRow } from '../../lib/queries';

interface LoaderData {
  announcements: AnnouncementRow[];
}

const EMPTY_FORM = { title: '', message: '', pinned: false };

export default function PortalAnnouncements() {
  const { announcements } = useLoaderData() as LoaderData;
  const revalidator = useRevalidator();
  const { profile, isExecutive } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError(null);
    setShowModal(true);
  };

  const openEdit = (a: AnnouncementRow) => {
    setEditingId(a.id);
    setForm({ title: a.title, message: a.message, pinned: a.pinned });
    setError(null);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const { error } = editingId
      ? await supabase.from('announcements').update(form).eq('id', editingId)
      : await supabase.from('announcements').insert({ ...form, author_id: profile?.id });
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    setShowModal(false);
    revalidator.revalidate();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('announcements').delete().eq('id', id);
    revalidator.revalidate();
  };

  return (
    <PortalLayout>
      <div>
        <PageHeader
          title="Announcements"
          subtitle="Updates from the E-Board"
          action={isExecutive ? (
            <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} onClick={openAdd}
              className="bg-gradient-to-r from-[#fa4e5b] to-[#ff7a65] text-white px-6 py-3 rounded-lg shadow-md flex items-center justify-center gap-2 w-full sm:w-auto">
              <Plus size={20} /> New Announcement
            </motion.button>
          ) : undefined}
        />

        <div className="space-y-4">
          {announcements.map((a) => (
            <Reveal key={a.id} className="bg-white dark:bg-[#1a1b1e] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/10">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  {a.pinned && <Pin size={14} className="text-[#fa4e5b]" />}
                  <h3 className="text-lg">{a.title}</h3>
                </div>
                {isExecutive && (
                  <div className="flex items-center gap-3">
                    <button onClick={() => openEdit(a)} className="text-gray-400 hover:text-[#fa4e5b]"><Pencil size={16} /></button>
                    <button onClick={() => handleDelete(a.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center mb-3 text-sm text-[#555555] dark:text-gray-400">
                <span>{a.profiles?.full_name ?? 'HKES'}{a.profiles?.title ? ` (${a.profiles.title})` : ''}</span>
                <span>{new Date(a.created_at).toLocaleDateString()}</span>
              </div>
              <p className="text-[#555555] dark:text-gray-400">{a.message}</p>
            </Reveal>
          ))}
          {announcements.length === 0 && (
            <div className="bg-white dark:bg-[#1a1b1e] rounded-2xl p-12 shadow-sm border border-gray-100 dark:border-white/10 text-center">
              <p className="text-[#555555] dark:text-gray-400">No announcements yet.</p>
            </div>
          )}
        </div>
      </div>

      <Modal open={showModal} onOpenChange={setShowModal} title={editingId ? 'Edit Announcement' : 'New Announcement'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm">Title</label>
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg" />
          </div>
          <div>
            <label className="block mb-1 text-sm">Message</label>
            <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg" rows={4} />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.pinned} onChange={(e) => setForm({ ...form, pinned: e.target.checked })} />
            Pin to top
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={saving} className="w-full bg-gradient-to-r from-[#fa4e5b] to-[#ff7a65] text-white px-4 py-3 rounded-lg disabled:opacity-60">
            {saving ? 'Saving…' : editingId ? 'Save Changes' : 'Post Announcement'}
          </button>
        </form>
      </Modal>
    </PortalLayout>
  );
}
