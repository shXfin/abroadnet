import { useEffect, useState, type ReactNode } from "react";

/** Filter primitives in the site's editorial language: hairline rules, caps
 * labels, coral only for active state. Deliberately not rounded drop-shadow
 * cards — that reads as a generic template rather than as this site. */

export function FilterGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="border-t hairline pt-5 first:border-t-0 first:pt-0">
      <p className="label-caps mb-3 text-ink/40">{label}</p>
      {children}
    </div>
  );
}

export function SearchField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative">
      <svg
        viewBox="0 0 20 20"
        className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/30"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <circle cx="9" cy="9" r="6" />
        <path d="M14 14l4 4" strokeLinecap="round" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border-0 border-b-2 hairline bg-transparent py-2.5 pl-6 pr-2 text-sm font-semibold placeholder:font-normal placeholder:text-ink/30 focus:border-coral focus:outline-none"
      />
    </div>
  );
}

export function CheckRow({
  label,
  count,
  checked,
  onToggle,
}: {
  label: string;
  count?: number;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={checked}
      className="group flex w-full items-center gap-2.5 py-1.5 text-left"
    >
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center border-2 transition-colors ${
          checked ? "border-coral bg-coral" : "border-ink/25 group-hover:border-ink/50"
        }`}
      >
        {checked && (
          <svg viewBox="0 0 20 20" className="h-3 w-3 text-white" fill="currentColor" aria-hidden="true">
            <path d="M8 13.4 4.8 10.2l-1.4 1.4L8 16.2l9-9-1.4-1.4z" />
          </svg>
        )}
      </span>
      <span className={`flex-1 text-sm ${checked ? "font-semibold text-ink" : "text-ink/70"}`}>
        {label}
      </span>
      {count !== undefined && <span className="text-xs tabular-nums text-ink/30">{count}</span>}
    </button>
  );
}

/** Removable summary of what's currently applied. Users lose track of active
 * filters fast, especially after scrolling past the sidebar. */
export function ActiveChips({
  chips,
  onClear,
  clearLabel,
}: {
  chips: { key: string; label: string; onRemove: () => void }[];
  onClear: () => void;
  clearLabel: string;
}) {
  if (chips.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((c) => (
        <button
          key={c.key}
          onClick={c.onRemove}
          className="group inline-flex items-center gap-1.5 rounded-full border-2 border-coral/40 bg-coral/10 py-1 pl-3 pr-2 text-xs font-semibold text-navy transition-colors hover:border-coral"
        >
          {c.label}
          <svg
            viewBox="0 0 20 20"
            className="h-3 w-3 text-ink/40 group-hover:text-coral"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M5 5l10 10M15 5 5 15" />
          </svg>
        </button>
      ))}
      <button onClick={onClear} className="text-xs font-semibold text-ink/40 underline underline-offset-4 hover:text-coral">
        {clearLabel}
      </button>
    </div>
  );
}

/** Two-column shell. Sidebar is sticky on desktop; on mobile the same panel
 * opens as a full-screen sheet, because a 300px sidebar squeezed onto a phone
 * is the single most common failure of directory pages. */
export function CatalogueShell({
  filters,
  toolbar,
  children,
  filterLabel,
  activeCount,
  doneLabel,
}: {
  filters: ReactNode;
  toolbar: ReactNode;
  children: ReactNode;
  filterLabel: string;
  activeCount: number;
  doneLabel: string;
}) {
  const [open, setOpen] = useState(false);

  // A sheet that leaves the page scrolling underneath feels broken.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24">
      <div className="md:grid md:grid-cols-[236px_1fr] md:gap-12">
        <aside className="hidden md:block">
          <div className="sticky top-24 max-h-[calc(100vh-8rem)] space-y-5 overflow-y-auto pb-8 pr-1">
            {filters}
          </div>
        </aside>

        <div className="min-w-0">
          <div className="sticky top-[57px] z-20 -mx-6 mb-6 flex items-center gap-3 border-b hairline bg-paper/95 px-6 py-3 backdrop-blur md:static md:mx-0 md:border-0 md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-none">
            <button
              onClick={() => setOpen(true)}
              className="inline-flex shrink-0 items-center gap-2 rounded-full border-2 border-ink/20 px-4 py-1.5 text-xs font-bold text-ink transition-colors hover:border-coral hover:text-coral md:hidden"
            >
              <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M3 6h14M6 10h8M8 14h4" />
              </svg>
              {filterLabel}
              {activeCount > 0 && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-coral px-1 text-[10px] text-white">
                  {activeCount}
                </span>
              )}
            </button>
            {toolbar}
          </div>

          {children}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-navy/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 top-16 flex flex-col border-t hairline bg-paper">
            <div className="flex items-center justify-between border-b hairline px-6 py-4">
              <p className="font-display text-xl">{filterLabel}</p>
              <button onClick={() => setOpen(false)} aria-label={doneLabel} className="text-ink/40">
                <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M5 5l10 10M15 5 5 15" />
                </svg>
              </button>
            </div>
            <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">{filters}</div>
            <div className="border-t hairline px-6 py-4">
              <button onClick={() => setOpen(false)} className="btn-primary w-full justify-center">
                {doneLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
