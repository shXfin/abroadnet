import { Link, NavLink } from "react-router-dom";
import { useLang } from "../i18n";

const icons = {
  home: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5.5 9.5V20h13V9.5" />
    </svg>
  ),
  destinations: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.4" />
    </svg>
  ),
  students: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19v-1a4 4 0 0 1 4-4h1a4 4 0 0 1 4 4v1" />
      <circle cx="8.5" cy="8" r="3" />
      <path d="M15 19v-1a4 4 0 0 0-2.3-3.6" />
      <path d="M13 4.2A3 3 0 0 1 14 10" />
    </svg>
  ),
  about: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5" />
      <circle cx="12" cy="7.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  ),
  spark: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l2.2 6.2L20.5 10l-6.3 1.8L12 18l-2.2-6.2L3.5 10l6.3-1.8Z" />
    </svg>
  ),
};

/** App-style bottom tab bar for mobile — the desktop header's nav is hidden
 * below lg, this replaces it with a fixed, thumb-reachable tab bar. */
export default function MobileTabBar({ onOpenMenu: _onOpenMenu }: { onOpenMenu: () => void }) {
  const { t } = useLang();

  const tabClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-1 flex-col items-center justify-center gap-1.5 py-3.5 transition-colors ${
      isActive ? "text-coral" : "text-ink/55"
    }`;
  // Plain (never "active") style for tabs that jump to an in-page anchor
  // rather than a distinct route — e.g. Destinations, which otherwise shares
  // "/" with Home and would falsely light up as the current page.
  const anchorTabClass = "flex flex-1 flex-col items-center justify-center gap-1.5 py-3.5 text-ink/55 transition-colors";

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t hairline bg-paper/95 backdrop-blur lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex max-w-6xl items-end px-2">
        <NavLink to="/" end className={tabClass}>
          <span className="h-6 w-6">{icons.home}</span>
          <span className="text-xs font-semibold">{t.nav.home}</span>
        </NavLink>

        <Link to="/#routes" className={anchorTabClass}>
          <span className="h-6 w-6">{icons.destinations}</span>
          <span className="text-xs font-semibold">{t.nav.destinations}</span>
        </Link>

        <NavLink to="/#assessment" className="flex flex-1 flex-col items-center justify-center pb-2">
          <span className="-mt-7 flex h-14 w-14 items-center justify-center rounded-full bg-navy text-white shadow-[0_8px_20px_-6px_rgba(28,23,64,0.6)]">
            <span className="h-6 w-6 text-coral">{icons.spark}</span>
          </span>
          <span className="mt-1.5 whitespace-nowrap text-[11px] font-semibold text-navy">{t.nav.getMatched}</span>
        </NavLink>

        <NavLink to="/success-stories" className={tabClass}>
          <span className="h-6 w-6">{icons.students}</span>
          <span className="text-xs font-semibold">{t.nav.students}</span>
        </NavLink>

        <NavLink to="/about" className={tabClass}>
          <span className="h-6 w-6">{icons.about}</span>
          <span className="text-xs font-semibold">{t.nav.about}</span>
        </NavLink>
      </div>
    </nav>
  );
}
