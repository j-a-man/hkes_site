import { useState } from 'react';
import { Link, useLoaderData } from 'react-router';
import Logo from '../components/Logo';
import { supabase } from '../lib/supabase';
import type { QrCampaignRow } from '../lib/queries';

interface LoaderData {
  campaign: QrCampaignRow | null;
}

export default function QrEntry() {
  const { campaign } = useLoaderData() as LoaderData;
  const [answers, setAnswers] = useState<Record<string, string | boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF8F6] dark:bg-[#101112] px-4">
        <div className="text-center max-w-md">
          <Logo size={56} className="mx-auto mb-6" />
          <h1 className="text-2xl mb-4">This link isn't active</h1>
          <p className="text-[#555555] dark:text-gray-400 mb-8 leading-relaxed">
            The QR code or link you followed doesn't point to an active giveaway right now.
          </p>
          <Link
            to="/"
            className="inline-block bg-gradient-to-r from-[#ffbba1] to-[#fa4e5b] text-white font-bold tracking-wider text-sm px-8 py-4 rounded-full shadow-md hover:-translate-y-1 transition-all"
          >
            BACK HOME
          </Link>
        </div>
      </div>
    );
  }

  const setAnswer = (id: string, value: string | boolean) => setAnswers((a) => ({ ...a, [id]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    for (const q of campaign.questions) {
      if (q.required && !answers[q.id]) {
        setError(`Please fill out "${q.label}".`);
        return;
      }
    }
    setSubmitting(true);
    setError(null);
    try {
      const { error: insertError } = await supabase.from('qr_campaign_entries').insert({
        campaign_id: campaign.id,
        answers,
      });
      if (insertError) throw insertError;
      window.location.href = campaign.destination_url;
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF8F6] dark:bg-[#101112] px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-[#1a1b1e] rounded-2xl shadow-lg border border-gray-100 dark:border-white/10 p-8">
        <Logo size={56} className="mx-auto mb-6" />
        <h1 className="text-2xl text-center mb-2">{campaign.name}</h1>
        <p className="text-center text-sm text-[#555555] dark:text-gray-400 mb-8">
          Fill this out to enter — you'll be redirected after submitting.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {campaign.questions.map((q) => (
            <div key={q.id}>
              {q.type === 'checkbox' ? (
                <label className="flex items-start gap-3 text-sm">
                  <input
                    type="checkbox"
                    required={q.required}
                    checked={Boolean(answers[q.id])}
                    onChange={(e) => setAnswer(q.id, e.target.checked)}
                    className="mt-1"
                  />
                  <span>{q.label}</span>
                </label>
              ) : q.type === 'select' ? (
                <div>
                  <label className="block mb-1 text-sm">{q.label}</label>
                  <select
                    required={q.required}
                    value={(answers[q.id] as string) ?? ''}
                    onChange={(e) => setAnswer(q.id, e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg"
                  >
                    <option value="" disabled>Select an option</option>
                    {(q.options ?? []).map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block mb-1 text-sm">{q.label}</label>
                  <input
                    type={q.type === 'email' ? 'email' : q.type === 'phone' ? 'tel' : 'text'}
                    required={q.required}
                    value={(answers[q.id] as string) ?? ''}
                    onChange={(e) => setAnswer(q.id, e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg"
                  />
                </div>
              )}
            </div>
          ))}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-[#fa4e5b] to-[#ff7a65] text-white px-6 py-3 rounded-lg shadow-md disabled:opacity-60"
          >
            {submitting ? 'Submitting…' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
