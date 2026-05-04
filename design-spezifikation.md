# Himalaya-Haus e.V. — Design- & Layout-Spezifikation
**Version 1.0 | Astro + Tailwind CSS | Mai 2026**

---

## 1. TAILWIND-KONFIGURATION

```js
// tailwind.config.mjs
import defaultTheme from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,vue,svelte}'],
  theme: {
    extend: {
      colors: {
        'brand-ocker':  '#C17F45',   // Primär: Lehmmauern, Sandstein
        'brand-erde':   '#8B5E2F',   // Primär dunkel: Tiefe, Verwurzelung
        'brand-rot':    '#8B2E2E',   // Sekundär: Mönchsrobe, Tradition
        'brand-blau':   '#4A7FA5',   // Akzent: Himalaya-Himmel, Klarheit
        'brand-creme':  '#F9F4EE',   // Hintergrund: Wärme, Papier
        'brand-text':   '#2D2D2D',   // Text: Anthrazit, Lesbarkeit
        // Hilfsvarianten (hover, tint)
        'brand-ocker-light': '#D9A472',
        'brand-ocker-dark':  '#9E6330',
        'brand-blau-light':  '#6DA0C0',
        'brand-creme-dark':  '#EDE5D8',
      },
      fontFamily: {
        serif:  ['Lora', ...defaultTheme.fontFamily.serif],
        sans:   ['Source Sans 3', ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        // Fluid-ish type scale
        'display': ['clamp(2.5rem, 5vw, 4rem)',   { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'h1':      ['clamp(2rem,   4vw, 3rem)',    { lineHeight: '1.2',  letterSpacing: '-0.01em' }],
        'h2':      ['clamp(1.5rem, 3vw, 2.25rem)', { lineHeight: '1.25' }],
        'h3':      ['clamp(1.25rem,2.5vw, 1.75rem)',{ lineHeight: '1.3' }],
        'h4':      ['1.125rem',                    { lineHeight: '1.4'  }],
        'body-lg': ['1.125rem',                    { lineHeight: '1.7'  }],
        'body':    ['1rem',                        { lineHeight: '1.7'  }],
        'small':   ['0.875rem',                    { lineHeight: '1.5'  }],
        'xs':      ['0.75rem',                     { lineHeight: '1.5'  }],
      },
      spacing: {
        // Section-Abstände konsistent
        'section-sm': '4rem',
        'section':    '6rem',
        'section-lg': '8rem',
      },
      maxWidth: {
        'content':      '72rem',   // 1152px — Haupt-Content-Breite
        'content-wide': '90rem',   // 1440px — Hero/Full-Bleed
        'prose':        '68ch',    // Lesetext
      },
      borderRadius: {
        'card': '0.75rem',
      },
      boxShadow: {
        'card':     '0 2px 12px 0 rgba(45,45,45,0.08)',
        'card-lg':  '0 8px 32px 0 rgba(45,45,45,0.12)',
        'btn':      '0 2px 8px 0 rgba(193,127,69,0.25)',
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(to bottom, rgba(45,45,45,0.45) 0%, rgba(45,45,45,0.15) 60%, rgba(45,45,45,0) 100%)',
        'gradient-cta':  'linear-gradient(135deg, #C17F45 0%, #8B5E2F 100%)',
        'gradient-rot':  'linear-gradient(135deg, #8B2E2E 0%, #5C1E1E 100%)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}
```

**Google Fonts einbinden** (`src/layouts/BaseLayout.astro`):
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Source+Sans+3:wght@300;400;600;700&display=swap"
  rel="stylesheet"
/>
```

---

## 2. KOMPONENTEN-INVENTAR

### 2.1 BaseLayout / SektionWrapper

| Eigenschaft | Detail |
|-------------|--------|
| **Name** | `SektionWrapper` |
| **Datei** | `src/components/SektionWrapper.astro` |
| **Beschreibung** | Wrapper mit max-width, horizontalem Padding, optionalem Hintergrund. Alle Sektionen laufen durch diesen Wrapper. |
| **Props** | `bg?: 'creme' \| 'white' \| 'ocker' \| 'rot' \| 'dark'`, `size?: 'sm' \| 'md' \| 'lg' \| 'full'`, `id?: string` |
| **Verwendet auf** | Alle Seiten |

```astro
---
// SektionWrapper.astro — Referenz-Markup
const { bg = 'white', size = 'md', id } = Astro.props;
const bgMap = {
  creme: 'bg-brand-creme',
  white: 'bg-white',
  ocker: 'bg-gradient-cta text-white',
  rot:   'bg-gradient-rot text-white',
  dark:  'bg-brand-text text-brand-creme',
};
const sizeMap = {
  sm:   'py-section-sm',
  md:   'py-section',
  lg:   'py-section-lg',
  full: 'py-0',
};
---
<section id={id} class={`${bgMap[bg]} ${sizeMap[size]}`}>
  <div class="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
    <slot />
  </div>
</section>
```

---

### 2.2 Header / Navigation

| Eigenschaft | Detail |
|-------------|--------|
| **Name** | `Header` |
| **Datei** | `src/components/Header.astro` + `src/components/MobileMenu.astro` |
| **Varianten** | `transparent` (über Hero-Bild), `solid` (weiß/creme, nach Scroll) |
| **Verhalten** | Sticky. Beim Scrollen ab 80px: Hintergrund `bg-brand-creme/95 backdrop-blur-sm`, Shadow `shadow-card`, Logo wächst leicht. |
| **Verwendet auf** | Alle Seiten (via BaseLayout) |

**Desktop-Struktur:**
- Logo links (SVG, Schrift: Lora)
- Nav-Links mittig (5 Top-Level-Items, siehe Abschnitt 4)
- Rechts: „Jetzt spenden"-CTA-Button (brand-ocker, pill-Form) + Hamburger-Icon auf Mobile

**Mobile-Struktur:**
- Hamburger Icon (3 Balken → X-Animation)
- Overlay-Menü: volles Viewport, bg-brand-creme, Lora-Schrift, große Links
- Spenden-Button unten fixiert im Overlay

---

### 2.3 Hero

| Eigenschaft | Detail |
|-------------|--------|
| **Name** | `Hero` |
| **Datei** | `src/components/Hero.astro` |
| **Varianten** | `fullscreen` (100vh, Vollbild-Foto), `compact` (50vh, für Unterseiten) |
| **Verwendet auf** | Homepage (fullscreen), alle anderen Hauptseiten (compact) |

**fullscreen:**
- Vollbild-Foto (Ladakh-Landschaft oder Lama Samten), `object-cover`
- Gradient-Overlay oben: `bg-gradient-hero`
- Zentriert: H1 (Lora, weiß, display-size), Subline (Source Sans 3, weiß/80%), primärer CTA-Button
- Scrollen-Indicator: animierter Pfeil unten

**compact:**
- 50vh, gleiche Foto-Logik
- H1 linksbündig, kein Scrollen-Indicator
- Breadcrumb optional

---

### 2.4 ImpactZahlen

| Eigenschaft | Detail |
|-------------|--------|
| **Name** | `ImpactZahlen` |
| **Datei** | `src/components/ImpactZahlen.astro` |
| **Beschreibung** | 4 Kacheln mit großer Zahl (Lora Bold), Beschreibung (Source Sans 3), Icon (SVG). Counter-Animation beim Scroll-In via Intersection Observer. |
| **Varianten** | `hell` (weiß auf creme BG), `dunkel` (creme auf ocker BG) |
| **Verwendet auf** | Homepage, Wirkung-Seite |

**Kacheln (Beispielinhalte):**
1. `127` — Kinder in der Nalanda-Schule
2. `340+` — Patienten pro Medical Camp
3. `48` — Patenschaften aktiv
4. `3` — Projekte in Ladakh

---

### 2.5 ProjektKarte

| Eigenschaft | Detail |
|-------------|--------|
| **Name** | `ProjektKarte` |
| **Datei** | `src/components/ProjektKarte.astro` |
| **Beschreibung** | Karte mit Bild (16:9, `object-cover`), farbigem Tag, Titel (Lora), Kurztext, CTA-Link |
| **Varianten** | `horizontal` (Bild links, Text rechts — für Detailseiten), `vertikal` (Karte, für Grid), `featured` (2/3-Breite) |
| **Verwendet auf** | Homepage, Projekte-Übersicht |

---

### 2.6 TeamKarte

| Eigenschaft | Detail |
|-------------|--------|
| **Name** | `TeamKarte` |
| **Datei** | `src/components/TeamKarte.astro` |
| **Beschreibung** | Rundes Foto (1:1), Name (Lora H4), Rolle (Source Sans 3 small, ocker), kurzer Bio-Text, optionale Social-Links |
| **Varianten** | `standard`, `featured` (für Lama Samten: größeres Foto, mehr Text, Link zur Bio-Seite) |
| **Verwendet auf** | Über uns / Team, Homepage (Lama Samten-Sektion) |

---

### 2.7 BlogPostKarte

| Eigenschaft | Detail |
|-------------|--------|
| **Name** | `BlogPostKarte` |
| **Datei** | `src/components/BlogPostKarte.astro` |
| **Beschreibung** | Bild (16:9), Kategorie-Tag (farbig nach Rubrik), Datum, Titel (Lora), Teaser (2 Zeilen, truncated), Lesezeit, Autor-Avatar |
| **Varianten** | `kompakt` (ohne Bild, für Listen), `featured` (volle Breite, prominent), `standard` (3-Spalten-Grid) |
| **Verwendet auf** | Blog-Übersicht, Homepage (Aktuelles-Sektion), Sidebar |

---

### 2.8 NewsletterFormular

| Eigenschaft | Detail |
|-------------|--------|
| **Name** | `NewsletterFormular` |
| **Datei** | `src/components/NewsletterFormular.astro` |
| **Beschreibung** | E-Mail-Feld + Vorname-Feld (optional) + Submit-Button. Inline (1-Zeile) oder gestapelt. Double-Opt-In-Hinweis direkt darunter. |
| **Varianten** | `inline` (im Footer / Sektionen), `fullpage` (auf /newsletter-Seite) |
| **DSGVO** | Pflicht-Checkbox: "Ich stimme der Verarbeitung meiner E-Mail-Adresse für den Newsletter zu (Datenschutzerklärung)." |
| **Verwendet auf** | Footer, Homepage, /newsletter |

**API-Anbindung:** Brevo (ehem. Sendinblue) REST-API oder Netlify Form + Brevo-Webhook.

---

### 2.9 KontaktFormular

| Eigenschaft | Detail |
|-------------|--------|
| **Name** | `KontaktFormular` |
| **Datei** | `src/components/KontaktFormular.astro` |
| **Felder** | Name (required), E-Mail (required), Betreff (Select: Allgemein / Patenschaft / Spende / Presse / Sonstiges), Nachricht (Textarea), DSGVO-Checkbox |
| **Honeypot** | Verstecktes Feld gegen Spam |
| **Submit** | Netlify Forms oder Serverless Function → E-Mail via Brevo Transactional |
| **Verwendet auf** | /kontakt |

---

### 2.10 SpendenBox

| Eigenschaft | Detail |
|-------------|--------|
| **Name** | `SpendenBox` |
| **Datei** | `src/components/SpendenBox.astro` + `src/components/SpendenWidget.astro` |
| **Beschreibung** | Primäres Conversion-Element. Zwei Tabs: „Einmalspende" / „Dauerspende". Betrag-Auswahl (Buttons: 10€, 25€, 50€, 100€, Eigener Betrag). Stripe-Checkout-Button. Bankdaten als Fallback aufklappbar (Accordion). |
| **Varianten** | `sidebar` (schmale Spalte), `fullwidth` (auf /spenden), `minimal` (nur CTA-Button + Betrag) |
| **Verwendet auf** | /spenden, Projektseiten (sidebar), Homepage |

**Stripe-Integration:** Serverless Function (Netlify/Vercel) erstellt Checkout-Session. Kein Stripe.js im statischen Build nötig — Redirect zu Stripe Hosted Checkout.

---

### 2.11 PatenschaftFormular

| Eigenschaft | Detail |
|-------------|--------|
| **Name** | `PatenschaftFormular` |
| **Datei** | `src/components/PatenschaftFormular.astro` |
| **Felder** | Vorname, Nachname, E-Mail, Telefon (optional), Adresse (für Spendenquittung), Zahlungsintervall (monatlich/jährlich), Zahlungsart (Stripe Subscription / Banküberweisung), DSGVO-Checkbox |
| **Ablauf** | Formular → Validierung (client-side + server-side) → Stripe Subscription Checkout (monatl. 35€ oder frei wählbar) → Danke-Seite |
| **Verwendet auf** | /projekte/patenschaft/pate-werden |

---

### 2.12 BaufortschrittTimeline

| Eigenschaft | Detail |
|-------------|--------|
| **Name** | `BaufortschrittTimeline` |
| **Datei** | `src/components/BaufortschrittTimeline.astro` |
| **Beschreibung** | Vertikale Timeline mit Phasen-Einträgen (Datum, Beschreibung, Foto), abgeschlossene Phasen in ocker/grün, aktuelle Phase animiert pulsierend, zukünftige Phasen grau. Fortschrittsbalken oben mit % (z.B. „Bauphase 3 von 5"). |
| **Verwendet auf** | /projekte/nalanda-schule/baufortschritt |

---

### 2.13 Footer

| Eigenschaft | Detail |
|-------------|--------|
| **Name** | `Footer` |
| **Datei** | `src/components/Footer.astro` |
| **Struktur** | 4-spaltig (Desktop), gestapelt (Mobile). Dunkler Hintergrund (`bg-brand-text`), helle Schrift. |
| **Verwendet auf** | Alle Seiten (via BaseLayout) |

**Spalten:**
1. Logo + Kurzbeschreibung (2 Sätze) + Social-Media-Icons
2. Schnelllinks: Projekte, Über uns, Blog, Wirkung
3. Mitmachen: Spenden, Patenschaft, Newsletter, Veranstaltungen
4. Kontakt: Adresse, E-Mail, Bankdaten (kompakt), IBAN sichtbar

**Unterleiste:** © 2026 Himalaya-Haus e.V. | Impressum | Datenschutz | Barrierefreiheit

---

### 2.14 Zitat-Block (QuoteBlock)

| Eigenschaft | Detail |
|-------------|--------|
| **Name** | `QuoteBlock` |
| **Datei** | `src/components/QuoteBlock.astro` |
| **Beschreibung** | Großes dekoratives Anführungszeichen (ocker), Text in Lora Italic, Autor mit rundem Foto, Subtext (Rolle). Optional: volle Sektionsbreite mit ocker/creme-Hintergrund. |
| **Verwendet auf** | Homepage, Lama Samten Bio, Projektseiten |

---

### 2.15 WirkungsRechner

| Eigenschaft | Detail |
|-------------|--------|
| **Name** | `WirkungsRechner` |
| **Datei** | `src/components/WirkungsRechner.astro` |
| **Beschreibung** | Slider oder Betrag-Buttons (10€–1000€). Dynamische Ausgabe: „Mit 50€ finanzieren Sie 14 Schultage für ein Kind." Werte statisch hinterlegt als JSON-Map. |
| **Verwendet auf** | /wirkung, /spenden |

---

### 2.16 Weitere Hilfs-Komponenten

| Name | Datei | Beschreibung |
|------|-------|--------------|
| `Breadcrumb` | `src/components/Breadcrumb.astro` | Navigation oben auf Unterseiten |
| `TagBadge` | `src/components/TagBadge.astro` | Farbige Kategorie-Tags (Blog, Projekte) |
| `CookieBanner` | `src/components/CookieBanner.astro` | DSGVO-Cookie-Consent, kompakt unten |
| `DankeSeite` | `src/pages/danke.astro` | Nach Spende/Patenschaft, mit Social-Share |
| `BildGalerie` | `src/components/BildGalerie.astro` | Lightbox-Grid für Projektfotos |
| `VideoEmbed` | `src/components/VideoEmbed.astro` | YouTube privacy-enhanced embed |
| `AlertBanner` | `src/components/AlertBanner.astro` | Temporäre Kampagnen-Banner (Spendenaktionen) |

---

## 3. PAGE LAYOUTS

### 3.1 Homepage (`/`)

```
1. Header (transparent → sticky solid beim Scroll)
2. Hero [fullscreen]
   - Foto: Lama Samten in Ladakh-Landschaft oder Schulbaustelle
   - H1: "Bildung für Kinder in Ladakh." (Lora)
   - Sub: "Lama Konchok Samten baut eine Schule — mit Ihrer Hilfe."
   - CTA: [Jetzt unterstützen] [Mehr erfahren ↓]
3. ImpactZahlen [bg: creme] — 4 Kacheln
4. 3 Projekte [bg: white]
   - H2: "Unsere drei Projekte"
   - 3x ProjektKarte (vertikal, 3-Spalten-Grid)
5. Lama Samten Intro [bg: creme, 2-Spalten]
   - Links: TeamKarte (featured) + QuoteBlock
   - Rechts: Fliesstext (400 Wörter), CTA → /ueber-uns/lama-samten
6. Baufortschritt Teaser [bg: ocker-Gradient]
   - Fortschrittsbalken Nalanda-Schule, aktueller Status, CTA → /projekte/nalanda-schule
7. WirkungsRechner [bg: creme]
   - H2: "Was bewirkt Ihre Spende?"
   - Slider + dynamischer Text
8. SpendenBox [bg: white, zentriert, max-w-2xl]
   - Tabs: Einmalspende / Dauerspende
   - Betrag-Auswahl + Stripe-Button
9. QuoteBlock [bg: brand-text] — Zitat Lama Samten
10. Aktuelles aus dem Blog [bg: creme]
    - H2: "Aktuelles"
    - 3x BlogPostKarte (featured + 2 standard)
11. NewsletterFormular [bg: ocker-Gradient, zentriert]
    - H2: "Bleiben Sie verbunden"
    - inline Formular
12. Footer
```

---

### 3.2 Über uns (`/ueber-uns`)

```
1. Header
2. Hero [compact] — Gruppen-Foto Team oder Lama Samten + Oliver
3. Einleitung [bg: creme] — H2 "Wer wir sind", 3 Spalten: Mission / Vision / Werte
4. Gründungsgeschichte [bg: white, 2-Spalten]
   - Links: Fliesstext "Frankfurt trifft Ladakh, 2017"
   - Rechts: Timeline 2017–2026 (Meilensteine)
5. Team [bg: creme]
   - H2: "Unser Team"
   - Grid: Lama Samten (featured), Oliver, Clarissa, weitere Ehrenamtliche
6. Transparenz-Teaser [bg: brand-text]
   - H2: "Transparenz ist uns wichtig"
   - Icons: Jahresbericht PDF, Vereinssatzung PDF, Steuerbescheid
   - CTA → /ueber-uns/transparenz
7. Partner [bg: creme] — Logo-Leiste
8. Footer
```

---

### 3.3 Lama Samten Bio (`/ueber-uns/lama-samten`)

```
1. Header
2. Hero [fullscreen] — Portrait-Foto Lama Samten (Robe, Berge)
   - H1: "Lama Konchok Samten"
   - Sub: "Mönch. Brückenbauer. Gründer."
3. Bio-Einleitung [bg: creme, prose-width, zentriert]
   - H2: "Zwischen zwei Welten"
   - Langer Fliesstext (1.500 Wörter, Lora für Leitstze, Source Sans für Body)
4. Foto-Essay [bg: white] — BildGalerie, 3-4 Spalten, verschiedene Kontexte
5. QuoteBlock [bg: brand-text] — persönliches Zitat
6. Drikung-Kagyü Hintergrund [bg: creme, 2-Spalten]
   - Text über Tradition + Video-Embed (Mandala-Zeremonie)
7. Mandala-Tournee [bg: white]
   - nächste Termine, CTA → /veranstaltungen
8. Von Lama Samten (Blog-Rubrik) [bg: creme]
   - 3x BlogPostKarte (kompakt)
   - CTA → /blog/von-lama-samten
9. Footer
```

---

### 3.4 Nalanda Schule (`/projekte/nalanda-schule`)

```
1. Header
2. Hero [compact] — Schulbau-Foto, H1 "Nalanda-Schule — Saboo, Ladakh"
3. Projekt-Intro [bg: creme, 2-Spalten]
   - Links: Kernfakten (Ort, Kapazität, Baustart, Fertigstellung geplant)
   - Rechts: Kurztext Projektgeschichte
4. BaufortschrittTimeline [bg: white] — volle Breite
   - Fortschrittsbalken + Phasen-Timeline
5. Das Konzept [bg: creme] — 3 Spalten: Ökologisches Bauen / Lokale Materialien / Passivhaus-Prinzipien
6. Foto-Galerie [bg: white] — BildGalerie Bauphasen
7. Wirkung [bg: brand-text] — ImpactZahlen (spezifisch für Schule)
8. SpendenBox [bg: creme] — sidebar + H2 "Bauen Sie mit"
9. Footer
```

---

### 3.5 Patenschaft (`/projekte/patenschaft`)

```
1. Header
2. Hero [compact] — Kind beim Lernen, H1 "Eine Patenschaft — ein Kinderleben verändert"
3. Wie es funktioniert [bg: creme]
   - H2: "So funktioniert die Patenschaft"
   - 4-Schritte-Prozess (Icons + Kurztext): Anmelden → Match → Briefwechsel → Jahresupdate
4. Was bekommt der Pate [bg: white, 2-Spalten]
   - Liste: Jahreszertifikat, Fotos, Schulberichte, direkter Kontakt (DSGVO-konform)
5. Was bewirkt die Patenschaft [bg: creme] — WirkungsRechner (auf 35€/Monat kalibriert)
6. Anonymisierte Paten-Geschichte [bg: brand-text] — QuoteBlock
7. Patenschaft-Anmeldung [bg: white]
   - H2: "Jetzt Pate werden"
   - PatenschaftFormular (vollständig)
   - DSGVO-Hinweis darunter
8. Footer
```

---

### 3.6 Medical Camp (`/projekte/medical-camp`)

```
1. Header
2. Hero [compact] — Camp-Foto (Ärzte, Patienten), H1 "Medical Camp Ladakh"
3. In Zahlen [bg: creme] — ImpactZahlen (campspezifisch: Patienten, Ärzte, Jahre, Orte)
4. Ablauf [bg: white]
   - H2: "Wie ein Camp abläuft"
   - Horizontale Timeline (Vorbereitung → Anreise → Einsatz → Nachbereitung)
   - Fotoreportage-Grid
5. Mitmachen [bg: creme, 2-Spalten]
   - Links: "Als Arzt teilnehmen" — Kontakt-CTA
   - Rechts: SpendenBox (minimal, zweckgebunden "Medical Camp")
6. QuoteBlock [bg: brand-text] — Zitat teilnehmender Arzt
7. Footer
```

---

### 3.7 Wirkung (`/wirkung`)

```
1. Header
2. Hero [compact] — Kinderfotos, H1 "Ihre Wirkung in Ladakh"
3. WirkungsRechner [bg: creme] — groß, prominente Darstellung
4. ImpactZahlen [bg: white] — Gesamt-Zahlen aller Projekte
5. Mittelverwendung [bg: creme]
   - H2: "Wo Ihre Spende hingeht"
   - Donut-Chart (SVG/CSS): Projektarbeit 85% / Verwaltung 10% / Rücklagen 5%
6. Zeitstrahl [bg: white] — Organisation 2017–2026, Meilensteine
7. Testimonials [bg: brand-text] — 3x QuoteBlock (Paten, Ärzte, Lama Samten)
8. SpendenBox [bg: creme]
9. Footer
```

---

### 3.8 Blog-Übersicht (`/blog`)

```
1. Header
2. Hero [compact, kein Foto] — H1 "Blog & Berichte aus Ladakh", Lora, bg-brand-creme
3. Kategorie-Filter [bg: creme] — Tag-Buttons (alle / von Lama Samten / aus Ladakh / Projektberichte / Buddhismus)
4. Featured Post [bg: white] — BlogPostKarte (featured, volle Breite)
5. Post-Grid [bg: creme] — 3-Spalten-Grid, BlogPostKarte (standard), Pagination
6. NewsletterFormular [bg: ocker-Gradient]
7. Footer
```

---

### 3.9 Blog-Artikel (`/blog/[slug]`)

```
1. Header
2. Hero [compact] — Artikel-Hauptbild
3. Artikel [bg: white]
   - Breadcrumb
   - Kategorie-Tag + Datum + Lesezeit + Autor-Avatar
   - H1 (Lora, groß)
   - Prose-Content (max-w-prose, @tailwindcss/typography, angepasst mit brand-Farben)
   - Pull Quotes: Lora Italic, ocker links-border
4. Teilen [bg: creme] — Social-Share-Buttons
5. Autor-Box [bg: white] — TeamKarte (kompakt: Lama Samten oder Oliver)
6. Weitere Artikel [bg: creme] — 3x BlogPostKarte (kompakt, gleiche Kategorie)
7. NewsletterFormular [bg: ocker-Gradient]
8. Footer
```

---

### 3.10 Newsletter (`/newsletter`)

```
1. Header
2. Hero [compact, kein Foto] — H1 "Briefe aus Ladakh", Sub "Jeden Monat schreibt Lama Samten persönlich"
3. Vorschau [bg: creme, 2-Spalten]
   - Links: Beispiel-Ausgabe (Screenshot/Card)
   - Rechts: Was Sie erwartet (3 Bullet-Points), Frequenz-Info
4. NewsletterFormular [bg: white] — fullpage-Variante
   - Vorname + E-Mail + Checkbox DSGVO
5. Archiv [bg: creme] — letzte 6 Newsletter als Card mit Link
6. Footer
```

---

### 3.11 Spenden (`/spenden`)

```
1. Header
2. Hero [compact] — abstraktes Ladakh-Bild, H1 "Helfen Sie mit — direkt und transparent"
3. SpendenBox [bg: creme] — fullwidth, zentriert
   - Tab: Einmalspende / Dauerspende / Patenschaft
   - Betrag-Buttons + Stripe-CTA + Bankdaten (Accordion)
4. WirkungsRechner [bg: white]
5. Mittelverwendung [bg: creme] — Donut-Chart + Kurztext (gleich wie /wirkung)
6. Vertrauen [bg: brand-text]
   - Icons: e.V. eingetragen / Finanzamt Frankfurt / DSGVO-konform / SSL-verschlüsselt
7. FAQ [bg: creme] — Accordion: Spendenquittung? / Widerruf Dauerspende? / SEPA-Mandat? / Wie werde ich informiert?
8. Footer
```

---

### 3.12 Kontakt (`/kontakt`)

```
1. Header
2. Hero [compact, kein Foto] — H1 "Kontakt", bg-brand-creme
3. Kontakt-Block [bg: white, 2-Spalten]
   - Links: KontaktFormular
   - Rechts: Adresse, E-Mail, Telefon (optional), Ansprechpartner (TeamKarte kompakt)
4. Karte (optional) [bg: creme] — statisches Google-Maps-Bild (privacy-konform, kein iFrame)
5. Footer
```

---

## 4. NAVIGATION

### 4.1 Desktop-Navigation

**Sticky Header:** Ja. Verhalten:
- Scrollposition 0–80px: `bg-transparent`, Logo + Links weiß (über Hero-Foto)
- Scrollposition >80px: `bg-brand-creme/95 backdrop-blur-sm shadow-card`, Text `brand-text`, smooth transition (CSS `transition-all duration-300`)

**Struktur (5 Top-Level-Items):**

```
[Logo: Himalaya-Haus]     [Über uns ▾]  [Projekte ▾]  [Blog]  [Wirkung]     [Jetzt spenden →]
```

**Dropdown: Über uns**
```
├── Unsere Geschichte
├── Lama Konchok Samten
├── Team
└── Transparenz
```

**Dropdown: Projekte**
```
├── Nalanda-Schule
│   ├── Baufortschritt
│   └── Geschichte
├── Patenschaft
│   └── Pate werden
└── Medical Camp
    └── Mitmachen
```

**Dropdown-Verhalten:**
- Trigger: Hover (Desktop) + Click/Touch (Mobile)
- Animation: `opacity 0→1 + translateY(-4px→0)`, 150ms ease-out
- Dropdown-Box: `bg-white shadow-card-lg rounded-card py-2`, Mindestbreite 220px
- Aktiver Link: linke Border `border-l-2 border-brand-ocker pl-3`

**CTA-Button:** `bg-brand-ocker hover:bg-brand-ocker-dark text-white font-semibold px-5 py-2 rounded-full shadow-btn transition-colors`

---

### 4.2 Mobile-Navigation

**Hamburger-Button:** 44×44px Touch-Target, `bg-transparent`, 3 Balken in `brand-text` (bei transparent Header: weiß)

**Mobile Menu Overlay:**
- Volles Viewport, `bg-brand-creme`, z-index 50
- Logo oben links, X-Button oben rechts
- Links: vertikal gestapelt, Lora 1.5rem, `py-4 border-b border-brand-creme-dark`
- Untermenüs: Accordion (Pfeil-Icon dreht sich), gleiches Padding, Source Sans 3 1rem, ocker
- Unten fixiert: `[Jetzt spenden]`-Button (full-width, ocker)
- Animation: `translateX(100% → 0)`, 200ms ease-out (Slide-in von rechts)

---

### 4.3 Footer-Struktur

**Layout:** 4 Spalten Desktop, 2×2 Tablet, 1 Spalte Mobile

```
┌─────────────────────┬──────────────────┬──────────────────┬──────────────────┐
│  [Logo]             │  Organisation    │  Mitmachen       │  Kontakt         │
│  Kurzbeschreibung   │  ─────────────   │  ─────────────   │  ─────────────   │
│  (2 Sätze)          │  Über uns        │  Jetzt spenden   │  Adresse         │
│                     │  Lama Samten     │  Pate werden     │  E-Mail          │
│  [FB] [IG] [YT]     │  Nalanda-Schule  │  Newsletter      │  IBAN (kompakt)  │
│                     │  Patenschaft     │  Veranstaltungen │  Kontaktformular │
│                     │  Medical Camp    │  Blog            │                  │
│                     │  Wirkung         │                  │                  │
└─────────────────────┴──────────────────┴──────────────────┴──────────────────┘
[© 2026 Himalaya-Haus e.V. — Eingetragener Verein, Frankfurt]  [Impressum] [Datenschutz] [Barrierefreiheit]
```

**Footer-Design:** `bg-brand-text text-brand-creme`, Links `hover:text-brand-ocker`, Unterleiste `bg-black/20`

---

## 5. USER JOURNEYS

### Journey 1: Spontanspender

**Profil:** Kommt über Social Media (Foto von Lama Samten / Schulbau-Video), emotional bewegt, hat 2–5 Minuten.

```
Einstieg: Social-Media-Post → Homepage
    ↓
Hero: Vollbild-Foto + "Bildung für Kinder in Ladakh" + [Jetzt unterstützen]
    ↓
ImpactZahlen: 127 Kinder, 48 Patenschaften — Vertrauen aufgebaut in 10 Sekunden
    ↓
WirkungsRechner (Scroll): "50€ = 14 Schultage" — emotionale Verbindung hergestellt
    ↓
SpendenBox (Homepage): Betrag-Auswahl, [Jetzt spenden mit Stripe] → Stripe Checkout
    ↓
Conversion: Stripe Hosted Checkout (3–4 Felder, Karte/Klarna/PayPal)
    ↓
Danke-Seite (/danke): "Vielen Dank! Ihr Beitrag macht einen Unterschied."
    ↓
Post-Conversion: [Newsletter abonnieren] + [Freunden erzählen] → Multiplikation
```

**Kritische Design-Entscheidung:** SpendenBox muss ohne Scroll auf Desktop sichtbar sein (above the fold). Keine Registrierung vor der Zahlung.

---

### Journey 2: Paten-Suchender

**Profil:** Sucht aktiv nach Kinderpatenschaft, informiert, bereit für Commitment, vergleicht Organisationen.

```
Einstieg: Google "Kinderpatenschaft Ladakh" oder "Patenschaft Buddhismus" → /projekte/patenschaft
    ↓
Hero: Emotionales Bild, H1 "Eine Patenschaft — ein Kinderleben verändert"
    ↓
Wie es funktioniert: 4-Schritte-Prozess — Transparenz erzeugt Vertrauen
    ↓
Verweilen: Liest anonymisierte Paten-Geschichte (QuoteBlock)
    ↓
WirkungsRechner: "35€/Monat = Schuljahr finanziert" — konkrete Verbindung
    ↓
PatenschaftFormular: Name, E-Mail, Adresse, [Weiter zur Zahlung]
    ↓
Conversion: Stripe Subscription Checkout (35€/Monat, SEPA oder Karte)
    ↓
Danke-Seite + automatische E-Mail (Bestätigung + "Ihr Kind wird sich freuen")
    ↓
Post-Conversion: Willkommensserie (4 Mails via Brevo) → Dauerspender-Bindung
```

**Kritische Design-Entscheidung:** Patenschaft-Formular und Stripe-Step in einer Seite, kein mehrseitiger Wizard (zu viel Abbruch). Stripe erscheint direkt nach Validierung.

---

### Journey 3: Blog-Leser / Newsletter-Abonnent

**Profil:** Interessiert an Buddhismus oder Ladakh, findet einen Artikel via Google Long-Tail-Keyword, kein sofortiger Spende-Intent.

```
Einstieg: Google "Drikung Kagyü Frankfurt" oder "Buddhismus Ladakh" → Blog-Artikel
    ↓
Artikel-Seite: Liest vollständig (Prose-Typografie, Lama Samtens Stimme)
    ↓
Autor-Box am Ende: TeamKarte Lama Samten → [Zur Bio-Seite]
    ↓
Lama Samten Bio: Lebensgeschichte, Fotos, Video — Vertrauen und Identifikation
    ↓
Weitere Artikel-Empfehlungen (gleiche Kategorie) → zweiter Artikel
    ↓
NewsletterFormular (nach Artikel, prominent): "Jeden Monat ein Brief aus Ladakh"
    ↓
Conversion: Newsletter-Anmeldung (nur E-Mail + Vorname)
    ↓
Willkommens-Mail (Brevo, sofort): "Ich freue mich, Ihnen schreiben zu dürfen. — Lama Samten"
    ↓
Mail 3 (Tag 7): WirkungsRechner-Moment → erste Spende ausgelöst
```

**Kritische Design-Entscheidung:** NewsletterFormular nach jedem Artikel (nicht als Popup — stört Leseerlebnis). Artikel-Ende ist der natürlichste Moment für Anmeldung.

---

## 6. CONVERSION-STRATEGIE MIT ONLINE-ZAHLUNG

### 6.1 Stripe-Integration — technische Architektur

**Empfehlung für V1: Serverless Function (kein selbst gehostetes Backend nötig)**

```
Astro (statisch) → Netlify/Vercel Edge Function → Stripe API → Stripe Hosted Checkout
```

**Ablauf:**
1. Nutzer wählt Betrag und Typ (einmalig/monatlich) im SpendenWidget
2. Klick auf „Jetzt spenden" → POST-Request an `/api/create-checkout` (Netlify Function)
3. Function erstellt `stripe.checkout.sessions.create()` mit:
   - `mode: 'payment'` (Einmalspende) oder `mode: 'subscription'` (Dauerspende/Patenschaft)
   - `success_url: 'https://himalayahaus.de/danke?session_id={CHECKOUT_SESSION_ID}'`
   - `cancel_url: 'https://himalayahaus.de/spenden'`
   - `locale: 'de'`
   - Metadaten: Projektbezug (Nalanda-Schule / Medical Camp / Allgemein)
4. Function gibt `session.url` zurück → Client leitet weiter (`window.location.href`)
5. Stripe Hosted Checkout: alle PCI-Compliance-Anforderungen von Stripe abgedeckt

**Netlify Function (`netlify/functions/create-checkout.ts`):**
```ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-04-10' });

export default async (req: Request) => {
  const { amount, mode, project } = await req.json();

  const session = await stripe.checkout.sessions.create({
    mode,
    locale: 'de',
    payment_method_types: ['card', 'sepa_debit', 'klarna', 'paypal'],
    line_items: [{
      price_data: {
        currency: 'eur',
        unit_amount: amount * 100,
        product_data: {
          name: `Spende für Himalaya-Haus e.V. — ${project}`,
          description: 'Spendenquittung wird per E-Mail zugesandt',
        },
        ...(mode === 'subscription' ? { recurring: { interval: 'month' } } : {}),
      },
      quantity: 1,
    }],
    success_url: `${process.env.URL}/danke?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.URL}/spenden`,
    metadata: { project },
  });

  return new Response(JSON.stringify({ url: session.url }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
```

**Stripe Webhook** (`/api/stripe-webhook`):
- Event `checkout.session.completed` → Transaktions-E-Mail via Brevo senden
- Event `invoice.payment_failed` → Hinweis-Mail an Dauerspender

**V1-Fallback: Stripe Payment Links** (zero-code, sofort einsetzbar)
Falls die Serverless Function zu aufwändig ist für den Launch: Stripe Payment Links direkt verlinken (vorkonfigurierte Beträge 10/25/50/100€). Kein eigener Code nötig, aber weniger Kontrolle über Look & Feel.

---

### 6.2 Spendenbutton-Platzierung

| Ort | Variante | Sichtbarkeit |
|-----|----------|-------------|
| **Header (sticky)** | Pill-Button, brand-ocker | Jede Seite, immer sichtbar |
| **Homepage Above Fold** | CTA im Hero | Sofort sichtbar |
| **Homepage SpendenBox** | fullwidth Widget, nach Scroll | ~50% der Besucher erreichen es |
| **Jede Projektseite** | SpendenBox (sidebar oder nach Content) | Kontext-nahe Platzierung |
| **Nach jedem Blog-Artikel** | minimal SpendenBox (before Newsletter CTA) | Leser nach Emotion ansprechen |
| **Wirkung-Seite** | fullwidth nach WirkungsRechner | Maximale Entscheidungs-Nähe |
| **Footer** | Text-Link "Jetzt spenden" | Letzter Touchpoint |
| **/danke-Seite** | "Dauerspende einrichten?" | Upsell nach Einmalspende |

**Kein Spendenbutton auf:** Impressum, Datenschutz, Barrierefreiheit-Seiten (nicht ablenken von Pflichtseiten).

---

### 6.3 Patenschaft — Zahlungsarchitektur

**Empfehlung: Eigenes Formular + Stripe Subscription Checkout**

```
PatenschaftFormular (Astro) → /api/create-subscription → Stripe Subscription Checkout
```

- Monatlicher Betrag: 35€ (vorausgefüllt, frei änderbar, Minimum 20€)
- Zahlungsarten: Karte + SEPA-Lastschrift (besonders wichtig für Dauerspenden)
- Stripe Subscription erstellt automatisch wiederkehrende Abbuchung
- Patenschaft-Daten (Name, Adresse) werden zusätzlich via Netlify Form + Brevo-Workflow gespeichert (für Spendenquittungen nach § 10b EStG)

**Warum nicht Stripe Payment Links für Patenschaft:**
Payment Links haben keine Formular-Vorfelder für Adresse/Name → Spendenquittung nicht ausstellbar. Eigene Function nötig.

---

### 6.4 Nach erfolgreicher Zahlung — Post-Conversion-Flow

**Danke-Seite (`/danke`):**
```
- Großes Dankeschön-Element (ocker, Lora, emotional)
- Konkreter Satz: "Ihre [Betrag]€ finanzieren [X Schultage / Y Schüler-Wochen]"
  (aus Stripe session metadata ausgelesen via Client-Side-Fetch)
- [Newsletter abonnieren] — wichtigster zweiter Schritt
- [Teilen auf WhatsApp / Facebook] — Multiplikations-Moment
- [Weitere Projekte entdecken] — bindet Interesse
- Hinweis: "Spendenquittung erhalten Sie per E-Mail innerhalb von 3 Werktagen"
```

**Automatische E-Mails (Brevo Transactional):**

| Trigger | Empfänger | Inhalt |
|---------|-----------|--------|
| `checkout.session.completed` | Spender | Bestätigung + Danke + Spendenhinweis + Logo |
| `checkout.session.completed` (Patenschaft) | Spender | Willkommen als Pate + nächste Schritte + Lama Samtens Zitat |
| `checkout.session.completed` | Intern (NGO-Team) | Neue Spende/Patenschaft: Name, Betrag, Projekt |
| Monatlich (Subscription) | Dauerspender | Kurzer "Danke + Update" — verhindert Kündigungen |
| `invoice.payment_failed` | Dauerspender | Freundliche Nachricht, SEPA aktualisieren |

---

### 6.5 DSGVO-Anforderungen bei Zahlungsformularen

**Pflichtbestandteile vor/bei jeder Zahlung:**

1. **Checkbox (nicht vorangehakt):**
   > "Ich stimme zu, dass meine personenbezogenen Daten (Name, E-Mail, Adresse) zur Abwicklung meiner Spende und — falls zutreffend — zur Ausstellung einer Spendenquittung verarbeitet werden. Weitere Informationen: [Datenschutzerklärung]"

2. **SEPA-Mandat-Text** (bei SEPA-Lastschrift, Pflicht):
   > "Ich ermächtige Himalaya-Haus e.V. / Stripe Technology Europe, Zahlungen von meinem Konto mittels Lastschrift einzuziehen. Gläubiger-ID: [DE...]. Mandate-Referenz: wird nach Abschluss zugesendet."

3. **Transparenz-Hinweis** im Formular:
   > "Zahlungsabwicklung erfolgt verschlüsselt über Stripe (PCI-DSS Level 1). Himalaya-Haus e.V. speichert keine Kreditkartendaten."

4. **Cookie-Consent** für Stripe.js:
   > Stripe.js setzt funktionale Cookies (keine Marketing-Cookies) — Kategorie "Notwendig" im Cookie-Banner, kein Opt-in nötig. Dennoch in Datenschutzerklärung dokumentieren (Art. 13 DSGVO).

5. **Datenschutzerklärung** muss enthalten:
   - Stripe als Auftragsverarbeiter (Art. 28 DSGVO — Auftragsverarbeitungsvertrag mit Stripe abschließen)
   - Brevo als Auftragsverarbeiter (E-Mail-Versand)
   - Zweck, Rechtsgrundlage (Art. 6 Abs. 1 lit. b — Vertragserfüllung / lit. c — gesetzliche Pflicht für Spendenquittungen)
   - Speicherdauer (10 Jahre für steuerrelevante Daten — Abgabenordnung § 147)
   - Widerrufsrecht Dauerspende: per E-Mail oder über Stripe Kundenportal

6. **Spendenquittung:**
   - Bei Beträgen ≤ 300€ (Kleinbetragsquittung): einfacher Kontoauszug reicht laut §10b EStG
   - Bei Beträgen > 300€: Zuwendungsbestätigung nach amtlichem Muster Pflicht
   - Automation: Brevo-Template + Jahres-Sammelquittung (Januar des Folgejahres, automatisiert via Webhook + Datenbankquery)

---

### 6.6 Payment-Provider-Auswahl Zusammenfassung

| Kriterium | Stripe | PayPal |
|-----------|--------|--------|
| Gebühren (Karte EU) | 1,5% + 0,25€ | 2,49% + 0,35€ |
| SEPA-Lastschrift | Ja (0,35€ + 0,1%) | Nein (SEPA) |
| Subscription/Abo | Vollständig | Eingeschränkt |
| Stripe-Patenschaft möglich | Ja | Nein (ohne Umweg) |
| Vertrauen bei 40+ Spendern | Mittel | Hoch |
| Setup-Aufwand | Mittel (Function nötig) | Niedrig (Button reicht) |

**Empfehlung V1:** Stripe als Primärprovider (alle Features), PayPal als optionalen Zahlungsweg **innerhalb** des Stripe-Checkouts einbinden (Stripe unterstützt PayPal als Payment Method) — so ein System, maximale Abdeckung.

---

*Spezifikation erstellt: Mai 2026 | Himalaya-Haus e.V. Relaunch-Team*
*Astro + Tailwind CSS + Netlify + Stripe + Brevo*
