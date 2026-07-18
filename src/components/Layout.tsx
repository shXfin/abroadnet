import { useEffect, useState } from "react";
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

export default function Layout() {
  const { t } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { to: "/destinations/malaysia", label: t.nav.malaysia },
    { to: "/destinations/romania", label: t.nav.romania },
    { to: "/success-stories", label: t.nav.students },
    { to: "/about", label: t.nav.about },
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
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `label-caps transition-colors ${isActive ? "text-coral" : "text-ink/70 hover:text-ink"}`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Link to="/book-session" className="label-caps text-ink/70 hover:text-ink">
              {t.nav.freeSession}
            </Link>
            <LangToggle />
            <Link to="/apply" className="btn-primary !px-5 !py-2.5">
              {t.nav.apply}
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
                ...navLinks,
                { to: "/book-session", label: t.nav.freeSession },
                { to: "/apply", label: t.nav.apply },
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
              <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/60">{t.footer.tagline}</p>
            </div>
            <div className="text-sm">
              <p className="label-caps mb-3 text-white/40">{t.footer.destinations}</p>
              <div className="flex gap-8">
                <Link to="/destinations/malaysia" className="text-white/80 hover:text-white">
                  {t.nav.malaysia}
                </Link>
                <Link to="/destinations/romania" className="text-white/80 hover:text-white">
                  {t.nav.romania}
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-14 flex flex-col justify-between gap-3 border-t border-white/15 pt-6 text-xs text-white/50 md:flex-row">
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
