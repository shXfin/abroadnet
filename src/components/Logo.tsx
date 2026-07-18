type Props = {
  className?: string;
  light?: boolean;
};

/**
 * Recreation of the Abroad Net logo: navy slab + coral base mark, lowercase
 * "abroad" wordmark with "Net." tucked under the right.
 * TODO: replace with the real SVG/PNG in /public when the client provides it.
 */
export default function Logo({ className = "", light = false }: Props) {
  const ink = light ? "#FFFFFF" : "#241E5E";
  return (
    <span className={`relative inline-flex flex-col leading-none ${className}`}>
      <span className="flex items-end gap-0.5">
        <span className="font-display text-[26px] tracking-tight" style={{ color: ink }}>
          abroad
        </span>
        <svg viewBox="0 0 44 30" className="mb-3 h-4 w-auto shrink-0" aria-hidden="true">
          <polygon points="6,2 42,0 34,13 0,16" fill={ink} />
          <polygon points="12,19 37,16 30,29 17,26" fill="#F0633B" />
        </svg>
      </span>
      <span
        className="self-end pr-1 font-display text-[13px] italic"
        style={{ color: ink, marginTop: "-2px" }}
      >
        Net.
      </span>
    </span>
  );
}
