type Props = {
  className?: string;
  slabColor?: string;
};

/**
 * The Abroad Net "hat" mark, traced from the brand asset: a navy slab over a
 * coral wedge. Rounded joins via stroke to match the original's soft corners.
 */
export default function AbroadMark({ className = "", slabColor = "#241E5E" }: Props) {
  return (
    <svg viewBox="0 0 74 38" className={className} aria-hidden="true">
      <path
        d="M10.4,14 L60.9,3.5 L70,16 L2.9,33"
        fill={slabColor}
        stroke={slabColor}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M19,31.2 L59.5,20.4 L60.3,26.4 L37.5,35.9"
        fill="#F0633B"
        stroke="#F0633B"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
