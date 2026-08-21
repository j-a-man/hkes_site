import { useRef, useState } from 'react';
import { useLoaderData, useRevalidator } from 'react-router';
import PageHeader from '../../components/portal/PageHeader';
import Reveal from '../../components/Reveal';
import { DollarSign, Upload } from 'lucide-react';
import { motion } from 'motion/react';
import { supabase } from '../../lib/supabase';
import { uploadFile, getSignedUrl } from '../../lib/uploads';
import { useAuth } from '../../lib/auth';
import type { ReimbursementRow } from '../../lib/queries';

interface LoaderData {
  reimbursements: ReimbursementRow[];
}

const CATEGORIES = ['Event Supplies', 'Food & Beverage', 'Marketing Materials', 'Transportation', 'Other'];
const PAYMENT_METHODS = ['Venmo', 'Zelle', 'Check'];
const STATUS_OPTIONS = ['Pending', 'Approved', 'Paid', 'Rejected'] as const;

const EMPTY_FORM = {
  purchase_date: '',
  category: CATEGORIES[0],
  amount: '',
  vendor: '',
  description: '',
  event_name: '',
  payment_method: PAYMENT_METHODS[0],
  payment_account: '',
};

export default function PortalReimbursements() {
  const { reimbursements } = useLoaderData() as LoaderData;
  const revalidator = useRevalidator();
  const { profile, isExecutive } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState(EMPTY_FORM);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300';
      case 'Approved': return 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300';
      case 'Rejected': return 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300';
      default: return 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      let receipt_url: string | null = null;
      if (file) {
        const uploaded = await uploadFile('receipts', file, profile?.id ?? 'anon');
        receipt_url = uploaded.path;
      }
      const { error } = await supabase.from('reimbursements').insert({
        requested_by: profile?.id,
        purchase_date: form.purchase_date,
        category: form.category,
        amount: Number(form.amount),
        vendor: form.vendor,
        description: form.description || null,
        event_name: form.event_name || null,
        receipt_url,
        payment_method: form.payment_method,
        payment_account: form.payment_account || null,
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

  const viewReceipt = async (path: string) => {
    try {
      const url = await getSignedUrl('receipts', path);
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch {
      // no-op — file may have been removed
    }
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('reimbursements').update({ status, reviewed_by: profile?.id }).eq('id', id);
    revalidator.revalidate();
  };

  const visible = isExecutive ? reimbursements : reimbursements.filter((r) => r.requested_by === profile?.id);
  const totalReimbursed = visible.filter((r) => r.status === 'Paid').reduce((sum, r) => sum + Number(r.amount), 0);
  const totalPending = visible.filter((r) => r.status === 'Pending').reduce((sum, r) => sum + Number(r.amount), 0);

  return (
      <div>
        <PageHeader title="Reimbursements" subtitle="Submit a reimbursement request and track its status" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Reveal className="lg:col-span-2 bg-white dark:bg-[#1a1b1e] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/10">
            <h2 className="text-2xl mb-4">New Reimbursement Request</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm">Purchase Date</label>
                <input required type="date" value={form.purchase_date} onChange={(e) => setForm({ ...form, purchase_date: e.target.value })} className="w-full px-4 py-2 border border-border rounded-lg" />
              </div>
              <div>
                <label className="block mb-1 text-sm">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2 border border-border rounded-lg">
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block mb-1 text-sm">Amount ($)</label>
                <div className="relative">
                  <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555555]" />
                  <input required type="number" step="0.01" min="0" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="w-full pl-9 pr-4 py-2 border border-border rounded-lg" />
                </div>
              </div>
              <div>
                <label className="block mb-1 text-sm">Vendor/Store Name</label>
                <input required value={form.vendor} onChange={(e) => setForm({ ...form, vendor: e.target.value })} className="w-full px-4 py-2 border border-border rounded-lg" />
              </div>
              <div>
                <label className="block mb-1 text-sm">Description of Purchase</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2 border border-border rounded-lg" rows={2} />
              </div>
              <div>
                <label className="block mb-1 text-sm">Event This Relates To</label>
                <input value={form.event_name} onChange={(e) => setForm({ ...form, event_name: e.target.value })} className="w-full px-4 py-2 border border-border rounded-lg" placeholder="e.g. Lunar New Year Gala" />
              </div>
              <div>
                <label className="block mb-1 text-sm">Receipt Upload</label>
                <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-lg p-6 cursor-pointer hover:border-[#fa4e5b] transition-colors">
                  <Upload size={24} className="text-[#555555]" />
                  <span className="text-sm text-[#555555] dark:text-gray-400">{file ? file.name : 'Click to upload a receipt (image or PDF)'}</span>
                  <input ref={fileInputRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                </label>
              </div>
              <div>
                <label className="block mb-1 text-sm">Payment Method to Reimburse</label>
                <select value={form.payment_method} onChange={(e) => setForm({ ...form, payment_method: e.target.value })} className="w-full px-4 py-2 border border-border rounded-lg mb-2">
                  {PAYMENT_METHODS.map((m) => <option key={m}>{m}</option>)}
                </select>
                <input value={form.payment_account} onChange={(e) => setForm({ ...form, payment_account: e.target.value })} className="w-full px-4 py-2 border border-border rounded-lg" placeholder="@username or account info" />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="w-full bg-gradient-to-r from-[#fa4e5b] to-[#ff7a65] text-white px-6 py-3 rounded-lg shadow-md disabled:opacity-60"
              >
                {submitting ? 'Submitting…' : 'Submit Reimbursement'}
              </motion.button>
            </form>
          </Reveal>

          <div className="space-y-6 h-fit">
            <Reveal className="bg-gradient-to-br from-[#fa4e5b] to-[#ff7a65] rounded-2xl p-6 text-white">
              <h2 className="text-xl mb-4">{isExecutive ? 'All Stats' : 'My Stats'}</h2>
              <div className="space-y-3">
                <div className="flex justify-between"><span>Total Reimbursed</span><span>${totalReimbursed.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Pending</span><span>${totalPending.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Total Requests</span><span>{visible.length}</span></div>
              </div>
            </Reveal>
            <Reveal className="bg-white dark:bg-[#1a1b1e] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/10">
              <h2 className="text-lg mb-3">Reimbursement Tips</h2>
              <ul className="text-sm text-[#555555] dark:text-gray-400 space-y-2 list-disc list-inside">
                <li>Submit within 2 weeks of purchase.</li>
                <li>Always attach a clear photo or PDF of the receipt.</li>
                <li>Double check your payment handle before submitting.</li>
              </ul>
            </Reveal>
          </div>
        </div>

        <Reveal className="mt-8 bg-white dark:bg-[#1a1b1e] rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden">
          <div className="p-6 pb-0"><h2 className="text-2xl mb-4">{isExecutive ? 'Reimbursement History' : 'My Reimbursement History'}</h2></div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead className="bg-[#FFF8F6] dark:bg-white/5">
                <tr>
                  {isExecutive && <th className="text-left p-4">Requester</th>}
                  <th className="text-left p-4">Date</th>
                  <th className="text-left p-4">Category</th>
                  <th className="text-left p-4">Amount</th>
                  <th className="text-left p-4">Vendor</th>
                  <th className="text-left p-4">Event</th>
                  <th className="text-left p-4">Receipt</th>
                  <th className="text-left p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((r) => (
                  <tr key={r.id} className="border-t border-border">
                    {isExecutive && <td className="p-4">{r.profiles?.full_name ?? '—'}</td>}
                    <td className="p-4 text-[#555555] dark:text-gray-400">{r.purchase_date}</td>
                    <td className="p-4">{r.category}</td>
                    <td className="p-4">${Number(r.amount).toFixed(2)}</td>
                    <td className="p-4">{r.vendor}</td>
                    <td className="p-4">{r.event_name ?? '—'}</td>
                    <td className="p-4">
                      {r.receipt_url ? (
                        <button onClick={() => viewReceipt(r.receipt_url!)} className="text-[#fa4e5b] hover:underline text-sm">View</button>
                      ) : '—'}
                    </td>
                    <td className="p-4">
                      {isExecutive ? (
                        <select value={r.status} onChange={(e) => updateStatus(r.id, e.target.value)} className={`px-3 py-1 rounded-full text-xs border-0 ${getStatusColor(r.status)}`}>
                          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      ) : (
                        <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(r.status)}`}>{r.status}</span>
                      )}
                    </td>
                  </tr>
                ))}
                {visible.length === 0 && <tr><td colSpan={isExecutive ? 8 : 7} className="p-8 text-center text-[#555555] dark:text-gray-400">No reimbursements yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
  );
}
