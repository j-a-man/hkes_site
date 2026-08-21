import { useEffect, useState } from 'react';
import { Link, useLoaderData } from 'react-router';
import QRCode from 'qrcode';
import Reveal from '../../components/Reveal';
import { ArrowLeft, Copy, Download, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { QrCampaignRow, QrCampaignEntryRow } from '../../lib/queries';

interface LoaderData {
  campaign: QrCampaignRow | null;
  entries: QrCampaignEntryRow[];
}

export default function PortalQrCampaignDetail() {
  const { campaign, entries: initialEntries } = useLoaderData() as LoaderData;
  const [entries, setEntries] = useState(initialEntries);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const publicUrl = campaign ? `${window.location.origin}/qr/${campaign.slug}` : '';

  useEffect(() => {
    if (!campaign) return;
    QRCode.toDataURL(publicUrl, { width: 320, margin: 2 }).then(setQrDataUrl);
  }, [campaign?.slug]);

  if (!campaign) {
    return (
      <div>
        <Link to="/portal/qr-campaigns" className="inline-flex items-center gap-2 text-sm text-[#fa4e5b] font-semibold mb-6">
          <ArrowLeft size={16} /> Back to QR Campaigns
        </Link>
        <Reveal className="bg-white dark:bg-[#1a1b1e] rounded-2xl p-8 text-center text-[#555555] dark:text-gray-400 shadow-sm border border-gray-100 dark:border-white/10">
          Campaign not found.
        </Reveal>
      </div>
    );
  }

  const toggleVerified = async (entry: QrCampaignEntryRow) => {
    const verified = !entry.verified;
    setEntries((rows) => rows.map((r) => (r.id === entry.id ? { ...r, verified } : r)));
    await supabase
      .from('qr_campaign_entries')
      .update({ verified, verified_at: verified ? new Date().toISOString() : null })
      .eq('id', entry.id);
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
  };

  const downloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `${campaign.slug}-qr.png`;
    a.click();
  };

  const exportCsv = () => {
    const headers = ['Submitted At', ...campaign.questions.map((q) => q.label), 'Verified'];
    const rows = entries.map((e) => [
      new Date(e.created_at).toLocaleString(),
      ...campaign.questions.map((q) => String(e.answers[q.id] ?? '')),
      e.verified ? 'Yes' : 'No',
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${campaign.slug}-entries.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <Link to="/portal/qr-campaigns" className="inline-flex items-center gap-2 text-sm text-[#fa4e5b] font-semibold mb-6 hover:gap-3 transition-all">
        <ArrowLeft size={16} /> Back to QR Campaigns
      </Link>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl mb-2">{campaign.name}</h1>
          <p className="text-[#555555] dark:text-gray-400 break-all">{publicUrl}</p>
        </div>
        <span className={`text-xs font-semibold px-3 py-1.5 rounded-full w-fit ${campaign.active ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300' : 'bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-300'}`}>
          {campaign.active ? 'Active' : 'Paused'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Reveal className="bg-white dark:bg-[#1a1b1e] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/10 flex flex-col items-center text-center">
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="QR code" className="w-48 h-48 rounded-lg border border-border mb-4" />
          ) : (
            <div className="w-48 h-48 rounded-lg border border-border mb-4 flex items-center justify-center text-sm text-[#555555] dark:text-gray-400">Generating…</div>
          )}
          <div className="flex flex-wrap justify-center gap-2">
            <button onClick={copyLink} className="inline-flex items-center gap-2 border border-border rounded-lg px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-white/5">
              {copied ? <CheckCircle2 size={16} className="text-green-500" /> : <Copy size={16} />} {copied ? 'Copied' : 'Copy Link'}
            </button>
            <button onClick={downloadQr} className="inline-flex items-center gap-2 border border-border rounded-lg px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-white/5">
              <Download size={16} /> Download PNG
            </button>
          </div>
        </Reveal>

        <Reveal className="lg:col-span-2 bg-gradient-to-br from-[#fa4e5b] to-[#ff7a65] rounded-2xl p-6 text-white">
          <h2 className="text-xl mb-4">Campaign Summary</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-3xl font-bold">{entries.length}</p>
              <p className="text-sm text-white/85">Entries</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{entries.filter((e) => e.verified).length}</p>
              <p className="text-sm text-white/85">Verified</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{entries.length - entries.filter((e) => e.verified).length}</p>
              <p className="text-sm text-white/85">Unverified</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{campaign.questions.length}</p>
              <p className="text-sm text-white/85">Questions</p>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-white/20 text-sm text-white/85 leading-relaxed">
            Destination link: <a href={campaign.destination_url} target="_blank" rel="noopener noreferrer" className="underline break-all">{campaign.destination_url}</a>
          </div>
        </Reveal>
      </div>

      <Reveal className="bg-white dark:bg-[#1a1b1e] rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden">
        <div className="p-6 pb-0 flex justify-between items-center">
          <h2 className="text-2xl mb-4">Entries ({entries.length})</h2>
          <button onClick={exportCsv} className="inline-flex items-center gap-2 border border-border rounded-lg px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-white/5 mb-4">
            <Download size={16} /> Export CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px]">
            <thead className="bg-[#FFF8F6] dark:bg-white/5">
              <tr>
                <th className="text-left p-4">Submitted</th>
                {campaign.questions.map((q) => (
                  <th key={q.id} className="text-left p-4">{q.label}</th>
                ))}
                <th className="text-left p-4">Verified</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id} className="border-t border-border">
                  <td className="p-4 text-[#555555] dark:text-gray-400">{new Date(entry.created_at).toLocaleDateString()}</td>
                  {campaign.questions.map((q) => (
                    <td key={q.id} className="p-4">{q.type === 'checkbox' ? (entry.answers[q.id] ? 'Yes' : 'No') : String(entry.answers[q.id] ?? '—')}</td>
                  ))}
                  <td className="p-4">
                    <input type="checkbox" checked={entry.verified} onChange={() => toggleVerified(entry)} />
                  </td>
                </tr>
              ))}
              {entries.length === 0 && (
                <tr>
                  <td colSpan={campaign.questions.length + 2} className="p-8 text-center text-[#555555] dark:text-gray-400">
                    No entries yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Reveal>
    </div>
  );
}
