import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import Logo from "./Logo";
import { useLang } from "../i18n";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

function LangToggle({ light = false }: { light?: boolean }) {
  const { lang, setLang } = useLang();
  const base = light ? "text-white/60" : "text-ink/50";
  const active = light ? "text-white" : "text-coral";
  return (
    <button
      onClick={() => setLang(lang === "en" ? "bn" : "en")}
      className="flex items-center gap-1.5 text-sm font-semibold"
      aria-label="Switch language"
    >
      <span className={lang === "en" ? active : base}>EN</span>
      <span className={base}>/</span>
      <span className={`font-display ${lang === "bn" ? active : base}`}>বাং</span>
    </button>
  );
}

function DestinationsDropdown({ label, destinations }: { label: string; destinations: { to: string; label: string }[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onClickOutside);
    return () => document.removeEventListener("click", onClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="label-caps flex items-center gap-1.5 text-ink/70 hover:text-ink"
      >
        {label}
        <span className={`transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-3 w-48 border hairline bg-paper py-2 shadow-lg">
          {destinations.map((d) => (
            <NavLink
              key={d.to}
              to={d.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2 text-sm font-semibold transition-colors ${
                  isActive ? "text-coral" : "text-ink/80 hover:bg-parchment/60 hover:text-ink"
                }`
              }
            >
              {d.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Layout() {
  const { t } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);

  const destinations = [
    { to: "/destinations/malaysia", label: t.nav.malaysia },
    { to: "/destinations/romania", label: t.nav.romania },
    { to: "/destinations/georgia", label: t.nav.georgia },
    { to: "/destinations/china", label: t.nav.china },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />

      <header className="sticky top-0 z-50 border-b hairline bg-paper/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-3">
          <Link to="/" onClick={() => setMenuOpen(false)} className="shrink-0">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            <DestinationsDropdown label={t.nav.destinations} destinations={destinations} />
            <NavLink
              to="/success-stories"
              className={({ isActive }) =>
                `label-caps transition-colors ${isActive ? "text-coral" : "text-ink/70 hover:text-ink"}`
              }
            >
              {t.nav.students}
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `label-caps transition-colors ${isActive ? "text-coral" : "text-ink/70 hover:text-ink"}`
              }
            >
              {t.nav.about}
            </NavLink>
            <Link to="/book-session" className="label-caps text-ink/70 hover:text-ink">
              {t.nav.freeSession}
            </Link>
            <LangToggle />
            <Link to="/onboarding" className="btn-primary !px-5 !py-2.5">
              {t.nav.getMatched}
            </Link>
          </nav>

          <div className="flex items-center gap-5 lg:hidden">
            <LangToggle />
            <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
              <span className="label-caps">{menuOpen ? t.nav.close : t.nav.menu}</span>
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="border-t hairline px-6 py-6 lg:hidden">
            <div className="flex flex-col gap-5">
              {[
                ...destinations,
                { to: "/success-stories", label: t.nav.students },
                { to: "/about", label: t.nav.about },
                { to: "/book-session", label: t.nav.freeSession },
                { to: "/onboarding", label: t.nav.getMatched },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className="font-display text-2xl text-ink"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-navy text-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end">
            <div>
              <Logo light />
              <p className="mt-3 text-xs font-semibold uppercase tracking-caps text-coral">{t.brand.motto}</p>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">{t.footer.tagline}</p>
            </div>
            <div className="text-sm">
              <p className="label-caps mb-3 text-white/40">{t.footer.destinations}</p>
              <div className="flex flex-wrap gap-x-8 gap-y-2">
                {destinations.map((d) => (
                  <Link key={d.to} to={d.to} className="text-white/80 hover:text-white">
                    {d.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-3 border-t border-white/15 pt-8 text-sm text-white/70 sm:grid-cols-3">
            <p>{t.footer.email}</p>
            <p>{t.footer.phone}</p>
            <p>{t.footer.address}</p>
          </div>

          <div className="mt-8 flex flex-col justify-between gap-3 border-t border-white/15 pt-6 text-xs text-white/50 md:flex-row">
            <p>
              &copy; {new Date().getFullYear()} {t.footer.copyright}
            </p>
            <a
              href="https://www.facebook.com/abroadnet25/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white"
            >
              {t.footer.facebook}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
