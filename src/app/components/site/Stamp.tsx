const SEAL_URL = "url('/merchlogodesigns.png')";

interface StampProps {
  // Rendered size in px; the seal is square.
  size: number;
  // Text color utility; the seal is inked in `currentColor`.
  className?: string;
  label?: string;
}

// The HKES seal, inked in any color like a chop stamp. Uses the logo's alpha
// channel as a mask, so one asset covers red, white, and ink versions.
export default function Stamp({ size, className = '', label }: StampProps) {
  return (
    <span
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={`block shrink-0 bg-current ${className}`}
      style={{
        width: size,
        height: size,
        WebkitMaskImage: SEAL_URL,
        maskImage: SEAL_URL,
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
      }}
    />
  );
}
