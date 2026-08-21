import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { fadeUp } from '../../lib/motion';

interface StatCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  gradient?: string;
}

export default function StatCard({ icon: Icon, value, label, gradient = 'from-[#ffbba1] to-[#fa4e5b]' }: StatCardProps) {
  return (
    <motion.div
      variants={fadeUp}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-[#1a1b1e] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/10 hover:shadow-md transition-shadow"
    >
      <div className={`w-11 h-11 mb-4 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
        <Icon size={20} className="text-white" />
      </div>
      <p className="text-3xl mb-1">{value}</p>
      <p className="text-[#555555] dark:text-gray-400 text-sm">{label}</p>
    </motion.div>
  );
}
