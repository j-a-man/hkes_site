import { Link } from 'react-router';
import { motion, useReducedMotion } from 'motion/react';
import { Instagram, CalendarCheck, HeartHandshake, type LucideIcon } from 'lucide-react';
import { staggerContainer, fadeUp } from '../../lib/motion';
import Reveal from '../Reveal';

const ICONS: LucideIcon[] = [Instagram, CalendarCheck, HeartHandshake];

interface GetInvolvedSectionProps {
  content: Record<string, any>;
  social: Record<string, any>;
}

export default function GetInvolvedSection({ content, social }: GetInvolvedSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const steps: { title: string; description: string }[] = content.steps ?? [];

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <Reveal className="text-center mb-14">
          <p className="text-[#fa4e5b] tracking-widest text-sm mb-3 font-bold uppercase">{content.eyebrow}</p>
          <h2 className="text-3xl sm:text-4xl mb-4">{content.heading}</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            {content.subheading}
          </p>
        </Reveal>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          initial={shouldReduceMotion ? undefined : 'hidden'}
          whileInView={shouldReduceMotion ? undefined : 'visible'}
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
        >
          {steps.map((step, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <motion.div
                key={step.title}
                variants={fadeUp}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                whileHover={{ y: -6 }}
                className="relative bg-white dark:bg-[#1a1b1e] rounded-3xl p-8 shadow-sm hover:shadow-lg transition-shadow border border-gray-100 dark:border-white/10 text-center"
              >
                <div className="absolute -top-4 -left-4 w-9 h-9 rounded-full bg-[#1a1b1e] dark:bg-white text-white dark:text-[#1a1b1e] text-sm font-bold flex items-center justify-center shadow-md">
                  {i + 1}
                </div>
                <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-gradient-to-br from-[#ffbba1] to-[#fa4e5b] flex items-center justify-center">
                  <Icon size={26} className="text-white" />
                </div>
                <h3 className="text-xl mb-3">{step.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{step.description}</p>
              </motion.div>
            );
          })}
        </motion.div>

        <Reveal className="bg-gradient-to-r from-[#DE2910] to-[#FF6B6B] rounded-3xl px-8 py-12 text-center text-white">
          <h3 className="text-2xl sm:text-3xl text-white mb-3">{content.cta_heading}</h3>
          <p className="text-white/90 mb-8 max-w-lg mx-auto">
            {content.cta_body}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}>
              <a
                href={social.instagram_url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-[#DE2910] font-bold tracking-wider text-sm px-8 py-4 rounded-full shadow-md hover:shadow-lg transition-shadow"
              >
                {content.instagram_button_text}
              </a>
            </motion.div>
            <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/contact"
                className="inline-block border-2 border-white text-white font-bold tracking-wider text-sm px-8 py-4 rounded-full hover:bg-white/10 transition-colors"
              >
                {content.contact_button_text}
              </Link>
            </motion.div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
