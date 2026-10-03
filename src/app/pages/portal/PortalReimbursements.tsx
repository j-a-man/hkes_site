import { useState, type FormEvent } from 'react';
import { useLoaderData, useRevalidator } from 'react-router';
import { FileText, Send } from 'lucide-react';
import { toast } from 'sonner';
import FilterChips from '../../components/site/FilterChips';
import SiteButton from '../../components/site/SiteButton';
import { Segmented, TABLE } from '../../components/portal/Controls';
import { Field, FileDrop, FormError, INPUT } from '../../components/portal/Form';
import PageHeader from '../../components/portal/PageHeader';
import { Panel, PanelHeader } from '../../components/portal/Panel';
import QueueStats, { Tips } from '../../components/portal/QueueStats';
import { StatusPill, StatusSelect } from '../../components/portal/Status';
import { useAuth } from '../../lib/auth';
import { money, mutate } from '../../lib/portal';
import { formatDate } from '../../lib/site';
import { supabase } from '../../lib/supabase';
import { getSignedUrl, uploadFile } from '../../lib/uploads';
import type { ReimbursementRow } from '../../lib/queries';

interface LoaderData {
  reimbursements: ReimbursementRow[];
}

const CATEGORIES = ['Event Supplies', 'Food & Beverage', 'Marketing Materials', 'Transportation', 'Other'];
const PAYMENT_METHODS = ['Venmo', 'Zelle', 'Check'] as const;
const STATUS_OPTIONS = ['Pending', 'Approved', 'Paid', 'Rejected'] as const;

const EMPTY_FORM = {
  purchase_date: '',
  category: CATEGORIES[0],
  amount: '',
  vendor: '',
  description: '',
  event_name: '',
  payment_method: PAYMENT_METHODS[0] as string,
  payment_account: '',
};

const ACCOUNT_HINTS: Record<string, string> = {
  Venmo: '@your-venmo',
  Zelle: 'Phone number or email on Zelle',
  Check: 'Name to write the check to',
};

export default function PortalReimbursements() {
  const { reimbursements } = useLoaderData() as LoaderData;
  const revalidator = useRevalidator();
  const { profile, isExecutive } = useAuth();

  const [form, setForm] = useState(EMPTY_FORM);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('All');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      // Receipts live in a private bucket; store the path and mint signed links to view them.
      const receipt_url = file ? (await uploadFile('receipts', file, profile?.id ?? 'anon')).path : null;
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
      toast.success('Reimbursement submitted to the Treasurer');
      revalidator.revalidate();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  const viewReceipt = async (path: string) => {
    try {
      window.open(await getSignedUrl('receipts', path), '_blank', 'noopener,noreferrer');
    } catch {
      toast.error("Couldn't open that receipt. It may have been removed.");
    }
  };

  const updateStatus = async (id: string, status: string) => {
    if (await mutate(supabase.from('reimbursements').update({ status, reviewed_by: profile?.id }).eq('id', id), `Marked ${status.toLowerCase()}`)) {
      revalidator.revalidate();
    }
  };

  const visible = isExecutive ? reimbursements : reimbursements.filter((r) => r.requested_by === profile?.id);
  const shown = statusFilter === 'All' ? visible : visible.filter((r) => r.status === statusFilter);
  const total = (status: string) => visible.filter((r) => r.status === status).reduce((sum, r) => sum + Number(r.amount), 0);

  return (
    <>
      <PageHeader zh="報銷" title="Reimbursements" subtitle="Paid for something for HKES? Submit it here and track it until you're paid back." />

      <div className="grid items-start gap-6 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <PanelHeader title="New reimbursement" />
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Amount">
                <span className="relative block">
                  <span aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 font-semibold text-hk-ink-soft">
                    $
                  </span>
                  <input
                    required
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    min="0.01"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    className={`${INPUT} pl-8`}
                  />
                </span>
              </Field>
              <Field label="Purchase date">
                <input required type="date" value={form.purchase_date} onChange={(e) => setForm({ ...form, purchase_date: e.target.value })} className={INPUT} />
              </Field>
              <Field label="Vendor or store">
                <input required value={form.vendor} onChange={(e) => setForm({ ...form, vendor: e.target.value })} className={INPUT} />
              </Field>
              <Field label="Category">
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={INPUT}>
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="What was it for?">
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={INPUT} rows={2} />
            </Field>
            <Field label="Related event" hint="Optional">
              <input value={form.event_name} onChange={(e) => setForm({ ...form, event_name: e.target.value })} className={INPUT} placeholder="e.g. Lunar New Year Gala" />
            </Field>
            <FileDrop label="Receipt" accept="image/*,application/pdf" file={file} onFile={setFile} prompt="Drop a photo or PDF of the receipt" />
            <div>
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-hk-ink-soft">Pay me back with</span>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Segmented
                  label="Payment method"
                  value={form.payment_method}
                  onChange={(payment_method) => setForm({ ...form, payment_method })}
                  options={PAYMENT_METHODS.map((m) => ({ value: m, label: m }))}
                />
                <input
                  aria-label="Payment details"
                  value={form.payment_account}
                  onChange={(e) => setForm({ ...form, payment_account: e.target.value })}
                  className={`${INPUT} sm:flex-1`}
                  placeholder={ACCOUNT_HINTS[form.payment_method]}
                />
              </div>
            </div>
            {error && <FormError>{error}</FormError>}
            <SiteButton type="submit" disabled={submitting}>
              <Send size={16} aria-hidden="true" />
              {submitting ? 'Submitting…' : 'Submit reimbursement'}
            </SiteButton>
          </form>
        </Panel>

        <div className="space-y-6">
          <QueueStats
            title={isExecutive ? 'Everyone' : 'Yours'}
            stats={[
              { label: 'Paid back', value: money(total('Paid')) },
              { label: 'Waiting', value: money(total('Pending') + total('Approved')) },
              { label: 'Requests', value: visible.length },
            ]}
          />
          <Tips
            title="Before you submit"
            tips={['Submit within 2 weeks of the purchase.', 'Attach a clear photo or PDF of the receipt.', 'Double-check your payment handle.']}
          />
        </div>
      </div>

      <Panel flush className="mt-8">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <h2 className="font-display text-lg font-normal uppercase text-hk-ink">{isExecutive ? 'All reimbursements' : 'Your history'}</h2>
          <FilterChips label="Filter by status" options={['All', ...STATUS_OPTIONS]} value={statusFilter} onChange={setStatusFilter} />
        </div>
        <div className={TABLE.wrap}>
          <table className={`${TABLE.table} min-w-[820px]`}>
            <thead className={TABLE.head}>
              <tr>
                {isExecutive && <th className={TABLE.th}>Requester</th>}
                <th className={TABLE.th}>Purchase</th>
                <th className={`${TABLE.th} text-right`}>Amount</th>
                <th className={TABLE.th}>Pay via</th>
                <th className={TABLE.th}>Receipt</th>
                <th className={TABLE.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((r) => (
                <tr key={r.id} className={TABLE.tr}>
                  {isExecutive && <td className={`${TABLE.td} font-semibold`}>{r.profiles?.full_name ?? 'Unknown'}</td>}
                  <td className={`${TABLE.td} max-w-xs`}>
                    <p className="font-semibold">{r.vendor}</p>
                    <p className="mt-0.5 text-xs text-hk-ink-soft">
                      {formatDate(r.purchase_date)} · {r.category}
                      {r.event_name ? ` · ${r.event_name}` : ''}
                    </p>
                  </td>
                  <td className={`${TABLE.td} text-right font-display text-base tabular-nums`}>{money(r.amount)}</td>
                  <td className={TABLE.td}>
                    <p>{r.payment_method}</p>
                    {r.payment_account && <p className="mt-0.5 text-xs text-hk-ink-soft">{r.payment_account}</p>}
                  </td>
                  <td className={TABLE.td}>
                    {r.receipt_url ? (
                      <button type="button" onClick={() => viewReceipt(r.receipt_url!)} className="inline-flex items-center gap-1 font-semibold text-hk-red hover:underline">
                        <FileText size={14} aria-hidden="true" /> View
                      </button>
                    ) : (
                      <span className="text-hk-ink-soft">None</span>
                    )}
                  </td>
                  <td className={TABLE.td}>
                    {isExecutive ? (
                      <StatusSelect label={`Status of ${r.vendor} reimbursement`} value={r.status} options={STATUS_OPTIONS} onChange={(status) => updateStatus(r.id, status)} />
                    ) : (
                      <StatusPill status={r.status} />
                    )}
                  </td>
                </tr>
              ))}
              {shown.length === 0 && (
                <tr>
                  <td colSpan={isExecutive ? 6 : 5} className={TABLE.empty}>
                    {visible.length === 0 ? 'No reimbursements yet.' : 'Nothing with that status.'}
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
