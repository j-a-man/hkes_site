import { useRef, useState } from 'react';
import { useLoaderData, useRevalidator } from 'react-router';
import PortalLayout from '../../components/PortalLayout';
import PageHeader from '../../components/portal/PageHeader';
import Reveal from '../../components/Reveal';
import { Upload } from 'lucide-react';
import { motion } from 'motion/react';
import { supabase } from '../../lib/supabase';
import { uploadFile } from '../../lib/uploads';
import { useAuth } from '../../lib/auth';
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState(EMPTY_FORM);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const togglePlatform = (p: string) => {
    setForm((f) => ({ ...f, platforms: f.platforms.includes(p) ? f.platforms.filter((x) => x !== p) : [...f.platforms, p] }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Complete': return 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300';
      case 'In Progress': return 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300';
      default: return 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      let reference_image_url: string | null = null;
      if (file) {
        const uploaded = await uploadFile('graphics', file, profile?.id ?? 'anon');
        reference_image_url = uploaded.publicUrl;
      }
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
      if (fileInputRef.current) fileInputRef.current.value = '';
      revalidator.revalidate();
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  const stats = {
    pending: requests.filter((r) => r.status === 'Pending').length,
    inProgress: requests.filter((r) => r.status === 'In Progress').length,
    complete: requests.filter((r) => r.status === 'Complete').length,
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('graphic_requests').update({ status }).eq('id', id);
    revalidator.revalidate();
  };

  return (
    <PortalLayout>
      <div>
        <PageHeader title="Graphic Requests" subtitle="Request new graphics and track the queue" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Reveal className="lg:col-span-2 bg-white dark:bg-[#1a1b1e] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/10">
            <h2 className="text-2xl mb-4">New Request</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm">Event/Post Name</label>
                <input required value={form.event_name} onChange={(e) => setForm({ ...form, event_name: e.target.value })} className="w-full px-4 py-2 border border-border rounded-lg" />
              </div>
              <div>
                <label className="block mb-1 text-sm">Type of Graphic</label>
                <select value={form.graphic_type} onChange={(e) => setForm({ ...form, graphic_type: e.target.value })} className="w-full px-4 py-2 border border-border rounded-lg">
                  {GRAPHIC_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block mb-1 text-sm">Platform(s) Needed For</label>
                <div className="flex flex-wrap gap-4">
                  {PLATFORMS.map((p) => (
                    <label key={p} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={form.platforms.includes(p)} onChange={() => togglePlatform(p)} />
                      {p}
                    </label>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm">Event Date & Time</label>
                  <input type="datetime-local" value={form.event_datetime} onChange={(e) => setForm({ ...form, event_datetime: e.target.value })} className="w-full px-4 py-2 border border-border rounded-lg" />
                </div>
                <div>
                  <label className="block mb-1 text-sm">Due Date</label>
                  <input required type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} className="w-full px-4 py-2 border border-border rounded-lg" />
                </div>
              </div>
              <div>
                <label className="block mb-1 text-sm">Description of Content/Vibe</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2 border border-border rounded-lg" rows={3} />
              </div>
              <div>
                <label className="block mb-1 text-sm">Reference Image (Optional)</label>
                <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-lg p-6 cursor-pointer hover:border-[#fa4e5b] transition-colors">
                  <Upload size={24} className="text-[#555555]" />
                  <span className="text-sm text-[#555555] dark:text-gray-400">{file ? file.name : 'Click to upload an image'}</span>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                </label>
              </div>
              <div>
                <label className="block mb-1 text-sm">Priority Level</label>
                <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as 'Normal' | 'Urgent' })} className="w-full px-4 py-2 border border-border rounded-lg">
                  <option>Normal</option>
                  <option>Urgent</option>
                </select>
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="w-full bg-gradient-to-r from-[#fa4e5b] to-[#ff7a65] text-white px-6 py-3 rounded-lg shadow-md disabled:opacity-60"
              >
                {submitting ? 'Submitting…' : 'Submit Request'}
              </motion.button>
            </form>
          </Reveal>

          <Reveal className="bg-gradient-to-br from-[#fa4e5b] to-[#ff7a65] rounded-2xl p-6 text-white h-fit">
            <h2 className="text-xl mb-4">Queue Stats</h2>
            <div className="space-y-3">
              <div className="flex justify-between"><span>Pending</span><span>{stats.pending}</span></div>
              <div className="flex justify-between"><span>In Progress</span><span>{stats.inProgress}</span></div>
              <div className="flex justify-between"><span>Completed</span><span>{stats.complete}</span></div>
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-8 bg-white dark:bg-[#1a1b1e] rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden">
          <div className="p-6 pb-0"><h2 className="text-2xl mb-4">Current Queue</h2></div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead className="bg-[#FFF8F6] dark:bg-white/5">
                <tr>
                  <th className="text-left p-4">Requester</th>
                  <th className="text-left p-4">Event Name</th>
                  <th className="text-left p-4">Type</th>
                  <th className="text-left p-4">Platform</th>
                  <th className="text-left p-4">Due Date</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Priority</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.id} className="border-t border-border">
                    <td className="p-4">{r.profiles?.full_name ?? '—'}</td>
                    <td className="p-4">{r.event_name}</td>
                    <td className="p-4">{r.graphic_type}</td>
                    <td className="p-4">{r.platforms.join(', ')}</td>
                    <td className="p-4 text-[#555555] dark:text-gray-400">{r.due_date}</td>
                    <td className="p-4">
                      <select value={r.status} onChange={(e) => updateStatus(r.id, e.target.value)} className={`px-3 py-1 rounded-full text-xs border-0 ${getStatusColor(r.status)}`}>
                        {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="p-4">
                      {r.priority === 'Urgent'
                        ? <span className="bg-red-500 text-white px-2 py-1 rounded text-xs">Urgent</span>
                        : <span className="bg-gray-200 dark:bg-white/10 px-2 py-1 rounded text-xs">Normal</span>}
                    </td>
                  </tr>
                ))}
                {requests.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-[#555555] dark:text-gray-400">No requests yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </PortalLayout>
  );
}
