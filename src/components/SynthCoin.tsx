// SynthCoin — AISynthArt's credit token
// Flat regular hexagon + exact Lucide Sparkles paths from the logo

interface SynthCoinProps {
  size?: number;
  className?: string;
}

export function SynthCoin({ size = 20, className = '' }: SynthCoinProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block flex-shrink-0 align-middle ${className}`}
    >
      <defs>
        <linearGradient id="hexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>

      {/* Regular flat-top hexagon — equal width & height */}
      <polygon
        points="12,1.5 20.66,6.25 20.66,17.75 12,22.5 3.34,17.75 3.34,6.25"
        fill="url(#hexGrad)"
      />

      {/* Exact Lucide Sparkles path, scaled to fit inside hex (scale 0.45, translate to center) */}
      <g transform="translate(12,12) scale(0.45) translate(-12,-12)">
        {/* Main star */}
        <path
          d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"
          fill="white"
          opacity="0.95"
        />
        {/* Top-left tick marks */}
        <path d="M5 3v4" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
        <path d="M3 5h4" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
        {/* Bottom-right tick marks */}
        <path d="M19 17v4" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
        <path d="M17 19h4" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      </g>
    </svg>
  );
}

// Inline credit display helper
export function CreditAmount({
  amount,
  className = '',
  size = 20,
}: {
  amount: number | string;
  className?: string;
  size?: number;
}) {
  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold ${className}`}>
      <SynthCoin size={size} />
      <span>{typeof amount === 'number' ? amount.toLocaleString() : amount}</span>
    </span>
  );
}
