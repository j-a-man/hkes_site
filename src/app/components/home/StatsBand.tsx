import { motion, useReducedMotion } from 'motion/react';
import { TornEdge } from '../site/Paper';
import { fadeUp, staggerContainer } from '../../lib/motion';

const TILTS = ['-rotate-6', 'rotate-3', '-rotate-2', 'rotate-6'];

// Dela Gothic is wide, so longer values step down to stay inside the sticker.
function valueSize(value: string) {
  if (value.length <= 3) return 'text-[2.6rem] lg:text-[3.1rem]';
  if (value.length === 4) return 'text-[2.1rem] lg:text-[2.5rem]';
  if (value.length === 5) return 'text-[1.75rem] lg:text-[2.1rem]';
  return 'text-[1.4rem] lg:text-[1.7rem]';
}

interface StatsBandProps {
  items: { value: string; label: string }[];
}

// Stats as the round price stickers slapped on HKES flyers.
export default function StatsBand({ items }: StatsBandProps) {
  const reduceMotion = useReducedMotion();
  if (items.length === 0) return null;

  return (
    <section aria-label="HKES by the numbers" className="paper-grain relative overflow-hidden bg-hk-red py-24 text-white [--grain-opacity:0.1] md:py-28">
      <TornEdge position="top" />
      <motion.ul
        className={`relative mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-12 px-5 sm:px-8 ${items.length >= 4 ? 'md:grid-cols-4' : 'md:grid-cols-3'}`}
        initial={reduceMotion ? undefined : 'hidden'}
        whileInView={reduceMotion ? undefined : 'visible'}
        viewport={{ once: true, margin: '-80px' }}
        variants={staggerContainer}
      >
        {items.map((stat, i) => (
          <motion.li key={`${stat.label}-${i}`} className="flex flex-col items-center text-center" variants={fadeUp} transition={{ duration: 0.5, ease: 'easeOut' }}>
            <div
              className={`relative grid aspect-square w-36 place-items-center rounded-full bg-hk-paper text-hk-red shadow-[5px_6px_0_0_var(--color-hk-red-deep)] lg:w-44 ${TILTS[i % TILTS.length]}`}
            >
              <span aria-hidden="true" className="absolute inset-2.5 rounded-full border-2 border-dashed border-hk-red/35" />
              <span className={`px-4 font-display leading-none ${valueSize(stat.value)}`}>{stat.value}</span>
            </div>
            <p className="mt-5 font-hand text-[1.7rem] font-semibold leading-none">{stat.label}</p>
          </motion.li>
        ))}
      </motion.ul>
      <TornEdge position="bottom" />
    </section>
  );
}
