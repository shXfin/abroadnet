/** Scrolls the assessment quiz into view and re-plays its highlight flash.
 * Shared by every "Get matched" entry point so repeat taps always react,
 * not just the first one (a same-page Link to an unchanged hash doesn't
 * produce a new location, so React Router won't fire again on its own). */
export function jumpToAssessmentNow() {
  const el = document.getElementById("assessment");
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth" });

  const card = document.getElementById("assessment-card");
  if (card) {
    card.classList.remove("assessment-flash");
    // restart the animation even if it was already applied
    void card.offsetWidth;
    card.classList.add("assessment-flash");
    window.setTimeout(() => card.classList.remove("assessment-flash"), 2400);
  }
}

/** Attach as onClick to any Link/NavLink/anchor pointing at "/#assessment".
 * If the assessment section is already mounted (we're already on the page
 * that contains it), a Link to the same hash is a no-op for React Router,
 * so we drive the scroll + flash ourselves every time instead. Otherwise we
 * do nothing and let normal navigation happen; ScrollToTop handles the
 * first arrival once the page mounts. */
export function handleAssessmentLinkClick(e: { preventDefault: () => void }) {
  if (document.getElementById("assessment")) {
    e.preventDefault();
    jumpToAssessmentNow();
  }
}
