import { useState } from 'react';
import { Tape } from './Paper';
import Stamp from './Stamp';

interface StickerPhotoProps {
  src: string;
  alt: string;
  caption?: string;
  // Tailwind aspect utility for the photo itself; omit to keep the photo's own shape.
  aspect?: string;
  tape?: 'top' | 'corners' | 'none';
  tapeTone?: 'paper' | 'red';
  className?: string;
  imgClassName?: string;
  captionClassName?: string;
  loading?: 'eager' | 'lazy';
}

// A printed photo with a white border, taped onto the page, with an optional
// handwritten caption underneath like a polaroid.
export default function StickerPhoto({
  src,
  alt,
  caption,
  aspect = 'aspect-[4/5]',
  tape = 'top',
  tapeTone = 'paper',
  className = '',
  imgClassName = '',
  captionClassName = 'text-center',
  loading = 'lazy',
}: StickerPhotoProps) {
  // A dead image link shows a stamped blank print instead of a broken-image icon.
  const [failed, setFailed] = useState(false);

  return (
    <figure
      className={`relative bg-white p-2.5 shadow-[0_1px_2px_rgba(30,23,20,0.12),0_18px_32px_-16px_rgba(30,23,20,0.5)] sm:p-3 ${caption ? 'pb-3' : ''} ${className}`}
    >
      <div className={`overflow-hidden bg-hk-blush ${aspect} ${failed && !aspect ? 'aspect-[4/5]' : ''}`}>
        {failed ? (
          <div role="img" aria-label={alt} className="grid h-full w-full place-items-center">
            <Stamp size={72} className="rotate-[-8deg] text-hk-red/25" />
          </div>
        ) : (
          <img
            src={src}
            alt={alt}
            loading={loading}
            decoding="async"
            onError={() => setFailed(true)}
            className={`block h-full w-full object-cover ${imgClassName}`}
          />
        )}
      </div>
      {caption && (
        <figcaption className={`mt-2 line-clamp-2 px-1 font-hand text-[1.35rem] font-semibold leading-tight text-hk-ink ${captionClassName}`}>{caption}</figcaption>
      )}
      {tape === 'top' && <Tape tone={tapeTone} className="-top-3.5 left-1/2 -translate-x-1/2 -rotate-3" />}
      {tape === 'corners' && (
        <>
          <Tape tone={tapeTone} className="-left-6 -top-1 w-20 -rotate-[38deg]" />
          <Tape tone={tapeTone} className="-right-6 -top-1 w-20 rotate-[38deg]" />
        </>
      )}
    </figure>
  );
}
