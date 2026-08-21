import { useLoaderData } from 'react-router';
import { Mail, Instagram, MapPin } from 'lucide-react';
import Reveal from '../components/Reveal';

interface LoaderData {
  content: Record<string, Record<string, any>>;
}

export default function Contact() {
  const { content } = useLoaderData() as LoaderData;
  const hero = content.hero ?? {};
  const info = content.info ?? {};
  const cta = content.cta ?? {};

  return (
    <div>
      <section className="bg-gradient-to-r from-[#DE2910] to-[#FF6B6B] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl text-white mb-4">{hero.heading}</h1>
          <p className="text-white/90">{hero.subheading}</p>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-[#1a1b1e]">
        <Reveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl mb-6">Send us a message</h2>

              <form className="space-y-6">
                <div>
                  <label className="block mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DE2910]"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DE2910]"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="block mb-2">Subject</label>
                  <select className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DE2910]">
                    <option>General Inquiry</option>
                    <option>Event Question</option>
                    <option>Sponsorship</option>
                    <option>Join HKES</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2">Message</label>
                  <textarea
                    rows={6}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DE2910]"
                    placeholder="Tell us what's on your mind..."
                  />
                </div>

                <button className="bg-[#DE2910] text-white px-8 py-3 rounded-lg hover:bg-[#C32410] transition-colors w-full">
                  Send Message
                </button>
              </form>
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl mb-6">Contact Information</h2>

              <div className="bg-[#FFF8F6] rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#DE2910] rounded-full flex items-center justify-center flex-shrink-0">
                    <Instagram size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="mb-2">Instagram</h3>
                    <p className="text-[#555555]">{info.instagram_handle}</p>
                    <a href="#" className="text-[#DE2910] hover:underline text-sm">
                      Follow us →
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-[#FFF8F6] rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#DE2910] rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="mb-2">Email</h3>
                    <p className="text-[#555555]">{info.email}</p>
                    <a href={`mailto:${info.email}`} className="text-[#DE2910] hover:underline text-sm">
                      Send email →
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-[#FFF8F6] rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#DE2910] rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="mb-2">Location</h3>
                    <p className="text-[#555555]">{info.location_name}</p>
                    <p className="text-[#555555] text-sm">{info.location_address}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#DE2910] to-[#FF6B6B] rounded-2xl p-8 text-white mt-8">
                <h3 className="text-white text-2xl mb-3">{cta.heading}</h3>
                <p className="text-white/90 mb-6">
                  {cta.body}
                </p>
                <button className="bg-white dark:bg-[#1a1b1e] text-[#DE2910] px-6 py-3 rounded-lg hover:bg-gray-100 dark:bg-white/5 transition-colors">
                  {cta.button_text}
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
