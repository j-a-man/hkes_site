import PortalLayout from '../../components/PortalLayout';
import PageHeader from '../../components/portal/PageHeader';
import Reveal from '../../components/Reveal';
import Modal from '../../components/portal/Modal';
import { useMemo, useState } from 'react';
import { useLoaderData, useRevalidator } from 'react-router';
import { Calendar as CalendarIcon, List, Plus, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth';
import type { DeadlineRow } from '../../lib/queries';

interface LoaderData {
  deadlines: DeadlineRow[];
}

const STATUS_OPTIONS = ['not-started', 'in-progress', 'on-track', 'complete'] as const;

const EMPTY_FORM = { task: '', description: '', assigned_chair: '', due_date: '', status: 'not-started' as string };

export default function PortalDeadlines() {
  const { deadlines } = useLoaderData() as LoaderData;
  const revalidator = useRevalidator();
  const { profile, isExecutive } = useAuth();

  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [filter, setFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chairs = useMemo(() => ['All', ...Array.from(new Set(deadlines.map((d) => d.assigned_chair)))], [deadlines]);

  const filteredDeadlines = filter === 'All' ? deadlines : deadlines.filter((d) => d.assigned_chair === filter);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'complete':
        return <span className="bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-xs">Complete</span>;
      case 'in-progress':
        return <span className="bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 px-3 py-1 rounded-full text-xs">In Progress</span>;
      case 'not-started':
        return <span className="bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300 px-3 py-1 rounded-full text-xs">Not Started</span>;
      case 'on-track':
        return <span className="bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs">On Track</span>;
      default:
        return null;
    }
  };

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError(null);
    setShowModal(true);
  };

  const openEdit = (d: DeadlineRow) => {
    setEditingId(d.id);
    setForm({ task: d.task, description: d.description ?? '', assigned_chair: d.assigned_chair, due_date: d.due_date, status: d.status });
    setError(null);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
    const { error } = editingId
      ? await supabase.from('deadlines').update(payload).eq('id', editingId)
      : await supabase.from('deadlines').insert({ ...payload, created_by: profile?.id });
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    setShowModal(false);
    revalidator.revalidate();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('deadlines').delete().eq('id', id);
    revalidator.revalidate();
  };

  return (
    <PortalLayout>
      <div>
        <PageHeader
          title="Deadlines Tracker"
          subtitle="Manage and track all upcoming deadlines"
          action={
            <motion.button
              onClick={openAdd}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="bg-gradient-to-r from-[#fa4e5b] to-[#ff7a65] text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <Plus size={20} />
              Add Deadline
            </motion.button>
          }
        />

        <Reveal className="bg-white dark:bg-[#1a1b1e] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/10 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => setView('list')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  view === 'list'
                    ? 'bg-gradient-to-r from-[#fa4e5b] to-[#ff7a65] text-white'
                    : 'bg-gray-100 dark:bg-white/5 text-[#1A1A1A] dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-white/10'
                }`}
              >
                <List size={20} />
                List View
              </button>
              <button
                onClick={() => setView('calendar')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  view === 'calendar'
                    ? 'bg-gradient-to-r from-[#fa4e5b] to-[#ff7a65] text-white'
                    : 'bg-gray-100 dark:bg-white/5 text-[#1A1A1A] dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-white/10'
                }`}
              >
                <CalendarIcon size={20} />
                Calendar View
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {chairs.map((chair) => (
                <button
                  key={chair}
                  onClick={() => setFilter(chair)}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    filter === chair
                      ? 'bg-gradient-to-r from-[#fa4e5b] to-[#ff7a65] text-white'
                      : 'bg-gray-100 dark:bg-white/5 text-[#1A1A1A] dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-white/10'
                  }`}
                >
                  {chair}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {view === 'list' ? (
          <Reveal className="bg-white dark:bg-[#1a1b1e] rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="bg-[#FFF8F6] dark:bg-white/5">
                <tr>
                  <th className="text-left p-4">Task</th>
                  <th className="text-left p-4">Assigned Chair</th>
                  <th className="text-left p-4">Due Date</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeadlines.map((deadline) => (
                  <tr key={deadline.id} className="border-t border-border hover:bg-[#FFF8F6] dark:hover:bg-white/5 transition-colors">
                    <td className="p-4">{deadline.task}</td>
                    <td className="p-4">
                      <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs">{deadline.assigned_chair}</span>
                    </td>
                    <td className="p-4 text-[#555555] dark:text-gray-400">{deadline.due_date}</td>
                    <td className="p-4">{getStatusBadge(deadline.status)}</td>
                    <td className="p-4 flex items-center gap-3">
                      <button onClick={() => openEdit(deadline)} className="text-[#fa4e5b] hover:underline text-sm">Edit</button>
                      {isExecutive && (
                        <button onClick={() => handleDelete(deadline.id)} className="text-gray-400 hover:text-red-500">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredDeadlines.length === 0 && (
                  <tr><td colSpan={5} className="p-8 text-center text-[#555555] dark:text-gray-400">No deadlines yet.</td></tr>
                )}
              </tbody>
            </table>
            </div>
          </Reveal>
        ) : (
          <Reveal className="bg-white dark:bg-[#1a1b1e] rounded-2xl p-3 sm:p-6 shadow-sm border border-gray-100 dark:border-white/10">
            <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-[#555555] dark:text-gray-400 text-xs sm:text-base p-1 sm:p-2">
                  <span className="sm:hidden">{day[0]}</span>
                  <span className="hidden sm:inline">{day}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {[...filteredDeadlines].sort((a, b) => a.due_date.localeCompare(b.due_date)).map((d) => (
                <div key={d.id} className="flex items-center justify-between p-3 bg-[#FFF8F6] dark:bg-white/5 rounded-lg">
                  <span>{d.task}</span>
                  <span className="text-sm text-[#555555] dark:text-gray-400">{d.due_date}</span>
                </div>
              ))}
              {filteredDeadlines.length === 0 && (
                <p className="text-center text-[#555555] dark:text-gray-400 py-8">No deadlines to show.</p>
              )}
            </div>
          </Reveal>
        )}
      </div>

      <Modal open={showModal} onOpenChange={setShowModal} title={editingId ? 'Edit Deadline' : 'Add Deadline'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm">Task</label>
            <input required value={form.task} onChange={(e) => setForm({ ...form, task: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg" />
          </div>
          <div>
            <label className="block mb-1 text-sm">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg" rows={3} />
          </div>
          <div>
            <label className="block mb-1 text-sm">Assigned Chair</label>
            <input required value={form.assigned_chair} onChange={(e) => setForm({ ...form, assigned_chair: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg" placeholder="e.g. Publicity" />
          </div>
          <div>
            <label className="block mb-1 text-sm">Due Date</label>
            <input required type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg" />
          </div>
          <div>
            <label className="block mb-1 text-sm">Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg">
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={saving} className="w-full bg-gradient-to-r from-[#fa4e5b] to-[#ff7a65] text-white px-4 py-3 rounded-lg disabled:opacity-60">
            {saving ? 'Saving…' : editingId ? 'Save Changes' : 'Add Deadline'}
          </button>
        </form>
      </Modal>
    </PortalLayout>
  );
}
