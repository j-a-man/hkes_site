import { Sparkle } from './Doodles';
import MixedText from './MixedText';

interface MarqueeProps {
  items: string[];
  className?: string;
}

// A pasted-on paper strip of scrolling words. Purely decorative, so it is
// hidden from screen readers; the second copy makes the loop seamless.
export default function Marquee({ items, className = '' }: MarqueeProps) {
  if (items.length === 0) return null;

  const row = (
    <ul className="flex shrink-0 items-center">
      {items.map((item, i) => (
        <li key={i} className="flex items-center">
          <span className="whitespace-nowrap px-6 font-display text-lg uppercase sm:text-xl">
            <MixedText text={item} zhClassName="mr-1 text-[1.15em]" />
          </span>
          <Sparkle className="h-4 w-4 shrink-0 opacity-80" />
        </li>
      ))}
    </ul>
  );

  return (
    <div aria-hidden="true" className={`overflow-hidden py-3.5 ${className}`}>
      <div className="flex w-max animate-marquee" style={{ ['--marquee-duration' as string]: `${Math.max(24, items.length * 5)}s` }}>
        {row}
        {row}
      </div>
    </div>
  );
}
