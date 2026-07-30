import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useLang } from "../i18n";
import { handleAssessmentLinkClick } from "../lib/assessmentJump";

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
  university: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5 12 4l9 5.5-9 5.5-9-5.5Z" />
      <path d="M6.5 11.3V17c0 1 2.5 2 5.5 2s5.5-1 5.5-2v-5.7" />
    </svg>
  ),
  course: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 4.5h11a2 2 0 0 1 2 2V19a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2V4.5Z" />
      <path d="M5 16.5h13" />
    </svg>
  ),
  chevronRight: (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7.5 4.5 13 10l-5.5 5.5" />
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
  const { pathname, hash } = useLocation();
  const [exploreOpen, setExploreOpen] = useState(false);

  const tabClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-1 flex-col items-center justify-center gap-1.5 py-3.5 transition-colors ${
      isActive ? "text-coral" : "text-ink/55"
    }`;
  // Destinations shares the "/" route with Home (it's an in-page anchor, not
  // its own page), so a plain NavLink would either never light up or light
  // up together with Home. Explore is "on" for the anchor, the catalogue
  // pages, or any destination detail page — everything the sheet links to.
  const onRoutesAnchor = pathname === "/" && hash === "#routes";
  const exploreActive =
    onRoutesAnchor || pathname.startsWith("/destinations") || pathname.startsWith("/universities") || pathname.startsWith("/courses");
  const exploreTabClass = `flex flex-1 flex-col items-center justify-center gap-1.5 py-3.5 transition-colors ${
    exploreActive ? "text-coral" : "text-ink/55"
  }`;

  useEffect(() => {
    if (!exploreOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setExploreOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [exploreOpen]);

  // Closing on route change means a tap into any sheet link dismisses it,
  // without wiring an onClick through every row below.
  useEffect(() => setExploreOpen(false), [pathname, hash]);

  return (
    <>
      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t hairline bg-paper/95 backdrop-blur lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="mx-auto flex max-w-6xl items-end px-2">
          <NavLink to="/" end className={tabClass({ isActive: pathname === "/" && !onRoutesAnchor })}>
            <span className="h-6 w-6">{icons.home}</span>
            <span className="text-xs font-semibold">{t.nav.home}</span>
          </NavLink>

          <button type="button" onClick={() => setExploreOpen(true)} className={exploreTabClass}>
            <span className="h-6 w-6">{icons.destinations}</span>
            <span className="text-xs font-semibold">{t.nav.destinations}</span>
          </button>

          <NavLink to="/#assessment" onClick={handleAssessmentLinkClick} className="flex flex-1 flex-col items-center justify-center pb-2">
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

      {exploreOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <div className="absolute inset-0 bg-navy/40 backdrop-blur-sm" onClick={() => setExploreOpen(false)} />
          <div
            className="absolute inset-x-0 bottom-0 border-t hairline bg-paper pb-2"
            style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 0.5rem)" }}
          >
            <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-ink/15" />
            <div className="px-3 py-2">
              <Link
                to="/#routes"
                className="flex items-center gap-3.5 rounded-xl px-3 py-3.5 active:bg-parchment/60"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-parchment text-ink/70">
                  <span className="h-5 w-5">{icons.destinations}</span>
                </span>
                <span className="flex-1 text-left text-[15px] font-semibold text-ink">{t.nav.destinations}</span>
                <span className="text-ink/30">{icons.chevronRight}</span>
              </Link>

              <Link
                to="/universities"
                className="flex items-center gap-3.5 rounded-xl px-3 py-3.5 active:bg-parchment/60"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-parchment text-ink/70">
                  <span className="h-5 w-5">{icons.university}</span>
                </span>
                <span className="flex-1 text-left text-[15px] font-semibold text-ink">{t.nav.universities}</span>
                <span className="text-ink/30">{icons.chevronRight}</span>
              </Link>

              <Link
                to="/courses"
                className="flex items-center gap-3.5 rounded-xl px-3 py-3.5 active:bg-parchment/60"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-parchment text-ink/70">
                  <span className="h-5 w-5">{icons.course}</span>
                </span>
                <span className="flex-1 text-left text-[15px] font-semibold text-ink">{t.nav.courses}</span>
                <span className="text-ink/30">{icons.chevronRight}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
