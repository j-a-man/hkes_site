import { motion, useReducedMotion } from 'motion/react';
import { staggerContainer, fadeUp } from '../../lib/motion';
import { getAvatarColor, getRoleBadgeColor, initials } from '../../lib/roleColors';
import Reveal from '../Reveal';
import type { Profile } from '../../lib/auth';

interface EboardSpotlightProps {
  content: Record<string, any>;
  eboard: Pick<Profile, 'id' | 'full_name' | 'title' | 'avatar_url'>[];
}

export default function EboardSpotlight({ content, eboard }: EboardSpotlightProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <Reveal className="text-center mb-14">
          <p className="text-[#fa4e5b] tracking-widest text-sm mb-3 font-bold uppercase">{content.eyebrow}</p>
          <h2 className="text-3xl sm:text-4xl mb-4">{content.heading}</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            {content.subheading}
          </p>
        </Reveal>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6"
          initial={shouldReduceMotion ? undefined : 'hidden'}
          whileInView={shouldReduceMotion ? undefined : 'visible'}
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
        >
          {eboard.map((member) => (
            <motion.div
              key={member.id}
              variants={fadeUp}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              whileHover={{ y: -6 }}
              className="bg-white dark:bg-[#1a1b1e] rounded-3xl p-6 text-center shadow-sm hover:shadow-lg transition-shadow border border-gray-100 dark:border-white/10"
            >
              {member.avatar_url ? (
                <img src={member.avatar_url} alt="" className="w-16 h-16 mx-auto mb-4 rounded-full object-cover" />
              ) : (
                <div className={`w-16 h-16 mx-auto mb-4 ${getAvatarColor(member.title)} rounded-full flex items-center justify-center text-white text-xl font-bold`}>
                  {initials(member.full_name)}
                </div>
              )}
              <h3 className="mb-2">{member.full_name}</h3>
              <span className={`inline-block px-3 py-1 rounded-full text-xs ${getRoleBadgeColor(member.title)}`}>
                {member.title}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
