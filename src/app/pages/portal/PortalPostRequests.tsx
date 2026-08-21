import { useRef, useState } from 'react';
import { useLoaderData, useRevalidator } from 'react-router';
import PageHeader from '../../components/portal/PageHeader';
import Reveal from '../../components/Reveal';
import { Upload } from 'lucide-react';
import { motion } from 'motion/react';
import { supabase } from '../../lib/supabase';
import { uploadFile } from '../../lib/uploads';
import { useAuth } from '../../lib/auth';
import type { PostRequestRow } from '../../lib/queries';

interface LoaderData {
  requests: PostRequestRow[];
}

const PLATFORMS = ['Instagram', 'Facebook', 'GroupMe', 'Email List', 'LinkedIn'];
const POST_TYPES = ['Event Promo', 'Fundraiser', 'Recap', 'Announcement', 'Partnership'];
const STATUS_OPTIONS = ['Pending', 'Scheduled', 'Published'] as const;

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
      case 'Published': return 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300';
      case 'Scheduled': return 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300';
      default: return 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      let graphic_url: string | null = null;
      if (form.has_graphic && file) {
        const uploaded = await uploadFile('graphics', file, profile?.id ?? 'anon');
        graphic_url = uploaded.publicUrl;
      }
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
    scheduled: requests.filter((r) => r.status === 'Scheduled').length,
    published: requests.filter((r) => r.status === 'Published').length,
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('post_requests').update({ status }).eq('id', id);
    revalidator.revalidate();
  };

  return (
      <div>
        <PageHeader title="Post Requests" subtitle="Request a social post and track the queue" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Reveal className="lg:col-span-2 bg-white dark:bg-[#1a1b1e] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/10">
            <h2 className="text-2xl mb-4">New Post Request</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm">Platform(s)</label>
                <div className="flex flex-wrap gap-4">
                  {PLATFORMS.map((p) => (
                    <label key={p} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={form.platforms.includes(p)} onChange={() => togglePlatform(p)} />
                      {p}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block mb-1 text-sm">Type of Post</label>
                <select value={form.post_type} onChange={(e) => setForm({ ...form, post_type: e.target.value })} className="w-full px-4 py-2 border border-border rounded-lg">
                  {POST_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block mb-1 text-sm">Post Copy/Caption</label>
                <textarea required value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} className="w-full px-4 py-2 border border-border rounded-lg" rows={3} />
              </div>
              <div>
                <label className="block mb-1 text-sm">Graphic Attached?</label>
                <select
                  value={form.has_graphic ? 'yes' : 'no'}
                  onChange={(e) => setForm({ ...form, has_graphic: e.target.value === 'yes' })}
                  className="w-full px-4 py-2 border border-border rounded-lg"
                >
                  <option value="yes">Yes - Upload below</option>
                  <option value="no">No - Request from Publicity</option>
                </select>
              </div>
              {form.has_graphic && (
                <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-lg p-6 cursor-pointer hover:border-[#fa4e5b] transition-colors">
                  <Upload size={24} className="text-[#555555]" />
                  <span className="text-sm text-[#555555] dark:text-gray-400">{file ? file.name : 'Click to upload an image'}</span>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                </label>
              )}
              <div>
                <label className="block mb-1 text-sm">Requested Publish Date</label>
                <input required type="date" value={form.publish_date} onChange={(e) => setForm({ ...form, publish_date: e.target.value })} className="w-full px-4 py-2 border border-border rounded-lg" />
              </div>
              <div>
                <label className="block mb-1 text-sm">Link to Include (Optional)</label>
                <input type="url" value={form.link_url} onChange={(e) => setForm({ ...form, link_url: e.target.value })} className="w-full px-4 py-2 border border-border rounded-lg" />
              </div>
              <div>
                <label className="block mb-1 text-sm">Target Audience Notes</label>
                <textarea value={form.audience_notes} onChange={(e) => setForm({ ...form, audience_notes: e.target.value })} className="w-full px-4 py-2 border border-border rounded-lg" rows={2} />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="w-full bg-gradient-to-r from-[#fa4e5b] to-[#ff7a65] text-white px-6 py-3 rounded-lg shadow-md disabled:opacity-60"
              >
                {submitting ? 'Submitting…' : 'Submit Post Request'}
              </motion.button>
            </form>
          </Reveal>

          <div className="space-y-6 h-fit">
            <Reveal className="bg-gradient-to-br from-[#fa4e5b] to-[#ff7a65] rounded-2xl p-6 text-white">
              <h2 className="text-xl mb-4">Post Queue Stats</h2>
              <div className="space-y-3">
                <div className="flex justify-between"><span>Pending</span><span>{stats.pending}</span></div>
                <div className="flex justify-between"><span>Scheduled</span><span>{stats.scheduled}</span></div>
                <div className="flex justify-between"><span>Published</span><span>{stats.published}</span></div>
              </div>
            </Reveal>
            <Reveal className="bg-white dark:bg-[#1a1b1e] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/10">
              <h2 className="text-lg mb-3">Outreach Tips</h2>
              <ul className="text-sm text-[#555555] dark:text-gray-400 space-y-2 list-disc list-inside">
                <li>Post 2–3 days before the event for best reach.</li>
                <li>Keep captions under 150 characters for Instagram.</li>
                <li>Tag @binghkes so we can reshare.</li>
              </ul>
            </Reveal>
          </div>
        </div>

        <Reveal className="mt-8 bg-white dark:bg-[#1a1b1e] rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden">
          <div className="p-6 pb-0"><h2 className="text-2xl mb-4">Current Post Queue</h2></div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead className="bg-[#FFF8F6] dark:bg-white/5">
                <tr>
                  <th className="text-left p-4">Requester</th>
                  <th className="text-left p-4">Platform</th>
                  <th className="text-left p-4">Type</th>
                  <th className="text-left p-4">Caption Preview</th>
                  <th className="text-left p-4">Publish Date</th>
                  <th className="text-left p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.id} className="border-t border-border">
                    <td className="p-4">{r.profiles?.full_name ?? '—'}</td>
                    <td className="p-4">{r.platforms.join(', ')}</td>
                    <td className="p-4">{r.post_type}</td>
                    <td className="p-4 max-w-xs truncate">{r.caption}</td>
                    <td className="p-4 text-[#555555] dark:text-gray-400">{r.publish_date}</td>
                    <td className="p-4">
                      <select value={r.status} onChange={(e) => updateStatus(r.id, e.target.value)} className={`px-3 py-1 rounded-full text-xs border-0 ${getStatusColor(r.status)}`}>
                        {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
                {requests.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-[#555555] dark:text-gray-400">No requests yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
  );
}
