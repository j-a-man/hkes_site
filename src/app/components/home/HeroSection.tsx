import { Link } from 'react-router';
import { motion, useReducedMotion } from 'motion/react';
import { Instagram, Linkedin } from 'lucide-react';
import TikTokIcon from '../icons/TikTokIcon';

interface HeroSectionProps {
  content: Record<string, any>;
  social: Record<string, any>;
}

export default function HeroSection({ content, social }: HeroSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  const socialLinks = [
    { name: 'Instagram', href: social.instagram_url || '#', icon: Instagram },
    { name: 'TikTok', href: social.tiktok_url || '#', icon: TikTokIcon },
    { name: 'LinkedIn', href: social.linkedin_url || '#', icon: Linkedin },
  ];

  const blobAnimation = (delay: number) =>
    shouldReduceMotion
      ? {}
      : {
          animate: {
            x: [0, 24, -16, 0],
            y: [0, -18, 12, 0],
            scale: [1, 1.06, 0.96, 1],
          },
          transition: { duration: 16, repeat: Infinity, ease: 'easeInOut' as const, delay },
        };

  const floatAnimation = (duration: number, delay = 0) =>
    shouldReduceMotion
      ? {}
      : {
          animate: { y: [0, -14, 0] },
          transition: { duration, repeat: Infinity, ease: 'easeInOut' as const, delay },
        };

  return (
    <section className="relative min-h-[calc(100vh-6rem)] flex items-center justify-center pt-10 pb-20 overflow-hidden">

      {/* Animated Background Blobs */}
      <motion.div
        className="absolute top-[-5%] right-[-5%] w-[40vw] h-[40vw] bg-gradient-to-br from-[#ffbba1] to-[#fa4e5b] rounded-[40%_60%_70%_30%/40%_50%_60%_50%] opacity-90 blur-[2px] -z-10"
        {...blobAnimation(0)}
      />
      <motion.div
        className="absolute top-[20%] right-[10%] w-[15vw] h-[15vw] bg-[#fa4e5b] rounded-full opacity-90 -z-10"
        {...blobAnimation(1.2)}
      />
      <motion.div
        className="absolute bottom-[-10%] right-[5%] w-[45vw] h-[45vw] bg-gradient-to-tr from-[#ff7a65] to-[#fa4e5b] rounded-full opacity-90 -z-10"
        {...blobAnimation(0.6)}
      />
      <motion.div
        className="absolute top-[5%] left-[5%] w-[10vw] h-[10vw] bg-gradient-to-tr from-[#ff7a65] to-[#ffbba1] rounded-full opacity-80 blur-md -z-10"
        {...blobAnimation(2)}
      />

      {/* Watermark logo, faint, within the color blobs on the right */}
      <img
        src={content.watermark_logo_url || '/merchlogodesigns.png'}
        alt=""
        aria-hidden="true"
        className="hidden lg:block absolute top-1/2 right-0 -translate-y-1/2 w-[38vw] max-w-xl opacity-[0.16] -z-10 pointer-events-none select-none"
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Left Text Content */}
        <motion.div
          className="relative z-10 flex flex-col justify-center"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >

          <p className="text-[#fa4e5b] tracking-widest text-sm mb-4 font-bold uppercase">
            {content.eyebrow}
          </p>

          <h1 className="flex flex-col text-5xl sm:text-[70px] lg:text-[90px] leading-tight sm:leading-[0.9] tracking-tighter mb-6">
            <span className="font-black text-[#fa4e5b] drop-shadow-sm">{content.heading_line1}</span>
            <span
              className="font-light text-transparent mt-2 sm:mt-0"
              style={{ WebkitTextStroke: '2px #ffbba1' }}
            >
              {content.heading_line2}
            </span>
          </h1>

          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium mb-10 max-w-md leading-relaxed">
            {content.body}
          </p>

          <div className="flex flex-wrap items-center gap-6 mb-16">
            <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/events"
                className="inline-block bg-gradient-to-r from-[#ffbba1] to-[#fa4e5b] text-white font-bold tracking-wider text-sm px-8 py-4 rounded-full shadow-[0_8px_20px_rgba(250,78,91,0.4)] hover:shadow-[0_12px_25px_rgba(250,78,91,0.5)] transition-shadow"
              >
                {content.primary_button_text}
              </Link>
            </motion.div>

            <Link
              to="/about"
              className="text-gray-600 dark:text-gray-300 font-bold tracking-wider text-sm transition-colors hover:text-[#fa4e5b] underline underline-offset-4"
            >
              {content.secondary_button_text}
            </Link>
          </div>

          <div className="flex items-center gap-8 text-sm font-semibold text-gray-400 tracking-widest uppercase mt-auto pt-12">
            <span>Follow Us</span>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  whileHover={{ scale: 1.15 }}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ffbba1] to-[#fa4e5b] text-white flex items-center justify-center shadow-md"
                >
                  <social.icon size={14} />
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Animated Hong Kong Imagery */}
        <div className="relative z-10 hidden lg:flex justify-center items-center h-[600px] w-full max-w-lg ml-auto">

          {/* Center Large Image - Skyline */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-[26rem] z-20"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <motion.div
              className="w-full h-full bg-white dark:bg-[#1a1b1e]/20 backdrop-blur-md p-3 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/60 group"
              whileHover={{ scale: 1.03 }}
              {...floatAnimation(6)}
            >
              <img
                src={content.image_skyline_url || '/IMG_0357.JPG'}
                alt="Hong Kong Skyline"
                className="w-full h-full object-cover rounded-[1.5rem] shadow-inner transition-transform duration-700 group-hover:scale-105"
                loading="eager"
              />
              <div className="absolute inset-0 rounded-[1.5rem] bg-gradient-to-t from-black/60 to-transparent flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white font-bold text-lg tracking-wider">{content.caption_big_little}</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Top Right Image - Neon Signs / Street */}
          <motion.div
            className="absolute top-8 -right-2 w-44 h-52 z-30"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
          >
            <motion.div
              className="w-full h-full bg-white dark:bg-[#1a1b1e]/30 backdrop-blur-xl p-2 rounded-[1.5rem] shadow-[0_15px_40px_rgba(250,78,91,0.25)] border border-white/70 group"
              initial={{ rotate: 4 }}
              animate={{ rotate: 3 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              whileHover={{ rotate: 0, scale: 1.04 }}
              {...floatAnimation(7, 1)}
            >
              <img
                src={content.image_streets_url || '/IMG_2989.JPG'}
                alt="Hong Kong Streets"
                className="w-full h-full object-cover rounded-xl"
                loading="lazy"
              />
              <div className="absolute -bottom-3 -left-3 bg-[#fa4e5b] text-white text-[10px] font-bold uppercase tracking-widest py-1.5 px-3 rounded-full shadow-lg">
                {content.caption_culture}
              </div>
            </motion.div>
          </motion.div>

          {/* Bottom Left Image - Dim Sum / Food */}
          <motion.div
            className="absolute bottom-8 -left-6 w-48 h-44 z-30"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            <motion.div
              className="w-full h-full bg-white dark:bg-[#1a1b1e]/30 backdrop-blur-xl p-2 rounded-[1.5rem] shadow-[0_15px_40px_rgba(250,78,91,0.25)] border border-white/70 group"
              initial={{ rotate: -4 }}
              animate={{ rotate: -3 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              whileHover={{ rotate: 0, scale: 1.04 }}
              {...floatAnimation(8, 2)}
            >
              <img
                src={content.image_dimsum_url || '/IMG_2727.JPG'}
                alt="Dim Sum"
                className="w-full h-full object-cover rounded-xl"
                loading="lazy"
              />
              <div className="absolute -top-3 -right-3 bg-[#ff7a65] text-white text-[10px] font-bold uppercase tracking-widest py-1.5 px-3 rounded-full shadow-lg">
                {content.caption_people}
              </div>
            </motion.div>
          </motion.div>

          {/* Decorative accents */}
          <motion.div
            className="absolute top-1/4 -left-10 w-14 h-14 bg-gradient-to-tr from-[#ffbba1] to-[#fa4e5b] rounded-full opacity-80 blur-sm shadow-lg"
            {...floatAnimation(5, 0.5)}
          />
          <motion.div
            className="absolute bottom-1/4 -right-6 w-9 h-9 bg-[#ff7a65] rounded-full opacity-90 shadow-md"
            {...floatAnimation(4, 1.5)}
          />
        </div>
      </div>
    </section>
  );
}
