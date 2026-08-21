import { useLoaderData } from 'react-router';
import { TrendingUp, Heart, Users, type LucideIcon } from 'lucide-react';
import Reveal from '../components/Reveal';
import type { FundraiserRow } from '../lib/queries';

interface LoaderData {
  content: Record<string, Record<string, any>>;
  fundraisers: FundraiserRow[];
}

const REASON_ICONS: LucideIcon[] = [TrendingUp, Heart, Users];
const REASON_GRADIENTS = ['from-[#DE2910] to-[#FF6B6B]', 'from-[#FF6B6B] to-[#FF9A5C]', 'from-[#FF9A5C] to-[#D4A843]'];

export default function Fundraisers() {
  const { content, fundraisers } = useLoaderData() as LoaderData;
  const hero = content.hero ?? {};
  const why = content.why_we_fundraise ?? {};
  const reasons: { title: string; description: string }[] = why.items ?? [];

  const activeFundraiser = fundraisers.find((f) => f.status === 'active');
  const pastFundraisers = fundraisers.filter((f) => f.status === 'past');
  const percentage = activeFundraiser?.goal_amount
    ? (Number(activeFundraiser.raised_amount) / Number(activeFundraiser.goal_amount)) * 100
    : 0;

  return (
    <div>
      <section className="bg-gradient-to-r from-[#DE2910] to-[#FF6B6B] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl text-white mb-4">{hero.heading}</h1>
          <p className="text-white/90 max-w-2xl mx-auto">{hero.subheading}</p>
        </div>
      </section>

      {activeFundraiser && (
        <section className="py-20 bg-white dark:bg-[#1a1b1e]">
          <Reveal className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-[#FFF8F6] to-white rounded-3xl shadow-2xl p-8 md:p-12 border border-border">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl mb-2">{activeFundraiser.name}</h2>
                  <div className="flex items-center text-sm text-[#555555]">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full mr-3">Active</span>
                    {activeFundraiser.days_remaining != null && <span>{activeFundraiser.days_remaining} days remaining</span>}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-2xl">${Number(activeFundraiser.raised_amount).toLocaleString()}</span>
                  {activeFundraiser.goal_amount != null && (
                    <span className="text-[#555555]">of ${Number(activeFundraiser.goal_amount).toLocaleString()} goal</span>
                  )}
                </div>
                <div className="w-full h-4 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#DE2910] to-[#FF6B6B] transition-all duration-500"
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  ></div>
                </div>
                <p className="text-[#DE2910] text-sm mt-2">{percentage.toFixed(0)}% funded</p>
              </div>

              <p className="text-[#555555] mb-8">{activeFundraiser.description}</p>

              <button className="bg-[#DE2910] text-white px-8 py-4 rounded-lg hover:bg-[#C32410] transition-colors w-full md:w-auto">
                Donate / Support
              </button>
            </div>
          </Reveal>
        </section>
      )}

      <section className="py-20 bg-[#FFF8F6]">
        <Reveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl mb-12">Past Fundraisers</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pastFundraisers.map((fundraiser) => (
              <div key={fundraiser.id} className="bg-white dark:bg-[#1a1b1e] rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl mb-2">{fundraiser.name}</h3>
                <p className="text-[#DE2910] text-2xl mb-2">${Number(fundraiser.raised_amount).toLocaleString()}</p>
                <p className="text-sm text-[#555555] mb-4">{fundraiser.year}</p>
                <p className="text-[#555555] text-sm mb-4">{fundraiser.recap}</p>
                <a href="#" className="text-[#DE2910] hover:underline text-sm">
                  Read Recap →
                </a>
              </div>
            ))}
            {pastFundraisers.length === 0 && <p className="col-span-3 text-center text-[#555555]">No past fundraisers yet.</p>}
          </div>
        </Reveal>
      </section>

      <section className="py-20 bg-white dark:bg-[#1a1b1e]">
        <Reveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl mb-12 text-center">{why.heading}</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reasons.map((reason, i) => {
              const Icon = REASON_ICONS[i % REASON_ICONS.length];
              return (
                <div key={reason.title} className="text-center">
                  <div className={`w-20 h-20 bg-gradient-to-br ${REASON_GRADIENTS[i % REASON_GRADIENTS.length]} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Icon size={32} className="text-white" />
                  </div>
                  <h3 className="text-xl mb-3">{reason.title}</h3>
                  <p className="text-[#555555]">{reason.description}</p>
                </div>
              );
            })}
          </div>
        </Reveal>
      </section>
    </div>
  );
}
