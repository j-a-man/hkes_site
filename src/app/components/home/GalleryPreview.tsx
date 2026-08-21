import { Link } from 'react-router';
import { motion } from 'motion/react';
import Masonry from 'react-responsive-masonry';
import Reveal from '../Reveal';
import type { GalleryPhotoRow } from '../../lib/queries';

interface GalleryPreviewProps {
  content: Record<string, any>;
  photos: GalleryPhotoRow[];
}

function formatDate(iso: string | null) {
  if (!iso) return '';
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function GalleryPreview({ content, photos }: GalleryPreviewProps) {
  return (
    <section className="py-20 bg-[#FFF8F6] dark:bg-white/5">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <Reveal className="text-center mb-14">
          <p className="text-[#fa4e5b] tracking-widest text-sm mb-3 font-bold uppercase">{content.eyebrow}</p>
          <h2 className="text-3xl sm:text-4xl mb-4">{content.heading}</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            {content.subheading}
          </p>
        </Reveal>

        <Reveal>
          <Masonry columnsCount={3} gutter="16px">
            {photos.map((photo) => (
              <motion.div
                key={photo.id}
                whileHover="hover"
                initial="rest"
                animate="rest"
                className="group relative rounded-2xl overflow-hidden cursor-pointer"
              >
                <motion.img
                  src={photo.url}
                  alt={photo.event_name}
                  className="w-full h-auto object-cover"
                  variants={{ rest: { scale: 1 }, hover: { scale: 1.08 } }}
                  transition={{ duration: 0.4 }}
                  loading="lazy"
                />
                <motion.div
                  className="absolute inset-0 bg-[#DE2910] flex flex-col justify-end p-4"
                  variants={{ rest: { opacity: 0 }, hover: { opacity: 0.85 } }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-white font-bold">{photo.event_name}</p>
                  <p className="text-white/80 text-sm">{formatDate(photo.photo_date)}</p>
                </motion.div>
              </motion.div>
            ))}
          </Masonry>
        </Reveal>

        <Reveal className="text-center mt-12">
          <motion.div className="inline-block" whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/gallery"
              className="inline-block bg-gradient-to-r from-[#ffbba1] to-[#fa4e5b] text-white font-bold tracking-wider text-sm px-8 py-4 rounded-full shadow-[0_8px_20px_rgba(250,78,91,0.4)] hover:shadow-[0_12px_25px_rgba(250,78,91,0.5)] transition-shadow"
            >
              {content.button_text}
            </Link>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}
