# Himalaya-Haus e.V. — Projektkontext für Claude Code

## Was ist dieses Projekt?

Website für **Himalaya-Haus e.V.**, einen gemeinnützigen deutschen Verein (Frankfurt), der Hilfsprojekte für Kinder in Ladakh, Indien unterstützt. Gegründet 2017 von **Lama Konchok Samten** (buddhistischer Mönch, lebt zwischen Ladakh und Frankfurt) und **Oliver** (Unternehmer, Schwarzwald).

Drei aktive Projekte:
- **Nalanda Schule & Waisenhaus** — Internat für 200 Kinder in Saboo bei Leh, gerade im Bau (Phase 3)
- **Kinderpatenschaft** — 35 €/Monat für ein konkretes Kind
- **Medical Camp** — jährliche Camps mit deutschen Ärzten in abgelegenen Dörfern

## Tech Stack

```
website/          ← Astro-Projekt (alles läuft hier drin)
├── src/
│   ├── components/     ← 12 Astro-Komponenten
│   ├── layouts/        ← BaseLayout.astro, BlogLayout.astro
│   ├── pages/          ← 21 Seiten (statisch generiert)
│   ├── content/        ← Blog (3 Posts) + Projekte (3 Einträge), Markdown
│   ├── utils/url.ts    ← WICHTIG: URL-Helper für GitHub Pages Base Path
│   └── styles/         ← global.css (Tailwind)
└── package.json
```

**Versionen:**
- Astro `4.16.x` (NICHT Astro 5 — Breaking Changes!)
- Tailwind CSS `3.4.x`
- Alpine.js `3.14.x`
- `@astrojs/sitemap` muss auf `3.1.6` fixiert bleiben (3.7.x ist nur für Astro 5)

**Dev-Server starten:**
```bash
cd website
npm install   # falls node_modules fehlt
npm run dev   # http://localhost:4321
```

**Build für GitHub Pages:**
```bash
cd website
GITHUB_PAGES=true npm run build
```

## Brand & Design

**Farben:**
```
brand-ocker:      #C17F45   ← Hauptfarbe, Buttons, Akzente
brand-erde:       #8B5E2F   ← Dunkleres Orange/Braun
brand-creme:      #F9F4EE   ← Seitenhintergrund
brand-creme-dark: #EDE5D8   ← Cards, Boxen
brand-text:       #2D2D2D   ← Fast-Schwarz für Text
brand-blau:       #4A7FA5   ← Sekundärfarbe
```

**Fonts:** Lora (Serif, Headlines) + Source Sans 3 (Sans, Body) — via Bunny Fonts CDN (DSGVO-konform)

**CSS-Klassen (custom, in global.css definiert):**
- `.btn-primary` / `.btn-secondary` / `.btn-ghost` — Buttons
- `.card` — Cards mit Shadow
- `.section-padding` / `.section-padding-sm` — Vertikale Abstände
- `.container-content` — Max-Width + Padding
- `.prose-himalaya` — Typografie für Markdown-Content

## Kritische Architektur-Entscheidungen

### 1. URL-Helper für GitHub Pages (PFLICHT)
Astro 4 prefixed `<a href>` NICHT automatisch mit dem Base-Path. Deshalb:
```typescript
// src/utils/url.ts
const base = import.meta.env.BASE_URL.replace(/\/$/, '');
export const url = (path: string): string => `${base}${path}`;
```

**Alle internen Links MÜSSEN so geschrieben werden:**
```astro
---
import { url } from '@/utils/url';
---
<a href={url('/blog/')}>Blog</a>
```
Niemals `href="/blog/"` — das bricht auf GitHub Pages!

### 2. GitHub Pages Deployment
- Repo: `rentallin/himalaya-haus`
- Branch: `claude/himalaya-house-relaunch-analysis-iJGe4`
- Preview-URL: `https://rentallin.github.io/himalaya-haus/`
- Wird automatisch deployed via `.github/workflows/deploy-pages.yml` bei jedem Push
- Konfiguration: `GITHUB_PAGES=true` setzt `base: '/himalaya-haus'` in `astro.config.mjs`

### 3. Content Collections — Enums (Pflicht!)
Blog `author` nur: `'Lama Konchok Samten' | 'Himalaya-Haus e.V.' | 'Redaktion'`
Blog `category` nur: `'schulbau' | 'waisenhaus' | 'medical-camp' | 'kinderpatenschaft' | 'reisebericht' | 'vereinsnews' | 'ladakh-kultur'`

### 4. Alpine.js x-data mit Server-Daten
Niemals String-Konkatenation in x-data. Immer JSON.stringify:
```astro
---
const data = JSON.stringify({ key: value });
---
<div x-data={data}>
```

### 5. Externe Services (alles Placeholder)
Alle in `.env` konfigurieren (`.env.example` vorhanden):
- `PUBLIC_STRIPE_LINK_SPENDE_25/50/100` — Stripe Payment Links
- `PUBLIC_STRIPE_LINK_DAUERSPENDE` — Stripe Dauerspende
- `PUBLIC_STRIPE_LINK_PATENSCHAFT` — Stripe Patenschaft
- `PUBLIC_FORMSPREE_ID` — Kontaktformular (Formspree.io)
- `BREVO_LIST_ID` / `BREVO_REDIRECT_URL` — Newsletter (Brevo)

## Seitenstruktur (21 Seiten)

```
/                          → Startseite (Hero, Projekte, Lama, Blog-Teaser)
/ueber-uns/                → Vereinsgeschichte, Team
/ueber-uns/lama-konchok/   → Lama Samten Seite
/ueber-uns/vorstand/       → Vorstandsmitglieder
/projekte/                 → Projektübersicht
/projekte/nalanda-schule/  → Nalanda Schule Detail
/projekte/patenschaft/     → Patenschaft Detail
/projekte/medical-camp/    → Medical Camp Detail
/blog/                     → Blogübersicht
/blog/[slug]/              → Blog-Einzelartikel
/unterstuetzen/            → Spendenoptionen Übersicht
/unterstuetzen/spenden/    → Spendenseite mit Stripe + Rechner
/unterstuetzen/patenschaft/→ Patenschaft-Anmeldung
/wirkung/                  → Impact-Zahlen & Wirkungsrechner
/kontakt/                  → Kontaktformular
/danke/                    → Danke-Seite nach Spende
/impressum/                → Impressum
/datenschutz/              → Datenschutz
/404.astro                 → 404-Seite
/rss.xml                   → RSS Feed
```

## Komponenten-Übersicht

| Komponente | Beschreibung |
|---|---|
| `Header.astro` | Sticky Nav, Dropdown-Menü, Mobile Hamburger (Alpine.js) |
| `Footer.astro` | 4-Spalten Footer mit Links, Bankverbindung |
| `Hero.astro` | Fullscreen oder Compact Hero, CTA-Buttons |
| `SpendenBox.astro` | Stripe-Spendenbuttons, 3 Varianten (fullwidth/sidebar/minimal) |
| `WirkungsRechner.astro` | Interaktiver Rechner (Alpine.js) was Spende bewirkt |
| `BaufortschrittTimeline.astro` | Baufortschritt Nalanda Schule, compact & full |
| `ProjektKarte.astro` | Projekt-Card (vertikal/horizontal/featured) |
| `BlogPostKarte.astro` | Blog-Card (standard/featured) |
| `ImpactZahlen.astro` | Impact-Kennzahlen (Kinder, Patienten, etc.) |
| `KontaktFormular.astro` | Formspree-Formular mit Honeypot |
| `NewsletterFormular.astro` | Brevo Newsletter, 2 Varianten |
| `QuoteBlock.astro` | Zitat-Block (gross/minimal) |

## Offene GitHub Issues (V2 Backlog)

Alle Issues sind unter `github.com/rentallin/himalaya-haus/issues` angelegt:

**P0 — Kritisch:**
- #2: Netlify Production Deployment einrichten (`.de`-Domain)

**P1 — Wichtig:**
- #3: Stripe Payment Links konfigurieren (echte Links eintragen)
- #4: Playwright E2E Tests aufsetzen
- #5: Echte Fotos (WebP) — Placeholder-Grafiken ersetzen
- #6: Accessibility WCAG 2.1 AA Audit
- #7: Core Web Vitals Optimierung
- #8: Newsletter (Brevo) + Kontaktformular (Formspree) konfigurieren

**P2 — Sinnvoll:**
- #9: Lama Samten Seite — vollständiger Inhalt
- #10: BaufortschrittTimeline — echte Meilensteine eintragen
- #11: SEO Audit + Google Search Console
- #12: Mobile Responsive Testing
- #13: Blog-Pagination (ab 10+ Artikeln)

**P3 — Später:**
- #14: Launch-Checkliste (Impressum IBAN, Bankdaten)
- #15: Google Ad Grants (10.000$/Monat für NGOs)
- #16: Content-Plan (5 SEO-Artikel Ladakh)

## Typische Workflows

**Neuen Blog-Artikel erstellen:**
```markdown
<!-- website/src/content/blog/mein-artikel.md -->
---
title: "Titel"
description: "Kurzbeschreibung"
pubDate: 2025-01-15
author: "Lama Konchok Samten"   # oder "Redaktion" oder "Himalaya-Haus e.V."
category: "schulbau"            # Enum, s.o.
tags: ["ladakh", "schule"]
featured: false
draft: false
---
Artikelinhalt in Markdown...
```

**Neue Seite erstellen:**
1. Datei unter `website/src/pages/` anlegen
2. `import { url } from '@/utils/url'` im Frontmatter
3. Alle internen `href` mit `url('/')` wrappen
4. `BaseLayout` als Layout verwenden

**Deployment prüfen:**
- GitHub Actions: `https://github.com/rentallin/himalaya-haus/actions`
- Preview: `https://rentallin.github.io/himalaya-haus/`

## Bekannte Stolperfallen

1. **`@astrojs/sitemap` Version** — Niemals über `3.1.6` upgraden (bricht mit Astro 4)
2. **`href` ohne `url()`** — Bricht alle Links auf GitHub Pages (404 auf Sub-Pages)
3. **Blog-Frontmatter Enums** — `author` und `category` müssen exakt matchen
4. **Alpine.js x-data** — Kein String-Concat, immer `JSON.stringify()`
5. **`node_modules` fehlt** — Nach Clone immer `npm install` in `website/` ausführen
6. **Astro 5 Migration** — Noch nicht tun, Breaking Changes bei Content Collections

## Huashu-Design Skill

Der Skill ist lokal installiert (`~/.claude/skills/huashu-design/`). Nutze ihn für:
- Hi-Fi HTML-Prototypen einzelner Sektionen
- Design-Varianten der Startseite / Hero
- Interaktive Demo für Lama Samten
- Animierte Komponenten (WirkungsRechner, Timeline)

Trigger: `/huashu-design` oder Beschreibung wie "mach einen HTML-Prototyp von..."
