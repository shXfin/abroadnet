# Abroad Net — Website

Study-abroad consultancy site for [Abroad Net](https://www.facebook.com/abroadnet25/), focused on Bangladeshi students going to **Malaysia** and **Romania**.

Stack: Bun + Vite + React + TypeScript + Tailwind CSS. Fully bilingual (English / বাংলা toggle, persisted). Static output, no server required — forms post to a third-party service (Formspree/Airtable, TBD).

Typography: Instrument Serif + Inter (English), Noto Serif Bengali + Hind Siliguri (Bangla).

Note: the Facebook page embed only renders on a real deployed domain — it stays blank on localhost.

## Getting started

```
bun install
bun run dev
```

## Feature checklist

- [x] Scaffold + repo structure
- [x] Bilingual EN/বাংলা toggle with Bengali typography
- [ ] Domain/hosting research (task 1)
- [ ] Chatbot (optional, task 2)
- [x] Malaysia & Romania step-by-step intake pages (figures need confirming — task 3)
- [ ] Real content for About/portfolio/office (task 4)
- [ ] Success stories with real student proof/reviews (task 5)
- [x] Application form (UI done, needs live Formspree/Airtable endpoint — task 6)
- [x] 1-on-1 session booking page (UI done, needs Calendly/Cal.com embed — task 7)
- [ ] Internal per-student folder organizing tool (optional, task 8)
- [x] Facebook carousel under hero (page embed live on deploy; add reel URLs in FacebookCarousel.tsx — task 9)
- [ ] Real logo file (currently an SVG recreation in Logo.tsx — drop original into /public)
- [ ] Confirm partner university lists (src/data/universities.ts)

## Structure

```
src/
  pages/              route-level pages
  pages/destinations/ per-country step-by-step pages
  components/         shared UI
  i18n/               language provider + EN/BN translations
  data/               partner university lists
```
