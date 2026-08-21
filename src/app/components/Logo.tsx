interface LogoProps {
  size?: number;
  className?: string;
}

export default function Logo({ size = 48, className = '' }: LogoProps) {
  return (
    <div
      className={`flex-shrink-0 rounded-2xl bg-gradient-to-br from-[#fa4e5b] to-[#ff7a65] shadow-md flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src="/merchlogodesigns.png"
        alt="HKES Logo"
        className="w-[70%] h-[70%] object-contain drop-shadow-sm"
      />
    </div>
  );
}
