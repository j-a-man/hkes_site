import * as Dialog from '@radix-ui/react-dialog';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { GalleryPhotoRow } from '../../lib/queries';
import { formatDate } from '../../lib/site';

interface LightboxProps {
  photos: GalleryPhotoRow[];
  index: number | null;
  onIndexChange: (index: number | null) => void;
}

const NAV_BUTTON =
  'grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-hk-ink shadow-lg transition-transform hover:scale-105 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-white';

export default function Lightbox({ photos, index, onIndexChange }: LightboxProps) {
  const photo = index != null ? photos[index] : undefined;
  const count = photos.length;
  const step = (delta: number) => index != null && onIndexChange((index + delta + count) % count);

  return (
    <Dialog.Root open={photo !== undefined} onOpenChange={(open) => !open && onIndexChange(null)}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[70] bg-hk-ink/90 backdrop-blur-sm" />
        <Dialog.Content
          aria-describedby={undefined}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') step(-1);
            if (e.key === 'ArrowRight') step(1);
          }}
          className="fixed inset-0 z-[71] flex flex-col items-center justify-center gap-6 p-4 focus:outline-none sm:p-10"
        >
          {photo && (
            <>
              <Dialog.Title className="sr-only">{photo.event_name}</Dialog.Title>
              <figure className="flex max-h-full max-w-full -rotate-1 flex-col bg-white p-3 shadow-2xl sm:p-4">
                <img src={photo.url} alt={photo.event_name} className="max-h-[70vh] min-h-0 w-auto max-w-full object-contain" />
                <figcaption className="mt-3 flex items-baseline justify-between gap-6 px-1 font-hand text-2xl font-semibold text-hk-ink">
                  <span>{photo.event_name}</span>
                  <span className="text-xl text-hk-ink-soft">{formatDate(photo.photo_date)}</span>
                </figcaption>
              </figure>
              <div className="flex items-center gap-5 text-white">
                {count > 1 && (
                  <button type="button" onClick={() => step(-1)} aria-label="Previous photo" className={NAV_BUTTON}>
                    <ChevronLeft size={22} />
                  </button>
                )}
                <p className="min-w-16 text-center text-sm font-semibold tabular-nums tracking-[0.12em]">
                  {index! + 1} / {count}
                </p>
                {count > 1 && (
                  <button type="button" onClick={() => step(1)} aria-label="Next photo" className={NAV_BUTTON}>
                    <ChevronRight size={22} />
                  </button>
                )}
              </div>
              <Dialog.Close aria-label="Close" className={`absolute right-4 top-4 sm:right-8 sm:top-8 ${NAV_BUTTON}`}>
                <X size={22} />
              </Dialog.Close>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
