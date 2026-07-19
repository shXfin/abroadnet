import AbroadMark from "./AbroadMark";

type Props = {
  className?: string;
  light?: boolean;
};

/**
 * Brand lockup: the hat mark perched over the end of "abroad", "Net." tucked
 * under the right — matching the original logo's arrangement.
 * TODO: swap for the real SVG/PNG in /public when the client provides it.
 */
export default function Logo({ className = "", light = false }: Props) {
  const ink = light ? "#FFFFFF" : "#241E5E";
  return (
    <span className={`relative inline-block leading-none ${className}`}>
      <span
        className="text-[34px] font-extrabold tracking-tight"
        style={{ color: ink, fontFamily: '"Manrope", sans-serif' }}
      >
        abroad
      </span>
      <AbroadMark className="absolute -right-4 -top-2.5 w-8" slabColor={light ? "#FFFFFF" : "#241E5E"} />
      <span
        className="absolute -bottom-3 right-[-10px] text-[14px] font-bold"
        style={{ color: ink, fontFamily: '"Manrope", sans-serif' }}
      >
        Net.
      </span>
    </span>
  );
}
