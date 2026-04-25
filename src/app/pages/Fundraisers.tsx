import { TrendingUp, Heart, Users } from 'lucide-react';

export default function Fundraisers() {
  const activeFundraiser = {
    name: 'Spring 2026 Cultural Programming Fund',
    goal: 5000,
    raised: 3900,
    daysRemaining: 12,
    description: 'Help us bring authentic Hong Kong cultural experiences to Binghamton! This semester, we\'re planning to host traditional tea ceremonies, calligraphy workshops, and a special Cantopop concert. Your support helps us cover venue costs, materials, and bring in expert instructors.'
  };

  const pastFundraisers = [
    {
      id: 1,
      name: 'Lunar New Year Celebration Fund',
      year: '2025',
      raised: 4200,
      recap: 'Successfully funded our biggest Lunar New Year event yet, hosting 300+ attendees with authentic lion dance, traditional performances, and feast.'
    },
    {
      id: 2,
      name: 'Cultural Exchange Scholarship',
      year: '2024',
      raised: 3500,
      recap: 'Established scholarship fund to support HKES members participating in Hong Kong study abroad programs and cultural immersion trips.'
    },
    {
      id: 3,
      name: 'Community Kitchen Project',
      year: '2024',
      raised: 2800,
      recap: 'Equipped our community kitchen for regular dim sum and cooking workshops, now hosting monthly culinary cultural events.'
    }
  ];

  const percentage = (activeFundraiser.raised / activeFundraiser.goal) * 100;

  return (
    <div>
      <section className="bg-gradient-to-r from-[#DE2910] to-[#FF6B6B] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl text-white mb-4">Support HKES</h1>
          <p className="text-white/90 max-w-2xl mx-auto">
            Your contributions help us bring authentic Hong Kong cultural experiences, build community, and create lasting memories for our members.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-[#1a1b1e]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#FFF8F6] to-white rounded-3xl shadow-2xl p-8 md:p-12 border border-border">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl mb-2">{activeFundraiser.name}</h2>
                <div className="flex items-center text-sm text-[#555555]">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full mr-3">Active</span>
                  <span>{activeFundraiser.daysRemaining} days remaining</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-2xl">${activeFundraiser.raised.toLocaleString()}</span>
                <span className="text-[#555555]">of ${activeFundraiser.goal.toLocaleString()} goal</span>
              </div>
              <div className="w-full h-4 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#DE2910] to-[#FF6B6B] transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <p className="text-[#DE2910] text-sm mt-2">{percentage.toFixed(0)}% funded</p>
            </div>

            <p className="text-[#555555] mb-8">{activeFundraiser.description}</p>

            <button className="bg-[#DE2910] text-white px-8 py-4 rounded-lg hover:bg-[#C32410] transition-colors w-full md:w-auto">
              Donate / Support
            </button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#FFF8F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl mb-12">Past Fundraisers</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pastFundraisers.map((fundraiser) => (
              <div key={fundraiser.id} className="bg-white dark:bg-[#1a1b1e] rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl mb-2">{fundraiser.name}</h3>
                <p className="text-[#DE2910] text-2xl mb-2">${fundraiser.raised.toLocaleString()}</p>
                <p className="text-sm text-[#555555] mb-4">{fundraiser.year}</p>
                <p className="text-[#555555] text-sm mb-4">{fundraiser.recap}</p>
                <a href="#" className="text-[#DE2910] hover:underline text-sm">
                  Read Recap →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-[#1a1b1e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl mb-12 text-center">Why We Fundraise</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#DE2910] to-[#FF6B6B] rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp size={32} className="text-white" />
              </div>
              <h3 className="text-xl mb-3">Cultural Events</h3>
              <p className="text-[#555555]">
                Fund authentic cultural celebrations, performances, and traditional activities that connect members to Hong Kong heritage.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#FF6B6B] to-[#FF9A5C] rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart size={32} className="text-white" />
              </div>
              <h3 className="text-xl mb-3">Programming</h3>
              <p className="text-[#555555]">
                Support workshops, speakers, and educational initiatives that preserve and share Hong Kong culture with the community.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#FF9A5C] to-[#D4A843] rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={32} className="text-white" />
              </div>
              <h3 className="text-xl mb-3">Member Resources</h3>
              <p className="text-[#555555]">
                Provide scholarships, materials, and resources that help members engage deeply with their cultural identity and community.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
