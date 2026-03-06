import React from 'react';

interface SynthCoinProps {
  size?: number;
  className?: string;
  animated?: boolean; // idle float animation
  spin?: boolean;     // purchase/hover spin
}

// The SynthCoin component — uses the 3D rendered coin image
// Falls back to the SVG hex design if image fails to load
export function SynthCoin({ size = 20, className = '', animated = false, spin = false }: SynthCoinProps) {
  const [imgError, setImgError] = React.useState(false);

  const animClass = spin
    ? 'animate-spin'
    : animated
    ? 'synthcoin-float'
    : '';

  if (imgError) {
    // Fallback SVG hex coin
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`inline-block flex-shrink-0 ${animClass} ${className}`}
        style={{ verticalAlign: 'middle' }}
      >
        <defs>
          <linearGradient id="coinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9D4EDD" />
            <stop offset="100%" stopColor="#FF006E" />
          </linearGradient>
        </defs>
        <polygon points="12,1.5 20.66,6.25 20.66,17.75 12,22.5 3.34,17.75 3.34,6.25" fill="url(#coinGrad)" />
        <g transform="translate(12,12) scale(0.45)">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="white" opacity="0.9" />
        </g>
      </svg>
    );
  }

  return (
    <img
      src="/synthcoin-3d.png"
      alt="SynthCoin"
      width={size}
      height={size}
      onError={() => setImgError(true)}
      className={`inline-block flex-shrink-0 ${animClass} ${className}`}
      style={{ verticalAlign: 'middle', objectFit: 'contain' }}
    />
  );
}

// Displays a credit amount with the coin icon
interface CreditAmountProps {
  amount: number;
  size?: number;
  className?: string;
  showSign?: boolean;
  animate?: boolean;
}

export function CreditAmount({ amount, size = 18, className = '', showSign = false, animate = false }: CreditAmountProps) {
  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <SynthCoin size={size} animated={animate} />
      <span>{showSign && amount > 0 ? '+' : ''}{amount.toLocaleString()}</span>
    </span>
  );
}
