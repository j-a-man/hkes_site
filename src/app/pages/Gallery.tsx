import { useState } from 'react';
import Masonry from 'react-responsive-masonry';

export default function Gallery() {
  const [activeYear, setActiveYear] = useState('2026');
  const [activeType, setActiveType] = useState('All');

  const years = ['2026', '2025', '2024', '2023'];
  const types = ['All', 'Cultural', 'Social', 'Fundraiser'];

  const photos = [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=600&fit=crop',
      event: 'Lunar New Year Gala',
      date: 'Feb 10, 2026',
      type: 'Cultural',
      year: '2026'
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&h=400&fit=crop',
      event: 'Dragon Boat Festival',
      date: 'May 15, 2025',
      type: 'Cultural',
      year: '2025'
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1569569970363-fa3c4ff2b7e0?w=400&h=500&fit=crop',
      event: 'Mid-Autumn Festival',
      date: 'Sep 20, 2025',
      type: 'Cultural',
      year: '2025'
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=600&fit=crop',
      event: 'Spring Mixer',
      date: 'Mar 15, 2025',
      type: 'Social',
      year: '2025'
    },
    {
      id: 5,
      url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=400&fit=crop',
      event: 'Charity Banquet',
      date: 'Apr 20, 2025',
      type: 'Fundraiser',
      year: '2025'
    },
    {
      id: 6,
      url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=400&h=500&fit=crop',
      event: 'Cultural Night',
      date: 'Oct 10, 2024',
      type: 'Cultural',
      year: '2024'
    },
    {
      id: 7,
      url: 'https://images.unsplash.com/photo-1582564286939-400a311013a2?w=400&h=600&fit=crop',
      event: 'Welcome Week',
      date: 'Aug 25, 2024',
      type: 'Social',
      year: '2024'
    },
    {
      id: 8,
      url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=400&fit=crop',
      event: 'Movie Night',
      date: 'Nov 5, 2024',
      type: 'Social',
      year: '2024'
    },
    {
      id: 9,
      url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=500&fit=crop',
      event: 'Language Workshop',
      date: 'Dec 1, 2024',
      type: 'Cultural',
      year: '2024'
    }
  ];

  const featuredRecaps = [
    {
      id: 1,
      title: 'Lunar New Year Gala 2025: A Night of Tradition',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
      excerpt: 'Over 300 students joined us for our biggest Lunar New Year celebration yet, featuring traditional lion dance, Cantopop performances, and authentic Hong Kong feast.',
      photoCount: 45,
      date: 'Feb 10, 2025'
    },
    {
      id: 2,
      title: 'Dragon Boat Festival: Racing and Cultural Heritage',
      image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&h=400&fit=crop',
      excerpt: 'Teams competed in traditional dragon boat racing followed by dumpling making workshops and cultural storytelling sessions.',
      photoCount: 32,
      date: 'May 15, 2025'
    }
  ];

  const filteredPhotos = photos.filter(photo => {
    const yearMatch = photo.year === activeYear;
    const typeMatch = activeType === 'All' || photo.type === activeType;
    return yearMatch && typeMatch;
  });

  return (
    <div>
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-3 gap-1 opacity-20">
          {photos.slice(0, 9).map((photo, idx) => (
            <img key={idx} src={photo.url} alt="" className="w-full h-full object-cover" />
          ))}
        </div>
        <div className="absolute inset-0 bg-[#DE2910] opacity-80"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl text-white mb-4">Memories & Recaps</h1>
        </div>
      </section>

      <section className="py-12 bg-white dark:bg-[#1a1b1e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 justify-center mb-8">
            <div className="flex gap-2">
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => setActiveYear(year)}
                  className={`px-6 py-2 rounded-full transition-colors ${
                    activeYear === year
                      ? 'bg-[#DE2910] text-white'
                      : 'bg-gray-100 dark:bg-white/5 text-[#1A1A1A] hover:bg-gray-200 dark:bg-white/10'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
            <div className="w-full md:w-auto"></div>
            <div className="flex gap-2">
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveType(type)}
                  className={`px-6 py-2 rounded-full transition-colors ${
                    activeType === type
                      ? 'bg-[#DE2910] text-white'
                      : 'bg-gray-100 dark:bg-white/5 text-[#1A1A1A] hover:bg-gray-200 dark:bg-white/10'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <Masonry columnsCount={3} gutter="16px">
            {filteredPhotos.map((photo) => (
              <div key={photo.id} className="relative group overflow-hidden rounded-2xl">
                <img src={photo.url} alt={photo.event} className="w-full transition-transform group-hover:scale-110" />
                <div className="absolute inset-0 bg-[#DE2910] opacity-0 group-hover:opacity-80 transition-opacity flex flex-col items-center justify-center p-4">
                  <p className="text-white text-lg mb-2">{photo.event}</p>
                  <p className="text-white/90 text-sm mb-4">{photo.date}</p>
                  <button className="bg-white dark:bg-[#1a1b1e] text-[#DE2910] px-4 py-2 rounded-lg text-sm">
                    View Recap
                  </button>
                </div>
              </div>
            ))}
          </Masonry>
        </div>
      </section>

      <section className="py-20 bg-[#FFF8F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl mb-12">Featured Event Recaps</h2>

          <div className="space-y-8">
            {featuredRecaps.map((recap) => (
              <div key={recap.id} className="bg-white dark:bg-[#1a1b1e] rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <img src={recap.image} alt={recap.title} className="w-full h-64 md:h-full object-cover" />
                  <div className="p-8 flex flex-col justify-center">
                    <h3 className="text-2xl mb-4">{recap.title}</h3>
                    <p className="text-[#555555] mb-4">{recap.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-[#555555] mb-6">
                      <span className="bg-[#DE2910] text-white px-3 py-1 rounded-full">
                        {recap.photoCount} photos
                      </span>
                      <span>{recap.date}</span>
                    </div>
                    <button className="bg-[#DE2910] text-white px-6 py-3 rounded-lg hover:bg-[#C32410] transition-colors w-full md:w-auto">
                      Read Full Recap
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
