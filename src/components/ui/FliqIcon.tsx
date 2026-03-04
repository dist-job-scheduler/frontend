interface FliqIconProps {
  size?: number;
  className?: string;
}

/**
 * Fliq F-lettermark icon (concept 03).
 * Geometric F: white vertical stroke + indigo horizontal bars + motion lines + corner accent dot.
 * Pure SVG — works in any context (navbar, footer, og images, etc.)
 */
export default function FliqIcon({ size = 32, className }: FliqIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Fliq"
    >
      <defs>
        <linearGradient id="fi-g1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#ffffff" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>
        <linearGradient id="fi-g2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#818cf8" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="fi-g3" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#a5b4fc" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.4" />
        </linearGradient>
        <radialGradient id="fi-glow" cx="40%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#6366f1" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
        </radialGradient>
        <filter id="fi-dot-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Ambient glow */}
      <ellipse cx="34" cy="36" rx="28" ry="28" fill="url(#fi-glow)" />

      {/* Vertical stroke — white→indigo gradient */}
      <rect x="18" y="14" width="9" height="44" rx="2" fill="url(#fi-g1)" />

      {/* Top horizontal bar — full width */}
      <rect x="18" y="14" width="36" height="9" rx="2" fill="url(#fi-g2)" />

      {/* Mid horizontal bar — classic F proportion */}
      <rect x="18" y="31.5" width="26" height="8" rx="2" fill="url(#fi-g3)" />

      {/* Motion lines — velocity / dispatch */}
      <line x1="52" y1="27" x2="59" y2="27" stroke="rgba(99,102,241,0.7)"  strokeWidth="2"   strokeLinecap="round" />
      <line x1="54" y1="33" x2="59" y2="33" stroke="rgba(99,102,241,0.45)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="56" y1="39" x2="59" y2="39" stroke="rgba(99,102,241,0.25)" strokeWidth="1"   strokeLinecap="round" />

      {/* Corner accent dot — top-right of top bar */}
      <circle cx="54" cy="18.5" r="3"   fill="#6366f1" opacity="0.9" filter="url(#fi-dot-glow)" />
      <circle cx="54" cy="18.5" r="1.5" fill="#c7d2fe" />
    </svg>
  );
}
