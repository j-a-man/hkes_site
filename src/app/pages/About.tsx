import { useLoaderData } from 'react-router';
import { Link } from 'react-router';
import { Heart, Users, Sparkles, Globe, type LucideIcon } from 'lucide-react';
import Reveal from '../components/Reveal';

interface LoaderData {
  content: Record<string, Record<string, any>>;
}

const VALUE_ICONS: LucideIcon[] = [Heart, Users, Globe, Sparkles];

export default function About() {
  const { content } = useLoaderData() as LoaderData;
  const hero = content.hero ?? {};
  const whoWeAre = content.who_we_are ?? {};
  const whatWeValue = content.what_we_value ?? {};
  const getInvolved = content.get_involved ?? {};
  const values: { title: string; description: string }[] = whatWeValue.values ?? [];

  return (
    <div className="bg-white dark:bg-[#1a1b1e] min-h-screen">
      <section className="bg-gradient-to-r from-[#DE2910] to-[#FF6B6B] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl text-white mb-4">{hero.heading}</h1>
          <p className="text-white/90 max-w-2xl mx-auto">{hero.subheading}</p>
        </div>
      </section>

      <section className="py-16">
        <Reveal className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl mb-6">{whoWeAre.heading}</h2>
          <p className="text-[#555555] dark:text-gray-400 text-lg leading-relaxed">
            {whoWeAre.body}
          </p>
        </Reveal>
      </section>

      <section className="py-16 bg-[#FFF8F6] dark:bg-white/5">
        <Reveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl text-center mb-12">{whatWeValue.heading}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, i) => {
              const Icon = VALUE_ICONS[i % VALUE_ICONS.length];
              return (
                <div key={value.title} className="bg-white dark:bg-[#1a1b1e] rounded-2xl p-6 text-center shadow-sm">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#ffbba1] to-[#fa4e5b] flex items-center justify-center">
                    <Icon size={24} className="text-white" />
                  </div>
                  <h3 className="text-lg mb-2">{value.title}</h3>
                  <p className="text-sm text-[#555555] dark:text-gray-400 leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </Reveal>
      </section>

      <section className="py-20">
        <Reveal className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl mb-4">{getInvolved.heading}</h2>
          <p className="text-[#555555] dark:text-gray-400 mb-8 leading-relaxed">
            {getInvolved.body}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/events"
              className="bg-gradient-to-r from-[#ffbba1] to-[#fa4e5b] text-white font-bold tracking-wider text-sm px-8 py-4 rounded-full shadow-[0_8px_20px_rgba(250,78,91,0.4)] hover:shadow-[0_12px_25px_rgba(250,78,91,0.5)] transition-all hover:-translate-y-1"
            >
              {getInvolved.explore_button_text}
            </Link>
            <Link
              to="/contact"
              className="text-gray-600 dark:text-gray-300 font-bold tracking-wider text-sm transition-colors hover:text-[#fa4e5b] underline underline-offset-4"
            >
              {getInvolved.contact_button_text}
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
