interface FounderBadgeProps {
  size?: number
  className?: string
}

const FounderBadge = ({ size = 56, className = '' }: FounderBadgeProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 56 68"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Rosette gradient */}
        <linearGradient id="founder-rosette" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#EFC97A" />
          <stop offset="100%" stopColor="#B8721E" />
        </linearGradient>
        {/* Inner circle gradient */}
        <radialGradient id="founder-inner" cx="38%" cy="32%" r="65%">
          <stop offset="0%" stopColor="#DDA050" />
          <stop offset="100%" stopColor="#9E5E18" />
        </radialGradient>
        {/* Left ribbon */}
        <linearGradient id="founder-rib-l" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#CB997E" />
          <stop offset="100%" stopColor="#8C5830" />
        </linearGradient>
        {/* Right ribbon */}
        <linearGradient id="founder-rib-r" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#B8784A" />
          <stop offset="100%" stopColor="#7A4020" />
        </linearGradient>
        {/* Shine */}
        <radialGradient id="founder-shine" cx="38%" cy="28%" r="52%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ribbons (drawn behind medal) */}
      <polygon points="20,44 28,48 22,66 16,60 10,66" fill="url(#founder-rib-l)" />
      <polygon points="28,48 36,44 46,66 40,60 34,66" fill="url(#founder-rib-r)" />

      {/* Ribbon highlight lines */}
      <line x1="19" y1="46" x2="14" y2="63" stroke="white" strokeWidth="0.6" strokeOpacity="0.2" />
      <line x1="37" y1="46" x2="43" y2="63" stroke="white" strokeWidth="0.6" strokeOpacity="0.2" />

      {/* Rosette drop shadow */}
      <polygon
        points="28,4 32.4,9.6 39,7 40,14 47,15 44.4,21.6 50,26 44.4,30.4 47,37 40,38 39,45 32.4,42.4 28,48 23.6,42.4 17,45 16,38 9,37 11.6,30.4 6,26 11.6,21.6 9,15 16,14 17,7 23.6,9.6"
        fill="#6B3A00"
        opacity="0.18"
        transform="translate(1,1.5)"
      />

      {/* Outer rosette */}
      <polygon
        points="28,4 32.4,9.6 39,7 40,14 47,15 44.4,21.6 50,26 44.4,30.4 47,37 40,38 39,45 32.4,42.4 28,48 23.6,42.4 17,45 16,38 9,37 11.6,30.4 6,26 11.6,21.6 9,15 16,14 17,7 23.6,9.6"
        fill="url(#founder-rosette)"
      />

      {/* Thin rosette outline */}
      <polygon
        points="28,4 32.4,9.6 39,7 40,14 47,15 44.4,21.6 50,26 44.4,30.4 47,37 40,38 39,45 32.4,42.4 28,48 23.6,42.4 17,45 16,38 9,37 11.6,30.4 6,26 11.6,21.6 9,15 16,14 17,7 23.6,9.6"
        fill="none"
        stroke="white"
        strokeWidth="0.5"
        strokeOpacity="0.35"
      />

      {/* Inner circle shadow */}
      <circle cx="28.5" cy="27" r="16.5" fill="#6B3A00" opacity="0.2" />

      {/* Inner circle */}
      <circle cx="28" cy="26" r="16" fill="url(#founder-inner)" />

      {/* Inner circle border */}
      <circle cx="28" cy="26" r="16" fill="none" stroke="white" strokeWidth="0.8" strokeOpacity="0.45" />

      {/* Star */}
      <polygon
        points="28,17 30.2,22.9 36.6,23.2 31.6,27.2 33.3,33.3 28,29.8 22.7,33.3 24.4,27.2 19.4,23.2 25.8,22.9"
        fill="#3B2F2F"
        opacity="0.9"
      />
      {/* Star highlight edge */}
      <polygon
        points="28,17 30.2,22.9 36.6,23.2 31.6,27.2 33.3,33.3 28,29.8 22.7,33.3 24.4,27.2 19.4,23.2 25.8,22.9"
        fill="none"
        stroke="white"
        strokeWidth="0.5"
        strokeOpacity="0.25"
      />

      {/* Overall shine */}
      <circle cx="28" cy="26" r="16" fill="url(#founder-shine)" />
    </svg>
  )
}

export default FounderBadge
