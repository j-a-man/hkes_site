import { useState } from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';

export default function Events() {
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', 'Cultural', 'Social', 'Fundraiser', 'Workshop'];

  const events = [
    {
      id: 1,
      name: 'Lunar New Year Gala',
      category: 'Cultural',
      date: 'Feb 10, 2026',
      time: '6:00 PM',
      location: 'Student Union Ballroom',
      description: 'Celebrate the Year of the Horse with traditional performances, authentic Hong Kong cuisine, and lion dance.',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop',
      status: 'upcoming'
    },
    {
      id: 2,
      name: 'Dragon Boat Festival',
      category: 'Cultural',
      date: 'May 15, 2026',
      time: '2:00 PM',
      location: 'Recreation Park',
      description: 'Traditional dragon boat racing followed by dumpling making workshop and cultural activities.',
      image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&h=400&fit=crop',
      status: 'upcoming'
    },
    {
      id: 3,
      name: 'Mid-Autumn Moon Festival',
      category: 'Cultural',
      date: 'Sep 20, 2026',
      time: '7:00 PM',
      location: 'Campus Green',
      description: 'Evening gathering with mooncakes, lantern lighting, and traditional music performances.',
      image: 'https://images.unsplash.com/photo-1569569970363-fa3c4ff2b7e0?w=600&h=400&fit=crop',
      status: 'upcoming'
    },
    {
      id: 4,
      name: 'Hong Kong Movie Night',
      category: 'Social',
      date: 'Apr 30, 2026',
      time: '8:00 PM',
      location: 'Science 1 Auditorium',
      description: 'Screening of classic Hong Kong cinema with snacks and discussion afterwards.',
      image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&h=400&fit=crop',
      status: 'upcoming'
    },
    {
      id: 5,
      name: 'Cantonese Language Workshop',
      category: 'Workshop',
      date: 'May 1, 2026',
      time: '4:00 PM',
      location: 'Library North Room 210',
      description: 'Interactive Cantonese language learning session for beginners and intermediate speakers.',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop',
      status: 'upcoming'
    },
    {
      id: 6,
      name: 'Spring Semester Kickoff',
      category: 'Social',
      date: 'Mar 20, 2026',
      time: '5:00 PM',
      location: 'Student Union Marketplace',
      description: 'Welcome back party with games, food, and activities to start the semester.',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=400&fit=crop',
      status: 'past'
    }
  ];

  const filteredEvents = activeFilter === 'All'
    ? events
    : events.filter(event => event.category === activeFilter);

  return (
    <div>
      <section className="bg-gradient-to-r from-[#DE2910] to-[#FF6B6B] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl text-white mb-4">Events & Happenings</h1>
          <p className="text-white/90">
            <a href="/" className="hover:underline">Home</a> / Events
          </p>
        </div>
      </section>

      <section className="py-12 bg-white dark:bg-[#1a1b1e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  <img src={event.image} alt={event.name} className="w-full h-64 object-cover" />
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
                      {event.date}
                    </div>
                    <div className="flex items-center">
                      <Clock size={16} className="mr-3 text-[#DE2910]" />
                      {event.time}
                    </div>
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-3 text-[#DE2910]" />
                      {event.location}
                    </div>
                  </div>

                  <p className="text-[#555555] mb-4">{event.description}</p>

                  <button className="bg-[#DE2910] text-white px-6 py-2 rounded-lg hover:bg-[#C32410] transition-colors">
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
