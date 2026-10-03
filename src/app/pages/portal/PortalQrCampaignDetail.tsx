import { useEffect, useState } from 'react';
import { useLoaderData } from 'react-router';
import QRCode from 'qrcode';
import { Check, Copy, Download, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import FilterChips from '../../components/site/FilterChips';
import SiteButton from '../../components/site/SiteButton';
import Stamp from '../../components/site/Stamp';
import { Switch, TABLE } from '../../components/portal/Controls';
import PageHeader from '../../components/portal/PageHeader';
import { EmptyState, Panel, PanelHeader } from '../../components/portal/Panel';
import StatTile from '../../components/portal/StatTile';
import { StatusPill } from '../../components/portal/Status';
import { useAuth } from '../../lib/auth';
import { downloadCsv } from '../../lib/portal';
import { safeUrl } from '../../lib/site';
import { supabase } from '../../lib/supabase';
import type { QrCampaignEntryRow, QrCampaignRow } from '../../lib/queries';

interface LoaderData {
  campaign: QrCampaignRow | null;
  entries: QrCampaignEntryRow[];
}

const BACK = { to: '/portal/qr-campaigns', label: 'All campaigns' };

export default function PortalQrCampaignDetail() {
  const { campaign, entries: initialEntries } = useLoaderData() as LoaderData;
  const { profile } = useAuth();
  const [entries, setEntries] = useState(initialEntries);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [filter, setFilter] = useState('All');

  const publicUrl = campaign ? `${window.location.origin}/qr/${campaign.slug}` : '';

  useEffect(() => setEntries(initialEntries), [initialEntries]);

  useEffect(() => {
    if (!publicUrl) return;
    QRCode.toDataURL(publicUrl, { width: 640, margin: 2, color: { dark: '#1e1714', light: '#ffffff' } }).then(setQrDataUrl);
  }, [publicUrl]);

  if (!campaign) {
    return (
      <>
        <PageHeader zh="抽獎" title="Campaign not found" back={BACK} />
        <EmptyState>This campaign doesn't exist, or it was deleted.</EmptyState>
      </>
    );
  }

  const destination = safeUrl(campaign.destination_url);
  const verifiedCount = entries.filter((e) => e.verified).length;
  const shown = filter === 'Verified' ? entries.filter((e) => e.verified) : filter === 'To verify' ? entries.filter((e) => !e.verified) : entries;

  // Optimistic, with a rollback if the write is rejected.
  const setVerified = async (entry: QrCampaignEntryRow, verified: boolean) => {
    const patch = { verified, verified_by: verified ? (profile?.id ?? null) : null, verified_at: verified ? new Date().toISOString() : null };
    setEntries((rows) => rows.map((r) => (r.id === entry.id ? { ...r, ...patch } : r)));
    const { error } = await supabase.from('qr_campaign_entries').update(patch).eq('id', entry.id);
    if (error) {
      setEntries((rows) => rows.map((r) => (r.id === entry.id ? entry : r)));
      toast.error(error.message);
    }
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQr = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `${campaign.slug}-qr.png`;
    link.click();
  };

  const exportCsv = () => {
    downloadCsv(`${campaign.slug}-entries.csv`, [
      ['Submitted at', ...campaign.questions.map((q) => q.label), 'Verified'],
      ...entries.map((e) => [new Date(e.created_at).toLocaleString(), ...campaign.questions.map((q) => e.answers[q.id] ?? ''), e.verified ? 'Yes' : 'No']),
    ]);
  };

  const answer = (entry: QrCampaignEntryRow, id: string, type: string) => {
    const value = entry.answers[id];
    if (type === 'checkbox') return value ? 'Yes' : 'No';
    return value ? String(value) : <span className="text-hk-ink-soft">None</span>;
  };

  return (
    <>
      <PageHeader zh="抽獎" title={campaign.name} subtitle={publicUrl} back={BACK} action={<StatusPill status={campaign.active ? 'Active' : 'Paused'} />} />

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel className="flex flex-col items-center text-center">
          {/* QR codes need dark-on-white to scan, so this card stays white in dark mode. */}
          <div className="relative rounded-2xl bg-white p-3 ring-1 ring-hk-line">
            {qrDataUrl ? <img src={qrDataUrl} alt={`QR code for ${publicUrl}`} className="h-52 w-52" /> : <div className="grid h-52 w-52 place-items-center text-sm text-[#6b5e57]">Generating…</div>}
            <Stamp size={46} className="absolute -bottom-4 -right-4 rotate-12 text-hk-red" />
          </div>
          <div className="mt-7 flex flex-wrap justify-center gap-2">
            <SiteButton type="button" variant="outline-ink" size="sm" onClick={copyLink}>
              {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
              {copied ? 'Copied' : 'Copy link'}
            </SiteButton>
            <SiteButton type="button" size="sm" onClick={downloadQr} disabled={!qrDataUrl}>
              <Download size={14} aria-hidden="true" />
              Download PNG
            </SiteButton>
          </div>
        </Panel>

        <div className="space-y-6 lg:col-span-2">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatTile value={entries.length} label="Entries" />
            <StatTile value={verifiedCount} label="Verified" />
            <StatTile value={entries.length - verifiedCount} label="To verify" />
            <StatTile value={campaign.questions.length} label="Questions" />
          </div>
          <Panel>
            <PanelHeader title="After entering" />
            <p className="text-sm text-hk-ink-soft">People land on:</p>
            {destination ? (
              <a href={destination} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1.5 break-all font-semibold text-hk-red hover:underline">
                {campaign.destination_url} <ExternalLink size={14} aria-hidden="true" className="shrink-0" />
              </a>
            ) : (
              <p className="mt-1 font-semibold text-hk-red">
                This link isn't a valid web address, so entrants see a thank-you message instead. Edit the campaign to fix it.
              </p>
            )}
          </Panel>
        </div>
      </div>

      <Panel flush className="mt-8">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <h2 className="font-display text-lg font-normal uppercase text-hk-ink">Entries</h2>
          <div className="flex flex-wrap items-center gap-3">
            <FilterChips label="Filter entries" options={['All', 'To verify', 'Verified']} value={filter} onChange={setFilter} />
            <SiteButton type="button" variant="outline-ink" size="sm" onClick={exportCsv} disabled={entries.length === 0}>
              <Download size={14} aria-hidden="true" />
              Export CSV
            </SiteButton>
          </div>
        </div>
        <div className={TABLE.wrap}>
          <table className={`${TABLE.table} min-w-[560px]`}>
            <thead className={TABLE.head}>
              <tr>
                <th className={TABLE.th}>Submitted</th>
                {campaign.questions.map((q) => (
                  <th key={q.id} className={TABLE.th}>
                    {q.label}
                  </th>
                ))}
                <th className={TABLE.th}>Verified</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((entry) => (
                <tr key={entry.id} className={TABLE.tr}>
                  <td className={`${TABLE.td} whitespace-nowrap text-hk-ink-soft`}>
                    {new Date(entry.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                  </td>
                  {campaign.questions.map((q) => (
                    <td key={q.id} className={`${TABLE.td} break-all`}>
                      {answer(entry, q.id, q.type)}
                    </td>
                  ))}
                  <td className={TABLE.td}>
                    <Switch checked={entry.verified} onChange={(verified) => setVerified(entry, verified)} label="Verified" />
                  </td>
                </tr>
              ))}
              {shown.length === 0 && (
                <tr>
                  <td colSpan={campaign.questions.length + 2} className={TABLE.empty}>
                    {entries.length === 0 ? 'No entries yet.' : 'Nothing here.'}
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
