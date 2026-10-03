import { useState, type FormEvent, type ReactNode } from 'react';
import { useLoaderData } from 'react-router';
import { PlacardFrame, PlacardLabel } from '../components/site/Placard';
import SiteButton from '../components/site/SiteButton';
import Stamp from '../components/site/Stamp';
import { supabase } from '../lib/supabase';
import type { QrCampaignRow } from '../lib/queries';
import { safeUrl } from '../lib/site';

interface LoaderData {
  campaign: QrCampaignRow | null;
}

const FIELD =
  'mt-2 w-full border-0 border-b-2 border-hk-ink/20 bg-transparent px-0 py-2 text-base text-hk-ink transition-colors focus:border-hk-red focus:outline-none focus:ring-0';
const LABEL = 'block text-xs font-semibold uppercase tracking-[0.16em] text-hk-ink-soft';

function Page({ children }: { children: ReactNode }) {
  return (
    <main className="paper-grain relative flex min-h-screen items-center justify-center overflow-hidden bg-hk-red px-4 py-14 font-['Poppins'] text-hk-ink [--grain-opacity:0.1]">
      <span
        lang="zh-HK"
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[0.2em] -right-[0.05em] select-none font-zh text-[clamp(10rem,34vw,26rem)] leading-none text-hk-red-deep/35"
      >
        抽獎
      </span>
      <div className="relative w-full max-w-md">{children}</div>
    </main>
  );
}

export default function QrEntry() {
  const { campaign } = useLoaderData() as LoaderData;
  const [answers, setAnswers] = useState<Record<string, string | boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!campaign) {
    return (
      <Page>
        <PlacardFrame className="-rotate-1">
          <PlacardLabel zh="冇呢個站" en="Link not active" />
          <h1 className="mt-4 font-marker text-[2.4rem] leading-none text-hk-red">This link isn't active</h1>
          <p className="mt-4 leading-relaxed text-hk-ink-soft">The QR code or link you followed doesn't point to an active giveaway right now.</p>
          <div className="mt-7">
            <SiteButton to="/" size="sm">
              Back home
            </SiteButton>
          </div>
        </PlacardFrame>
      </Page>
    );
  }

  const setAnswer = (id: string, value: string | boolean) => setAnswers((a) => ({ ...a, [id]: value }));
  // Only send people on to real web links, never a stored `javascript:` URL.
  const destination = safeUrl(campaign.destination_url);

  const handleSubmit = async (e: FormEvent) => {
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
      if (destination) {
        window.location.href = destination;
      } else {
        setSubmitted(true);
        setSubmitting(false);
      }
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Page>
        <PlacardFrame className="-rotate-1">
          <PlacardLabel zh="多謝" en="Thank you" />
          <h1 className="mt-4 font-marker text-[2.4rem] leading-none text-hk-red">You're entered!</h1>
          <p className="mt-4 leading-relaxed text-hk-ink-soft">Good luck, and see you at the next HKES event.</p>
          <div className="mt-7">
            <SiteButton to="/" size="sm">
              Visit HKES
            </SiteButton>
          </div>
        </PlacardFrame>
      </Page>
    );
  }

  return (
    <Page>
      <PlacardFrame>
        <Stamp size={64} className="mx-auto -rotate-6 text-hk-red" label="HKES seal" />
        <div className="mt-5 flex justify-center">
          <PlacardLabel zh="抽獎" en="Giveaway entry" />
        </div>
        <h1 className="mt-3 text-center font-marker text-[2.1rem] leading-[1.1] text-hk-red">{campaign.name}</h1>
        <p className="mt-3 text-center text-sm leading-relaxed text-hk-ink-soft">Fill this out to enter. You'll be sent on after submitting.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {campaign.questions.map((q) => (
            <div key={q.id}>
              {q.type === 'checkbox' ? (
                <label className="flex items-start gap-3 text-sm text-hk-ink">
                  <input
                    type="checkbox"
                    required={q.required}
                    checked={Boolean(answers[q.id])}
                    onChange={(e) => setAnswer(q.id, e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-hk-red"
                  />
                  <span>{q.label}</span>
                </label>
              ) : q.type === 'select' ? (
                <label className={LABEL}>
                  {q.label}
                  <select
                    required={q.required}
                    value={(answers[q.id] as string) ?? ''}
                    onChange={(e) => setAnswer(q.id, e.target.value)}
                    className={`${FIELD} cursor-pointer`}
                  >
                    <option value="" disabled>
                      Select an option
                    </option>
                    {(q.options ?? []).map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </label>
              ) : (
                <label className={LABEL}>
                  {q.label}
                  <input
                    type={q.type === 'email' ? 'email' : q.type === 'phone' ? 'tel' : 'text'}
                    autoComplete={q.type === 'email' ? 'email' : q.type === 'phone' ? 'tel' : undefined}
                    required={q.required}
                    value={(answers[q.id] as string) ?? ''}
                    onChange={(e) => setAnswer(q.id, e.target.value)}
                    className={FIELD}
                  />
                </label>
              )}
            </div>
          ))}

          {error && (
            <p role="alert" className="text-sm font-medium text-hk-red-deep">
              {error}
            </p>
          )}

          <SiteButton type="submit" disabled={submitting} className="w-full">
            {submitting ? 'Submitting…' : 'Enter the giveaway'}
          </SiteButton>
        </form>
      </PlacardFrame>
    </Page>
  );
}
