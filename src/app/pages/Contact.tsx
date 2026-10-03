import { useState, type FormEvent } from 'react';
import { useRouteLoaderData } from 'react-router';
import { Instagram, Mail, MapPin, Send, type LucideIcon } from 'lucide-react';
import CtaPoster from '../components/site/CtaPoster';
import { Squiggle } from '../components/site/Doodles';
import PosterHero from '../components/site/PosterHero';
import SiteButton from '../components/site/SiteButton';
import Stamp from '../components/site/Stamp';
import Reveal from '../components/Reveal';
import { sectionContent } from '../lib/siteContentManifest';
import { safeUrl, type ContentMap } from '../lib/site';

const TOPICS = ['General question', 'Events', 'Sponsorship', 'Joining HKES'];

const FIELD =
  'mt-2 w-full border-0 border-b-2 border-hk-ink/20 bg-transparent px-0 py-2 text-base text-hk-ink transition-colors placeholder:text-hk-ink-soft/70 focus:border-hk-red focus:outline-none focus:ring-0';
const LABEL = 'block text-xs font-semibold uppercase tracking-[0.16em] text-hk-ink-soft';

// No backend needed: the postcard opens the visitor's own email app with the
// message filled in and addressed to HKES.
function Postcard({ to }: { to: string }) {
  const [form, setForm] = useState({ name: '', email: '', topic: TOPICS[0], message: '' });
  const set = (key: keyof typeof form) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const subject = `[${form.topic}] Message from ${form.name}`;
    const body = `${form.message}\n\n${form.name}\n${form.email}`;
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <form onSubmit={handleSubmit} className="relative rounded-[10px] border border-hk-line bg-white p-6 shadow-[0_24px_40px_-28px_rgba(30,23,20,0.55)] sm:p-10">
      <div aria-hidden="true" className="absolute right-6 top-6 hidden rotate-3 sm:block">
        <div className="grid h-24 w-20 place-items-center bg-hk-red p-1.5 [mask:radial-gradient(circle_at_center,#000_62%,#0000_64%)_-4px_-4px/8px_8px_round,linear-gradient(#000_0_0)_4px_4px/calc(100%_-_8px)_calc(100%_-_8px)_no-repeat]">
          <div className="grid h-full w-full place-items-center border border-white/60">
            <Stamp size={52} className="text-white" />
          </div>
        </div>
        <div className="absolute -left-10 top-6 w-20 space-y-1.5 text-hk-ink/35">
          <Squiggle className="h-2.5 w-full" strokeWidth={2} />
          <Squiggle className="h-2.5 w-full" strokeWidth={2} />
          <Squiggle className="h-2.5 w-full" strokeWidth={2} />
        </div>
      </div>

      <p lang="zh-HK" className="font-zh text-2xl text-hk-red">
        寫信俾我哋
      </p>
      <h2 className="mt-1 font-marker text-[2.25rem] leading-tight text-hk-red sm:text-[2.6rem]">Send us a postcard</h2>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-hk-ink-soft sm:max-w-md">
        This opens your email app with your message ready to send to <span className="font-semibold text-hk-ink">{to}</span>.
      </p>

      <div className="mt-8 grid gap-7 sm:grid-cols-2">
        <label className={LABEL}>
          Your name
          <input required name="name" autoComplete="name" value={form.name} onChange={set('name')} className={FIELD} />
        </label>
        <label className={LABEL}>
          Your email
          <input required type="email" name="email" autoComplete="email" value={form.email} onChange={set('email')} className={FIELD} />
        </label>
        <label className={`${LABEL} sm:col-span-2`}>
          Topic
          <select name="topic" value={form.topic} onChange={set('topic')} className={`${FIELD} cursor-pointer`}>
            {TOPICS.map((topic) => (
              <option key={topic}>{topic}</option>
            ))}
          </select>
        </label>
        <label className={`${LABEL} sm:col-span-2`}>
          Message
          <textarea
            required
            name="message"
            rows={5}
            value={form.message}
            onChange={set('message')}
            className={`${FIELD} resize-y bg-[linear-gradient(transparent_calc(2rem-2px),var(--color-hk-line)_calc(2rem-2px))] bg-[length:100%_2rem] leading-8`}
          />
        </label>
      </div>

      <div className="mt-9">
        <SiteButton type="submit">
          <Send size={16} aria-hidden="true" />
          Open in my email app
        </SiteButton>
      </div>
    </form>
  );
}

function Channel({ icon: Icon, label, value, detail, href }: { icon: LucideIcon; label: string; value: string; detail?: string; href?: string }) {
  const content = (
    <>
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-hk-red text-white">
        <Icon size={20} aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-hk-ink-soft">{label}</span>
        <span className="mt-1 block break-words font-display text-lg leading-snug text-hk-ink">{value}</span>
        {detail && <span className="mt-1 block text-sm text-hk-ink-soft">{detail}</span>}
      </span>
    </>
  );
  const box = 'flex items-start gap-5 rounded-[22px] border border-hk-line bg-white p-6';
  return (
    <li>
      {href ? (
        <a
          href={href}
          target={href.startsWith('mailto:') ? undefined : '_blank'}
          rel="noopener noreferrer"
          className={`${box} transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_var(--color-hk-red)] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-hk-red`}
        >
          {content}
        </a>
      ) : (
        <div className={box}>{content}</div>
      )}
    </li>
  );
}

export default function Contact() {
  const root = useRouteLoaderData('root') as { globalContent: ContentMap; contactContent: ContentMap };
  const content = root.contactContent;
  const hero = sectionContent('contact', 'hero', content.hero);
  const info = sectionContent('contact', 'info', content.info);
  const cta = sectionContent('contact', 'cta', content.cta);
  const instagramUrl = safeUrl(root.globalContent.social?.instagram_url);

  return (
    <>
      <PosterHero zh="聯絡我們" eyebrow="Contact" title={hero.heading} subtitle={hero.subheading} />

      <section className="bg-hk-paper pb-28 pt-20 md:pt-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal className="grid gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <Postcard to={info.email} />
            </div>
            <ul className="space-y-5 lg:col-span-5">
              <Channel icon={Instagram} label="Instagram" value={info.instagram_handle} detail="DMs are open, say hi anytime." href={instagramUrl} />
              <Channel icon={Mail} label="Email" value={info.email} href={`mailto:${info.email}`} />
              <Channel icon={MapPin} label="Find us" value={info.location_name} detail={info.location_address} />
            </ul>
          </Reveal>

          <CtaPoster heading={cta.heading} body={cta.body} className="mt-24">
            {instagramUrl ? (
              <SiteButton href={instagramUrl} variant="white">
                <Instagram size={18} aria-hidden="true" />
                {cta.button_text}
              </SiteButton>
            ) : (
              <SiteButton to="/events" variant="white">
                See upcoming events
              </SiteButton>
            )}
          </CtaPoster>
        </div>
      </section>
    </>
  );
}
