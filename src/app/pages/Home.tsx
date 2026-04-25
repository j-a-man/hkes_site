import { Link } from 'react-router';
import { Calendar, MapPin, Instagram, Twitter, Facebook, Heart, Activity, Droplets, Moon, Zap, User, Settings, Menu } from 'lucide-react';

export default function Home() {
  const upcomingEvents = [
    {
      id: 1,
      name: 'Lunar New Year Gala',
      date: 'Feb 10, 2026',
      location: 'Student Union Ballroom',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop'
    },
    {
      id: 2,
      name: 'Dragon Boat Festival',
      date: 'May 15, 2026',
      location: 'Recreation Park',
      image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&h=300&fit=crop'
    },
    {
      id: 3,
      name: 'Mid-Autumn Moon Festival',
      date: 'Sep 20, 2026',
      location: 'Campus Green',
      image: 'https://images.unsplash.com/photo-1569569970363-fa3c4ff2b7e0?w=400&h=300&fit=crop'
    }
  ];

  return (
    <div className="bg-white dark:bg-[#1a1b1e] overflow-hidden font-['Poppins']">
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-6rem)] flex items-center justify-center pt-10 pb-20">

        {/* Background Blobs matching image */}
        <div className="absolute top-[-5%] right-[-5%] w-[40vw] h-[40vw] bg-gradient-to-br from-[#ffbba1] to-[#fa4e5b] rounded-[40%_60%_70%_30%/40%_50%_60%_50%] opacity-90 blur-[2px] -z-10 animate-pulse-slow"></div>
        <div className="absolute top-[20%] right-[10%] w-[15vw] h-[15vw] bg-[#fa4e5b] rounded-full opacity-90 -z-10"></div>
        <div className="absolute bottom-[-10%] right-[5%] w-[45vw] h-[45vw] bg-gradient-to-tr from-[#ff7a65] to-[#fa4e5b] rounded-full opacity-90 -z-10"></div>
        <div className="absolute top-[5%] left-[5%] w-[10vw] h-[10vw] bg-gradient-to-tr from-[#ff7a65] to-[#ffbba1] rounded-full opacity-80 blur-md -z-10"></div>
        <div className="absolute top-1/2 left-1/3 w-6 h-6 bg-[#ff7a65] rounded-full opacity-70 -z-10"></div>
        <div className="absolute bottom-1/4 left-[40%] w-8 h-8 bg-[#fa4e5b] rounded-full opacity-60 -z-10"></div>

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left Text Content */}
          <div className="relative z-10 flex flex-col justify-center">

            <p className="text-[#fa4e5b] tracking-widest text-sm mb-4 font-bold uppercase">
              Binghamton University · Est. 2018
            </p>

            <h1 className="flex flex-col text-5xl sm:text-[70px] lg:text-[90px] leading-tight sm:leading-[0.9] tracking-tighter mb-6">
              <span className="font-black text-[#fa4e5b] drop-shadow-sm">Where Binghamton Meets</span>
              <span
                className="font-light text-transparent mt-2 sm:mt-0"
                style={{ WebkitTextStroke: '2px #ffbba1' }}
              >
                Hong Kong
              </span>
            </h1>

            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium mb-10 max-w-md leading-relaxed">
              HKES is a cultural and social student organization celebrating Hong Kong heritage, building community, and connecting students across cultures at Binghamton University.
            </p>

            <div className="flex flex-wrap items-center gap-6 mb-16">
              <Link
                to="/events"
                className="bg-gradient-to-r from-[#ffbba1] to-[#fa4e5b] text-white font-bold tracking-wider text-sm px-8 py-4 rounded-full shadow-[0_8px_20px_rgba(250,78,91,0.4)] hover:shadow-[0_12px_25px_rgba(250,78,91,0.5)] transition-all hover:-translate-y-1"
              >
                EXPLORE EVENTS
              </Link>

              <Link
                to="/about"
                className="text-gray-600 dark:text-gray-300 font-bold tracking-wider text-sm transition-colors hover:text-[#fa4e5b] underline underline-offset-4"
              >
                ABOUT US
              </Link>
            </div>

            <div className="flex items-center gap-8 text-sm font-semibold text-gray-400 tracking-widest uppercase mt-auto pt-12">
              <span>Follow Us</span>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ffbba1] to-[#fa4e5b] text-white flex items-center justify-center shadow-md cursor-pointer hover:scale-110 transition-transform">
                  <Instagram size={14} />
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ffbba1] to-[#fa4e5b] text-white flex items-center justify-center shadow-md cursor-pointer hover:scale-110 transition-transform">
                  <Twitter size={14} />
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ffbba1] to-[#fa4e5b] text-white flex items-center justify-center shadow-md cursor-pointer hover:scale-110 transition-transform">
                  <Facebook size={14} />
                </div>
              </div>
            </div>
          </div>

          {/* Right Animated Hong Kong Imagery */}
          <div className="relative z-10 hidden lg:flex justify-end items-center right-0 h-[600px] w-full max-w-lg ml-auto perspective-[1000px]">

            {/* Center Large Image - Skyline */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-[26rem] bg-white dark:bg-[#1a1b1e]/20 backdrop-blur-md p-3 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/50 z-20 animate-[float_6s_ease-in-out_infinite] group">
              <img
                src="/IMG_0357.JPG"
                alt="Hong Kong Skyline"
                className="w-full h-full object-cover rounded-[1.5rem] shadow-inner transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 rounded-[1.5rem] bg-gradient-to-t from-black/60 to-transparent flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white font-bold text-lg tracking-wider">Big Little</span>
              </div>
            </div>

            {/* Top Right Image - Neon Signs / Street */}
            <div className="absolute top-10 -right-4 w-48 h-56 bg-white dark:bg-[#1a1b1e]/30 backdrop-blur-xl p-2 rounded-[1.5rem] shadow-[0_15px_40px_rgba(250,78,91,0.2)] border border-white/60 z-30 animate-[float_8s_ease-in-out_1s_infinite] group rotate-6 hover:rotate-0 transition-transform duration-500">
              <img
                src="/IMG_2989.JPG"
                alt="Hong Kong Streets"
                className="w-full h-full object-cover rounded-xl"
              />
              <div className="absolute -bottom-4 -left-4 bg-[#fa4e5b] text-white text-[10px] font-bold uppercase tracking-widest py-1.5 px-3 rounded-full shadow-lg">
                Culture
              </div>
            </div>

            {/* Bottom Left Image - Dim Sum / Food */}
            <div className="absolute bottom-10 -left-8 w-56 h-48 bg-white dark:bg-[#1a1b1e]/30 backdrop-blur-xl p-2 rounded-[1.5rem] shadow-[0_15px_40px_rgba(250,78,91,0.2)] border border-white/60 z-30 animate-[float_7s_ease-in-out_2.5s_infinite] group -rotate-6 hover:rotate-0 transition-transform duration-500">
              <img
                src="/IMG_2727.JPG"
                alt="Dim Sum"
                className="w-full h-full object-cover rounded-xl"
              />
              <div className="absolute -top-4 -right-4 bg-[#ff7a65] text-white text-[10px] font-bold uppercase tracking-widest py-1.5 px-3 rounded-full shadow-lg">
                People
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-1/4 -left-12 w-16 h-16 bg-gradient-to-tr from-[#ffbba1] to-[#fa4e5b] rounded-full opacity-80 blur-sm animate-[float_5s_ease-in-out_0.5s_infinite] shadow-lg"></div>
            <div className="absolute bottom-1/4 -right-8 w-10 h-10 bg-[#ff7a65] rounded-full opacity-90 animate-[float_4s_ease-in-out_1.5s_infinite] shadow-md"></div>
          </div>
        </div>
      </section>

      {/* Rest of the original sections, updated to use theme colors and soften look */}
      <section className="py-20 bg-muted/30 dark:bg-black/20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-gray-800 dark:text-white">
            <div className="bg-white dark:bg-[#1a1b1e] p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-white/10 hover:shadow-md transition-shadow">
              <p className="text-4xl text-primary font-bold mb-2">500</p>
              <p className="text-muted-foreground text-sm tracking-wide font-medium uppercase">Members</p>
            </div>
            <div className="bg-white dark:bg-[#1a1b1e] p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-white/10 hover:shadow-md transition-shadow">
              <p className="text-4xl text-primary font-bold mb-2">20+</p>
              <p className="text-muted-foreground text-sm tracking-wide font-medium uppercase">Events</p>
            </div>
            <div className="bg-white dark:bg-[#1a1b1e] p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-white/10 hover:shadow-md transition-shadow">
              <p className="text-4xl text-primary font-bold mb-2">3</p>
              <p className="text-muted-foreground text-sm tracking-wide font-medium uppercase">Years Strong</p>
            </div>
            <div className="bg-white dark:bg-[#1a1b1e] p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-white/10 hover:shadow-md transition-shadow">
              <p className="text-4xl text-primary font-bold mb-2">$10K+</p>
              <p className="text-muted-foreground text-sm tracking-wide font-medium uppercase">Raised</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
