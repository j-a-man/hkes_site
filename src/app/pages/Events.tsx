import { useMemo, useState } from 'react';
import { useLoaderData } from 'react-router';
import { Calendar, MapPin, Clock } from 'lucide-react';
import Reveal from '../components/Reveal';
import type { EventRow } from '../lib/queries';

interface LoaderData {
  content: Record<string, Record<string, any>>;
  events: EventRow[];
}

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function Events() {
  const { content, events } = useLoaderData() as LoaderData;
  const hero = content.hero ?? {};
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = useMemo(() => ['All', ...Array.from(new Set(events.map((e) => e.category)))], [events]);

  const filteredEvents = activeFilter === 'All' ? events : events.filter((event) => event.category === activeFilter);

  return (
    <div>
      <section className="bg-gradient-to-r from-[#DE2910] to-[#FF6B6B] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl text-white mb-4">{hero.heading}</h1>
          <p className="text-white/90">
            <a href="/" className="hover:underline">Home</a> / Events
          </p>
        </div>
      </section>

      <section className="py-12 bg-white dark:bg-[#1a1b1e]">
        <Reveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2 rounded-full transition-colors ${
                  activeFilter === filter
                    ? 'bg-[#DE2910] text-white'
                    : 'bg-gray-100 dark:bg-white/5 text-[#1A1A1A] hover:bg-gray-200 dark:bg-white/10'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredEvents.map((event) => (
              <div key={event.id} className={`bg-white dark:bg-[#1a1b1e] rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow ${
                event.status === 'past' ? 'opacity-75' : ''
              }`}>
                <div className="relative">
                  {event.image_url && <img src={event.image_url} alt={event.name} className="w-full h-64 object-cover" />}
                  {event.status === 'upcoming' && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                      Upcoming
                    </div>
                  )}
                  <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs ${
                    event.category === 'Cultural' ? 'bg-[#DE2910] text-white' :
                    event.category === 'Social' ? 'bg-[#FF6B6B] text-white' :
                    event.category === 'Fundraiser' ? 'bg-[#D4A843] text-white' :
                    'bg-purple-600 text-white'
                  }`}>
                    {event.category}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-2xl mb-4">{event.name}</h3>

                  <div className="space-y-2 mb-4 text-[#555555]">
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-3 text-[#DE2910]" />
                      {formatDate(event.event_date)}
                    </div>
                    {event.event_time && (
                      <div className="flex items-center">
                        <Clock size={16} className="mr-3 text-[#DE2910]" />
                        {event.event_time}
                      </div>
                    )}
                    {event.location && (
                      <div className="flex items-center">
                        <MapPin size={16} className="mr-3 text-[#DE2910]" />
                        {event.location}
                      </div>
                    )}
                  </div>

                  <p className="text-[#555555] mb-4">{event.description}</p>

                  <button className="bg-[#DE2910] text-white px-6 py-2 rounded-lg hover:bg-[#C32410] transition-colors">
                    Learn More
                  </button>
                </div>
              </div>
            ))}
            {filteredEvents.length === 0 && (
              <p className="col-span-2 text-center text-[#555555] py-12">No events in this category yet.</p>
            )}
          </div>
        </Reveal>
      </section>
    </div>
  );
}
