# Himalaya-Haus e.V. — Master-SPEC Website-Prototyp

**Version 1.0 | Mai 2026 | Konsolidiert aus drei Expertenrunden**

---

## EXECUTIVE SUMMARY

Website-Prototyp für himalayahaus.de auf Basis Astro 4 + Tailwind CSS 3 + Alpine.js.
Statisch generiert, deployt auf Netlify, kein Cookie-Banner notwendig.
Spendenintegration über Stripe Payment Links (Einmalspende + Dauerspende + Patenschaft).
Kein Produktshop in Version 1.

---

## FINALE ENTSCHEIDUNGEN (nicht mehr verhandelbar)

| Thema | Entscheidung | Begründung |
|-------|-------------|------------|
| CMS | Ablösung Joomla durch Astro 4 | Joomla 3 EoL seit 2023; Astro = Zero-JS, perfekte Core Web Vitals |
| Framework | Astro 4.x + Tailwind CSS 3.x + Alpine.js | Kein React-Overhead, wartbar für Ehrenamtliche |
| Blog | Astro Content Collections + Markdown | Zod-validiert, typsicher, einfaches Bearbeiten |
| Hosting | Netlify Free Tier | DE-Edge, kostenlos, CI/CD automatisch, _redirects für Joomla-Migration |
| Fonts | Bunny Fonts CDN (DSGVO-konform) | Keine Cookie-Pflicht, kein US-Server-Kontakt |
| Analytics | Kein Analytics in V1 | Plausible ($9/Mo) für V2 vorbereitet |
| Cookie-Banner | Nicht notwendig | Kein JS-Widget von Brevo/Formspree, kein Google Analytics |
| Newsletter | Brevo (HTML POST, kein JS) | DSGVO-konform, kein Cookie-Consent |
| Kontakt | Formspree (HTML POST + Honeypot) | 50 Submissions/Monat kostenlos, ausreichend |
| Payment | Stripe Payment Links → V1.1: Netlify Functions | Sofort deploybar ohne Backend; Karte + SEPA + Klarna + PayPal |
| Shop | Nicht in Version 1 | Steuerliche Prüfung offen |

---

## POSITIONING

**Variante A** (wenn Hero-Visual Lama Samten zeigt):
> "Ein Mönch aus Ladakh. Ein Verein aus Frankfurt. Eine Schule, die gerade gebaut wird."

**Variante B** (wenn Hero-Visual Schulprojekt / Kinder zeigt):
> "Weil Kinder in Ladakh dieselben Chancen verdienen — und weil wir die Verbindung haben, es möglich zu machen."

---

## DESIGN SYSTEM

### Farbpalette

```
brand-ocker:       #C17F45   (Primär — Lehmmauern, Himalaya-Erde)
brand-erde:        #8B5E2F   (Primär dunkel — Tiefe, Verwurzelung)
brand-rot:         #8B2E2E   (Sekundär — Mönchsrobe, Tradition)
brand-blau:        #4A7FA5   (Akzent — Himalaya-Himmel, Klarheit)
brand-creme:       #F9F4EE   (Hintergrund — Wärme, Papier)
brand-text:        #2D2D2D   (Text — Anthrazit, Lesbarkeit)
brand-ocker-light: #D9A472   (Hover-State Ocker)
brand-ocker-dark:  #9E6330   (Active-State Ocker)
brand-blau-light:  #6DA0C0   (Hover-State Blau)
brand-creme-dark:  #EDE5D8   (Sektion-Hintergrund alternativ)
```

### Typografie

```
Headlines:  Lora (Serifen, Google / Bunny Fonts)
Body:       Source Sans 3 (Humanistische Sans)
Quotes:     Lora Italic
```

Type Scale (fluid):
- display:  clamp(2.5rem, 5vw, 4rem)   — Hero-Überschriften
- h1:       clamp(2rem, 4vw, 3rem)
- h2:       clamp(1.5rem, 3vw, 2.25rem)
- h3:       clamp(1.25rem, 2.5vw, 1.75rem)
- body-lg:  1.125rem / 1.7
- body:     1rem / 1.7

### Buttons

```
Primary:   bg-gradient-cta (#C17F45→#8B5E2F), text-white, shadow-btn
           Hover: scale-105, shadow-lg
Secondary: border-2 border-brand-ocker, text-brand-ocker, bg-transparent
           Hover: bg-brand-ocker, text-white
Ghost:     text-brand-ocker underline
           Hover: no-underline, text-brand-erde
Danger:    bg-brand-rot, text-white (für kritische CTAs)
```

### Karten

```
bg-white, rounded-card (0.75rem), shadow-card, hover:shadow-card-lg
Transition: 200ms ease-out
```

---

## URL-ARCHITEKTUR

| Route | Seite | Typ |
|-------|-------|-----|
| `/` | Homepage | Statisch |
| `/ueber-uns/` | Vereinsgeschichte, Team | Statisch |
| `/ueber-uns/lama-konchok/` | Bio Lama Konchok Samten | Statisch |
| `/ueber-uns/vorstand/` | Vorstand, Transparenz | Statisch |
| `/projekte/` | Projektübersicht | Statisch |
| `/projekte/nalanda-schule/` | Hauptprojekt Schulbau | Dynamisch (SSG) |
| `/projekte/patenschaft/` | Kinderpatenschaft Infos | Dynamisch (SSG) |
| `/projekte/medical-camp/` | Medical Camp | Dynamisch (SSG) |
| `/unterstuetzen/` | Unterstützen Übersicht | Statisch |
| `/unterstuetzen/spenden/` | Stripe Spenden-Seite | Statisch |
| `/unterstuetzen/patenschaft/` | Patenschaft + Stripe Sub | Statisch |
| `/wirkung/` | Wirkungsseite | Statisch |
| `/blog/` | Blog-Übersicht | Statisch |
| `/blog/[slug]/` | Blog-Artikel | Dynamisch (SSG) |
| `/blog/seite/[page]/` | Paginierung | Dynamisch (SSG) |
| `/kontakt/` | Kontaktformular | Statisch |
| `/danke/` | Post-Payment Danke-Seite | Statisch |
| `/impressum/` | Pflichtangaben | Statisch |
| `/datenschutz/` | DSGVO-Erklärung | Statisch |
| `/rss.xml` | RSS-Feed | SSG Endpoint |

---

## KOMPONENTEN-INVENTAR

| Komponente | Datei | Varianten | Verwendet auf |
|-----------|-------|-----------|---------------|
| Header | `Header.astro` | Standard (transparent→solid bei Scroll) | Alle Seiten via BaseLayout |
| Footer | `Footer.astro` | Standard (4-spaltig) | Alle Seiten via BaseLayout |
| Hero | `Hero.astro` | fullscreen, compact | Homepage, Projektseiten |
| ImpactZahlen | `ImpactZahlen.astro` | hell, dunkel | Homepage, Wirkung |
| ProjektKarte | `ProjektKarte.astro` | vertikal, horizontal, featured | Projektübersicht, Homepage |
| BlogPostKarte | `BlogPostKarte.astro` | standard, kompakt, featured | Blog, Homepage |
| SpendenBox | `SpendenBox.astro` | fullwidth, sidebar, minimal | Homepage, Projektseiten, Spenden |
| WirkungsRechner | `WirkungsRechner.astro` | — (Alpine.js) | Homepage, Wirkung |
| NewsletterFormular | `NewsletterFormular.astro` | inline, fullpage | Homepage, Newsletter-Seite |
| KontaktFormular | `KontaktFormular.astro` | — | Kontakt |
| BaufortschrittTimeline | `BaufortschrittTimeline.astro` | — | Nalanda Schule, Homepage Teaser |
| QuoteBlock | `QuoteBlock.astro` | klein, groß | Alle Seiten |
| Breadcrumb | `Breadcrumb.astro` | — | Alle Unterseiten |
| PatenschaftFormular | `PatenschaftFormular.astro` | — | Patenschaft |

---

## NAVIGATION

### Desktop (Sticky Header)

```
Scrollposition 0–80px:  transparent, weiße Links (auf Hero)
Scrollposition >80px:   bg-brand-creme/95 backdrop-blur, shadow-card — 300ms smooth

Logo | Über uns ▾ | Projekte ▾ | Blog | Wirkung | [Jetzt spenden →]
```

Dropdowns:
- Über uns: Der Verein / Lama Konchok Samten / Jahresberichte
- Projekte: Nalanda Schule / Patenschaft / Medical Camp

### Mobile

Hamburger → Vollbild-Overlay (Slide-in rechts, 200ms, Alpine.js)
Accordion für Untermenüs, roter Spenden-Button unten fixiert.

### Footer (4 Spalten, bg-brand-text)

```
Spalte 1: Logo + Tagline + Social (Instagram, Facebook)
Spalte 2: Organisation (Über uns, Team, Transparenz, Jahresberichte)
Spalte 3: Mitmachen (Projekte, Spenden, Patenschaft, Newsletter)
Spalte 4: Kontakt + Bankverbindung (IBAN, Verwendungszweck)
```

---

## SEITEN-LAYOUTS

### Homepage

1. Hero (fullscreen, Lama Samten oder Baustelle, Variante A Copy)
2. ImpactZahlen (4 Kacheln: 200 Kinder / 1.000+ Patienten / 2017 / 2019)
3. Projekte (3 ProjektKarten: Nalanda / Patenschaft / Medical Camp)
4. Lama Samten Intro (2-spaltig: Text links, Bild rechts)
5. BaufortschrittTimeline Teaser (3 Phasen, CTA → /projekte/nalanda-schule/)
6. WirkungsRechner (Alpine.js: Was bewirkt mein Beitrag?)
7. SpendenBox fullwidth (Stripe Payment Links: 25€ / 50€ / 100€ / Anderer Betrag)
8. QuoteBlock (Lama Samten Zitat)
9. Blog Teaser (3 aktuelle Posts)
10. NewsletterFormular inline

### Lama Samten Bio

1. Hero compact (Portrait-Foto)
2. Biografie (2-spaltig, lange Fließtext-Blöcke)
3. QuoteBlock groß
4. Drikung-Kagyü Hintergrund (Accordion)
5. Mandala-Tourneen (kommende Termine)
6. Foto-Essay (Galerie Ladakh + Frankfurt)
7. Blog-Posts von Lama Samten (gefiltert)
8. NewsletterFormular (Teaser: "Schreiben Sie direkt")

### Nalanda Schule

1. Hero compact (Baustelle Saboo)
2. Intro (Warum Internat, Warum Saboo)
3. BaufortschrittTimeline (vollständig: Phase 1–4)
4. Öko-Bauprinzip (3 Icons: Passivhaus / Lokale Materialien / Langzeitig)
5. Wirkung in Zahlen (200 Kinder, Kapazität, Lage)
6. Galerie (Baufortschritt-Fotos)
7. SpendenBox (projektspezifisch)

### Patenschaft (Unterstützen)

1. Hero compact
2. 4-Schritte-Prozess (Wie funktioniert Patenschaft)
3. PatenschaftFormular + Stripe Subscription (35€/Mo)
4. Erklärung: Was eine Patenschaft ist und nicht ist
5. FAQ Accordion
6. SpendenBox minimal

### Spenden (Unterstützen)

1. Hero compact (minimal)
2. SpendenBox fullwidth (Stripe: 25€ / 50€ / 100€ / Dauerspende / Anderer Betrag)
3. Bankverbindung (Fallback für alle die nicht online zahlen möchten)
4. Steuerliche Absetzbarkeit (Info-Box)
5. FAQ zu Spendenquittungen

---

## CONTENT-STRATEGIE

### Tonalität

**5 DO's:**
1. Konkret vor emotional: Zahlen + Fakten erzählen stärker als Appelle
2. Akteure benennen: Lama Samten, Oliver, Saboo, Leh — echte Namen, echte Orte
3. Würde der Dargestellten wahren: Kinder sind Menschen, keine Mitleidsobjekte
4. Sparsamkeit mit Superlativen: keine "einzigartigen außergewöhnlichen Projekte"
5. Aktiv schreiben: "Wir bauen" — nicht "es wird gebaut"

**5 DON'Ts:**
1. Keine Elend-Rhetorik / Betroffenheitsszenografie
2. Keine religiösen Floskeln für säkulare Leser
3. Kein NGO-Bürokraten-Deutsch
4. Keine Passivkonstruktionen für Kernaussagen
5. Kein Dankbarkeits-Kitsch

### Blog-Kategorien

```
schulbau          — Nalanda Schule Bauberichte
waisenhaus        — Waisenhausleben
medical-camp      — Medizinische Camps
kinderpatenschaft — Paten-Updates
reisebericht      — Lamas Reisen nach Ladakh
vereinsnews       — Vereinsinternes, Veranstaltungen
ladakh-kultur     — Buddhismus, Kultur, Land & Leute (SEO!)
```

### Newsletter (Brevo)

- Frequenz: ~4× pro Jahr + Sondernewsletter nach Camps/Bauphasen
- Struktur: Begrüßung Lama Samten | Ladakh-Update | Gedanke | CTA
- Erste Betreffzeile: "Ein Brief aus den Bergen — Lama Samten schreibt Ihnen persönlich"

---

## PAYMENT-INTEGRATION (Stripe)

### V1: Stripe Payment Links (Zero-Backend)

Alle Zahlungen als Redirects zu Stripe-gehosteten Checkout-Seiten.
URLs werden im Stripe Dashboard erstellt und in `.env` als Variablen gespeichert.

```
STRIPE_LINK_SPENDE_25=https://buy.stripe.com/PLACEHOLDER_25
STRIPE_LINK_SPENDE_50=https://buy.stripe.com/PLACEHOLDER_50
STRIPE_LINK_SPENDE_100=https://buy.stripe.com/PLACEHOLDER_100
STRIPE_LINK_DAUERSPENDE=https://buy.stripe.com/PLACEHOLDER_DAUERSPENDE
STRIPE_LINK_PATENSCHAFT=https://buy.stripe.com/PLACEHOLDER_PATENSCHAFT
```

Unterstützte Zahlungsarten innerhalb Stripe: Kreditkarte, SEPA-Lastschrift, Klarna, PayPal, Apple/Google Pay.

### Post-Payment

- `?success=true` → Redirect auf `/danke/` mit Dankestext
- `?canceled=true` → Redirect zurück auf Spendenpage

### V1.1: Netlify Functions (Custom Amounts)

Netlify Function erstellt Stripe Checkout Session für beliebige Beträge.
Implementierung nach V1-Launch.

### Patenschaft (Stripe Subscription)

- Betrag: 35€/Monat (empfohlen, custom auf Anfrage)
- Zahlung: SEPA-Lastschrift bevorzugt (Stripe Subscription)
- Bestätigung: Brevo Transactional-Mail
- Spendenquittung: Sammelquittung Januar via Brevo-Template

---

## TECH-STACK (FINAL)

```json
{
  "astro": "^4.16.0",
  "@astrojs/tailwind": "^5.1.0",
  "@astrojs/alpinejs": "^0.4.0",
  "@astrojs/mdx": "^3.1.0",
  "@astrojs/rss": "^4.0.7",
  "@astrojs/sitemap": "^3.1.6",
  "alpinejs": "^3.14.1",
  "@types/alpinejs": "^3.13.10",
  "@tailwindcss/typography": "^0.5.15",
  "@tailwindcss/forms": "^0.5.9",
  "sharp": "^0.33.5",
  "tailwindcss": "^3.4.13",
  "typescript": "^5.6.3"
}
```

**Bewusst nicht enthalten:** React, Vue, Svelte, framer-motion, date-fns, lodash.

---

## SEO-TECHNISCH

- SEOHead.astro: zentrales Meta-Tag-Management mit typisierten Props
- Schema.org: Organization+NGO (Homepage), BlogPosting (Artikel), Person (Lama Samten), BreadcrumbList (alle Unterseiten)
- hreflang: V1 nur `de` + `x-default`, Struktur für EN vorbereitet
- sitemap.xml: automatisch via `@astrojs/sitemap`
- robots.txt: `Disallow: /*?*` gegen Parameter-Duplikate
- Performance-Budget: LCP <1.8s, CLS <0.05, INP <100ms, JS <30KB gzipped

---

## DEPLOYMENT (NETLIFY)

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"
```

Security Headers: X-Frame-Options DENY, CSP, X-Content-Type-Options, Referrer-Policy.
Cache-Control: 1 Jahr für `/images/*` und `/_astro/*`.

**Branch-Strategie:**
```
main      → Production (himalayahaus.de)
develop   → Staging
content/* → Deploy-Previews (für Lama Konchok / Ehrenamtliche)
```

---

## DSGVO-COMPLIANCE-CHECKLISTE

- [ ] Cookie-Banner: nicht nötig (kein JS-Tracking, kein Google Fonts CDN)
- [ ] Brevo: als Auftragsverarbeiter in Datenschutzerklärung nennen (Art. 28)
- [ ] Formspree: als Auftragsverarbeiter nennen, 30 Tage Datenspeicherung angeben
- [ ] Stripe: AV-Vertrag abschließen, als Auftragsverarbeiter nennen
- [ ] Netlify: als Auftragsverarbeiter nennen
- [ ] SEPA-Mandat: Pflichttext bei Patenschaft-Formular
- [ ] Spendenquittungen: 10 Jahre aufbewahren (AO §147)
- [ ] Double Opt-in: Brevo hat dies standardmäßig aktiv

---

## LAUNCH-CHECKLISTE

### Vor dem Launch
- [ ] Stripe-Account erstellen + Payment Links anlegen
- [ ] Brevo-Account + Formular-ID + Double-Opt-in konfigurieren
- [ ] Formspree-Account + Form-ID
- [ ] .env Variablen in Netlify setzen
- [ ] Alle Bankdaten in Footer/Spendenseite eintragen
- [ ] Echte Fotos ersetzen (Platzhalter-Gradienten im Prototyp)
- [ ] Vereinsadresse + E-Mail in Impressum/Kontakt eintragen
- [ ] Jahresbericht-PDF verlinken (sobald verfügbar)
- [ ] Google Search Console: Domain verifizieren + Sitemap einreichen
- [ ] Alt-Joomla-URLs: vollständiges Crawl + 301-Redirects in _redirects

### Nach dem Launch
- [ ] Google Ad Grants beantragen (10.000 USD/Monat für NGOs)
- [ ] Plausible Analytics einrichten (cookiefrei, $9/Mo)
- [ ] Ersten Newsletter versenden
- [ ] Blog: 5 SEO-Artikel publizieren (Priorität: Baufortschritt + Drikung-Kagyü-Intro)

---

*Erstellt: Mai 2026 | Himalaya-Haus e.V. Website-Relaunch-Team*
