import { motion, useReducedMotion } from 'motion/react';
import { Users, CalendarDays, Sparkles, HandCoins, type LucideIcon } from 'lucide-react';
import { staggerContainer, fadeUp } from '../../lib/motion';

const ICONS: LucideIcon[] = [Users, CalendarDays, Sparkles, HandCoins];

interface StatsSectionProps {
  content: { items?: { value: string; label: string }[] };
}

export default function StatsSection({ content }: StatsSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const stats = content.items ?? [];

  return (
    <section className="py-20 bg-muted/30 dark:bg-black/20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-gray-800 dark:text-white"
          initial={shouldReduceMotion ? undefined : 'hidden'}
          whileInView={shouldReduceMotion ? undefined : 'visible'}
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
        >
          {stats.map((stat, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                whileHover={{ y: -4 }}
                className="bg-white dark:bg-[#1a1b1e] p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-white/10 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#ffbba1] to-[#fa4e5b] flex items-center justify-center">
                  <Icon size={20} className="text-white" />
                </div>
                <p className="text-4xl text-primary font-bold mb-2">{stat.value}</p>
                <p className="text-muted-foreground text-sm tracking-wide font-medium uppercase">{stat.label}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
