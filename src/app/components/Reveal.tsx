import { motion, useReducedMotion } from 'motion/react';
import { fadeUp } from '../lib/motion';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: 'div' | 'section';
}

export default function Reveal({ children, className = '', delay = 0, as = 'div' }: RevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const Component = motion[as];

  if (shouldReduceMotion) {
    const Fallback = as;
    return <Fallback className={className}>{children}</Fallback>;
  }

  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={fadeUp}
      transition={{ duration: 0.6, ease: 'easeOut', delay }}
    >
      {children}
    </Component>
  );
}
