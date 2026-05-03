# Technische Spezifikation: Himalaya-Haus e.V. Website-Prototyp

**Version:** 1.0  
**Stand:** 2026-05-03  
**Team:** Senior SEO-Spezialist + Senior Web-Entwickler  
**Scope:** Vollständig deploybarer Prototyp (kein Shop, kein Online-Payment)

---

## 1. TECH-STACK ENTSCHEIDUNG

### Entscheidung: **Astro 4.x + Tailwind CSS 3.x + Markdown (Content Collections)**

### Bewertungsmatrix der Alternativen

#### Option A: Astro + Tailwind CSS + Markdown ✅ GEWÄHLT

**Pros:**
- Zero-JS by default im Client: kein JavaScript wird ausgeliefert sofern nicht explizit gefordert — direkter Gewinn bei Core Web Vitals (TBT, FID/INP)
- Content Collections mit Zod-Schema-Validierung: typsicheres Frontmatter, Build bricht bei Fehlern im Content — ideal für Ehrenamtliche die Blog-Posts schreiben
- Statisches HTML: Googlebot crawlt ohne zweiten Render-Zyklus, sofortige Indexierung, keine Hydration-Delays
- Astro Islands: wenn interaktive Komponenten gebraucht werden (Newsletter-Form, Accordion), können diese isoliert hydratisiert werden ohne das ganze Bundle aufzublasen
- `@astrojs/sitemap` generiert `sitemap.xml` automatisch
- Build-Output ist reines HTML/CSS — Deployment auf Netlify/Vercel kostenlos und trivial
- Niedrige Einstiegshürde für zukünftige Maintainer die HTML/CSS kennen (kein React-Wissen notwendig)

**Cons:**
- Kein Live-Preview im CMS (aber für Ehrenamtliche die Markdown schreiben akzeptabel)
- Astro-Syntax ist ungewohnt für reine React-Entwickler (irrelevant für dieses Projekt)

**SEO-Relevanz:**
- LCP unter 1.8s erreichbar durch pure static HTML delivery vom CDN-Edge
- Kein FOUC (Flash of Unstyled Content), kein Layout Shift durch JS-Frameworks
- Volle Kontrolle über `<head>` ohne Framework-Overhead

#### Option B: Next.js + Tailwind CSS

**Pros:**
- Großes Ecosystem, viele Entwickler kennen es
- App Router mit `generateStaticParams` für SSG nutzbar
- Vercel-Integration nahtlos

**Cons:**
- Default-Bundle enthält React-Runtime (~45KB gzipped) auch wenn keine Interaktivität gebraucht wird
- `output: 'export'` für vollständig statischen Build notwendig — extra Konfigurationsaufwand
- Image Optimization über `next/image` funktioniert im Static Export nur eingeschränkt
- Overhead: API Routes, Middleware, Server Components — alles Features die für diese Site nie genutzt werden
- Build-Zeit höher als Astro bei identischem Content-Volumen

**Warum nicht:** Zu viel Framework für zu wenig Anforderung. Das SEO-Argument für Next.js (Streaming SSR für dynamischen Content) greift hier nicht, da der gesamte Content statisch ist.

#### Option C: Reines HTML/CSS + Alpine.js

**Pros:**
- Maximale Kontrolle, kein Build-Step notwendig
- Minimales Bundle

**Cons:**
- Kein Blog-System: jeder neue Artikel bedeutet manuelle HTML-Datei erstellen — nicht maintainbar
- Kein Templating: Header/Footer müssen in jeder Datei dupliziert oder mit Server-Side Includes gelöst werden
- Keine automatische Sitemap-Generierung
- Schlechte Entwickler-Erfahrung, hohe Fehleranfälligkeit bei Ehrenamtlichen
- Nicht skalierbar: bei 20+ Blog-Posts kollabiert das Modell

**Warum nicht:** Der Blog ist für die SEO-Strategie der Organisation zentral. Frischer Content aus Ladakh (Reiseberichte, Schulfortschritt) ist der einzige realistische Weg, organischen Traffic aufzubauen. Ein Blog-System das nicht gepflegt wird weil es mühsam ist, ist wertlos.

### Finale Begründung

Astro ist das einzige Framework das gleichzeitig:
1. Erstklassige statische Performance (SEO-Anforderung)
2. Ein wartbares Blog-System (Content-Anforderung)
3. Minimalen Tooling-Overhead (Maintainability-Anforderung)
4. DSGVO-freundliches Zero-JS-Default (Datenschutz-Anforderung)

bietet, ohne Kompromisse bei einem dieser Punkte zu machen.

---

## 2. PROJEKTSTRUKTUR

```
himalaya-haus-website/
│
├── public/                          # Statische Assets (werden 1:1 kopiert, kein Processing)
│   ├── favicon.svg                  # SVG Favicon (skaliert besser als .ico)
│   ├── favicon-32x32.png            # Fallback PNG Favicon
│   ├── apple-touch-icon.png         # iOS Home Screen Icon (180x180px)
│   ├── og-default.jpg               # Default Open Graph Image (1200x630px)
│   ├── robots.txt                   # Crawler-Direktiven (manuell gepflegt)
│   ├── _redirects                   # Netlify Redirect-Regeln (301 von alten Joomla-URLs)
│   └── images/
│       ├── lama-konchok/            # Portraits, Veranstaltungsfotos
│       ├── projekte/
│       │   ├── nalanda-schule/      # Baufortschritt-Fotos, Renderings
│       │   ├── waisenhaus/
│       │   ├── kinderpatenschaft/
│       │   └── medical-camp/
│       ├── ladakh/                  # Landschafts- und Reportagefotos
│       └── team/                    # Vereinsvorstand (falls verfügbar)
│
├── src/
│   │
│   ├── content/                     # Astro Content Collections (Markdown)
│   │   ├── config.ts                # Zod-Schemas für alle Collections
│   │   ├── blog/                    # Blog-Artikel (Markdown-Dateien)
│   │   │   ├── 2025-01-schulbau-update.md
│   │   │   ├── 2025-03-medical-camp-bericht.md
│   │   │   └── ...
│   │   └── projekte/                # Projektseiten-Content (Markdown)
│   │       ├── nalanda-schule.md
│   │       ├── waisenhaus.md
│   │       ├── kinderpatenschaft.md
│   │       └── medical-camp.md
│   │
│   ├── pages/                       # Astro-Seiten = Routen
│   │   ├── index.astro              # / — Homepage
│   │   ├── 404.astro                # /404 — Fehlerseite
│   │   ├── ueber-uns/
│   │   │   ├── index.astro          # /ueber-uns/ — Über den Verein
│   │   │   ├── lama-konchok.astro   # /ueber-uns/lama-konchok/
│   │   │   └── vorstand.astro       # /ueber-uns/vorstand/
│   │   ├── projekte/
│   │   │   ├── index.astro          # /projekte/ — Projektübersicht
│   │   │   └── [slug].astro         # /projekte/[slug]/ — Dynamisch aus Content Collection
│   │   ├── unterstuetzen/
│   │   │   ├── index.astro          # /unterstuetzen/ — Spenden & Unterstützen (Übersicht)
│   │   │   ├── spenden.astro        # /unterstuetzen/spenden/ — Bankdaten, Spendeninfo
│   │   │   └── patenschaft.astro    # /unterstuetzen/patenschaft/ — Kinderpatenschaft
│   │   ├── blog/
│   │   │   ├── index.astro          # /blog/ — Blog-Übersicht (Seite 1)
│   │   │   ├── [slug].astro         # /blog/[slug]/ — Einzelner Artikel
│   │   │   └── seite/
│   │   │       └── [page].astro     # /blog/seite/2/ etc. — Paginierung
│   │   ├── kontakt.astro            # /kontakt/ — Kontaktformular
│   │   ├── impressum.astro          # /impressum/ — Pflichtseite
│   │   ├── datenschutz.astro        # /datenschutz/ — DSGVO-Pflichtseite
│   │   └── rss.xml.ts               # /rss.xml — RSS-Feed (TypeScript Endpoint)
│   │
│   ├── layouts/
│   │   ├── BaseLayout.astro         # Basis-HTML-Struktur, <head>, Meta-Tags, hreflang
│   │   ├── BlogLayout.astro         # Erbt BaseLayout, fügt BlogPosting Schema.org hinzu
│   │   └── ProjektLayout.astro      # Erbt BaseLayout, für Projektseiten-Struktur
│   │
│   ├── components/
│   │   ├── seo/
│   │   │   ├── SEOHead.astro        # Zentrales <head>-Meta-Tag-Management
│   │   │   ├── SchemaOrg.astro      # JSON-LD Schema.org Injection
│   │   │   └── OpenGraph.astro      # OG + Twitter Card Tags
│   │   ├── layout/
│   │   │   ├── Header.astro         # Navigation, Logo, Mobile Menu
│   │   │   ├── Footer.astro         # Links, Soziale Medien, Bankdaten-Snippet
│   │   │   └── MobileMenu.astro     # Alpine.js Hamburger-Menu (isoliertes Island)
│   │   ├── ui/
│   │   │   ├── Button.astro         # Wiederverwendbarer Button (props: variant, href)
│   │   │   ├── Card.astro           # Projekt/Blog-Karte
│   │   │   ├── HeroSection.astro    # Homepage Hero mit Bild und CTA
│   │   │   ├── SectionHeading.astro # Konsistente H2/H3-Überschriften
│   │   │   └── Breadcrumb.astro     # Breadcrumb-Navigation (auch Schema.org)
│   │   ├── blog/
│   │   │   ├── BlogCard.astro       # Karte für Blog-Übersicht
│   │   │   ├── BlogGrid.astro       # Grid-Layout für mehrere BlogCards
│   │   │   ├── Pagination.astro     # Prev/Next-Navigation
│   │   │   └── TagCloud.astro       # Tag-Übersicht/Filter (clientseitig via Alpine.js)
│   │   └── forms/
│   │       ├── ContactForm.astro    # Kontaktformular (Formspree-Action)
│   │       └── NewsletterForm.astro # Newsletter-Anmeldung (Brevo HTML-Form)
│   │
│   ├── styles/
│   │   ├── global.css               # @tailwind directives, CSS Custom Properties
│   │   └── typography.css           # Tailwind Typography Plugin Overrides
│   │
│   └── utils/
│       ├── formatDate.ts            # Datum-Formatierung (DE-Locale)
│       ├── slugify.ts               # URL-Slug-Generierung
│       └── seo.ts                   # SEO-Utility-Funktionen (canonical URL builder etc.)
│
├── astro.config.mjs                 # Astro-Konfiguration (Integrationen, Output)
├── tailwind.config.mjs              # Tailwind-Konfiguration (Farben, Fonts, Breakpoints)
├── tsconfig.json                    # TypeScript-Konfiguration
├── package.json                     # Dependencies
├── netlify.toml                     # Netlify Build & Redirect-Konfiguration
└── .env.example                     # Umgebungsvariablen-Template (Formspree-ID, etc.)
```

---

## 3. URL-ARCHITEKTUR (FINAL)

| Route | Datei | Zweck | Typ |
|---|---|---|---|
| `/` | `pages/index.astro` | Homepage: Mission, aktuelle Projekte, CTA Spenden | Statisch |
| `/ueber-uns/` | `pages/ueber-uns/index.astro` | Vereinsgeschichte, Leitbild, Drikung-Kagyü-Kontext | Statisch |
| `/ueber-uns/lama-konchok/` | `pages/ueber-uns/lama-konchok.astro` | Bio, Foto-Galerie, Zitate | Statisch |
| `/ueber-uns/vorstand/` | `pages/ueber-uns/vorstand.astro` | Vorstandsmitglieder, Transparenz | Statisch |
| `/projekte/` | `pages/projekte/index.astro` | Übersicht aller Projekte mit Status-Badges | Statisch |
| `/projekte/nalanda-schule/` | `content/projekte/nalanda-schule.md` → `[slug].astro` | Hauptprojekt: Baufortschritt, Ziele, Bilder | Dynamisch (SSG) |
| `/projekte/waisenhaus/` | `content/projekte/waisenhaus.md` → `[slug].astro` | Waisenhausbetrieb, Bewohner (anonymisiert) | Dynamisch (SSG) |
| `/projekte/kinderpatenschaft/` | `content/projekte/kinderpatenschaft.md` → `[slug].astro` | Wie Patenschaften funktionieren, Kosten, Prozess | Dynamisch (SSG) |
| `/projekte/medical-camp/` | `content/projekte/medical-camp.md` → `[slug].astro` | Medical Camp Berichte und nächste Termine | Dynamisch (SSG) |
| `/unterstuetzen/` | `pages/unterstuetzen/index.astro` | Übersicht: Wie kann ich helfen? | Statisch |
| `/unterstuetzen/spenden/` | `pages/unterstuetzen/spenden.astro` | Bankdaten, steuerliche Abzugsfähigkeit, FAQ | Statisch |
| `/unterstuetzen/patenschaft/` | `pages/unterstuetzen/patenschaft.astro` | Patenschaft beantragen (Kontaktformular-Link) | Statisch |
| `/blog/` | `pages/blog/index.astro` | Neueste Artikel, Kategorie-Filter | Statisch |
| `/blog/seite/[page]/` | `pages/blog/seite/[page].astro` | Paginierte Blog-Übersicht | Dynamisch (SSG) |
| `/blog/[slug]/` | `pages/blog/[slug].astro` | Einzelner Artikel | Dynamisch (SSG) |
| `/kontakt/` | `pages/kontakt.astro` | Kontaktformular + Anschrift | Statisch |
| `/impressum/` | `pages/impressum.astro` | Pflichtangaben §5 TMG | Statisch |
| `/datenschutz/` | `pages/datenschutz.astro` | DSGVO-Datenschutzerklärung | Statisch |
| `/rss.xml` | `pages/rss.xml.ts` | RSS-Feed aller Blog-Artikel | Dynamisch (SSG) |
| `/sitemap-index.xml` | Auto-generiert durch `@astrojs/sitemap` | XML-Sitemap für Suchmaschinen | Auto |

**Notizen zur URL-Struktur:**
- Alle URLs enden mit Trailing Slash (Astro-Default, konsistent für Canonical URLs)
- Keine Parameter in URLs (`?seite=2` → `/blog/seite/2/`)
- Kategorie-URLs via Tags: `/blog/tag/[tag]/` kann in V1.1 ergänzt werden
- Keine Datumsbasierte URL-Struktur für Blog (z.B. `/blog/2025/01/titel/`) — zu lang, schlecht für SEO

---

## 4. SEO-TECHNISCHE ANFORDERUNGEN

### 4.1 Meta-Tag-Struktur

**`src/components/seo/SEOHead.astro`** — wird in `BaseLayout.astro` eingebunden:

```astro
---
interface Props {
  title: string;           // Pflicht: Seitentitel (ohne Sitename)
  description: string;     // Pflicht: 120-158 Zeichen
  canonicalURL: string;    // Pflicht: Absolute URL
  ogImage?: string;        // Optional: Absoluter Pfad zum OG-Bild
  ogType?: 'website' | 'article';  // Default: 'website'
  noindex?: boolean;       // Default: false (nur für Datenschutz/Impressum: false — beide sollen indexiert sein)
  publishedTime?: string;  // ISO 8601, nur für Artikel
  modifiedTime?: string;   // ISO 8601, nur für Artikel
  author?: string;         // Nur für Artikel
}

const {
  title,
  description,
  canonicalURL,
  ogImage = `${Astro.site}og-default.jpg`,
  ogType = 'website',
  noindex = false,
} = Astro.props;

const fullTitle = `${title} | Himalaya-Haus e.V.`;
---

<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>{fullTitle}</title>
<meta name="description" content={description} />
<link rel="canonical" href={canonicalURL} />
{noindex && <meta name="robots" content="noindex, nofollow" />}

<!-- hreflang: Version 1 nur Deutsch -->
<link rel="alternate" hreflang="de" href={canonicalURL} />
<link rel="alternate" hreflang="x-default" href={canonicalURL} />

<!-- Open Graph -->
<meta property="og:title" content={fullTitle} />
<meta property="og:description" content={description} />
<meta property="og:url" content={canonicalURL} />
<meta property="og:type" content={ogType} />
<meta property="og:image" content={ogImage} />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="Himalaya-Haus e.V. – Hilfsprojekte in Ladakh" />
<meta property="og:site_name" content="Himalaya-Haus e.V." />
<meta property="og:locale" content="de_DE" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={fullTitle} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={ogImage} />

<!-- Artikel-spezifisch (nur wenn ogType === 'article') -->
{ogType === 'article' && Astro.props.publishedTime && (
  <meta property="article:published_time" content={Astro.props.publishedTime} />
)}
{ogType === 'article' && Astro.props.modifiedTime && (
  <meta property="article:modified_time" content={Astro.props.modifiedTime} />
)}
{ogType === 'article' && Astro.props.author && (
  <meta property="article:author" content={Astro.props.author} />
)}
<meta property="article:publisher" content="https://www.himalayahaus.de/" />

<!-- Favicons -->
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<link rel="manifest" href="/site.webmanifest" />

<!-- RSS -->
<link rel="alternate" type="application/rss+xml" title="Himalaya-Haus e.V. Blog" href="/rss.xml" />

<!-- Preconnect für externe Ressourcen (Schriften falls verwendet) -->
<!-- <link rel="preconnect" href="https://fonts.bunny.net" /> -->
```

### 4.2 Schema.org (JSON-LD) — Vollständige Snippets

**Homepage (`/`)** — `Organization` + `WebSite`:

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "NGO"],
      "@id": "https://www.himalayahaus.de/#organization",
      "name": "Himalaya-Haus e.V.",
      "alternateName": "Himalaya-Haus Förderverein",
      "url": "https://www.himalayahaus.de/",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.himalayahaus.de/images/logo.svg",
        "width": 200,
        "height": 60
      },
      "description": "Gemeinnütziger Verein für Hilfsprojekte in Ladakh, Indien. Träger der Nalanda Schule und des Waisenhauses unter Leitung von Lama Konchok Samten.",
      "foundingDate": "XXXX",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Frankfurt am Main",
        "addressCountry": "DE"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer support",
        "email": "info@himalayahaus.de",
        "availableLanguage": ["German", "English"]
      },
      "sameAs": [
        "https://www.facebook.com/himalayahaus",
        "https://www.instagram.com/himalayahaus"
      ],
      "nonprofitStatus": "RegisteredCharity",
      "areaServed": {
        "@type": "Place",
        "name": "Ladakh, Indien"
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://www.himalayahaus.de/#website",
      "url": "https://www.himalayahaus.de/",
      "name": "Himalaya-Haus e.V.",
      "description": "Hilfsprojekte in Ladakh — Nalanda Schule, Waisenhaus, Kinderpatenschaft",
      "publisher": {
        "@id": "https://www.himalayahaus.de/#organization"
      },
      "inLanguage": "de-DE"
    }
  ]
}
```

**Blog-Artikel** — `BlogPosting`:

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "ARTIKEL_TITEL",
  "description": "ARTIKEL_BESCHREIBUNG",
  "image": {
    "@type": "ImageObject",
    "url": "ARTIKEL_OG_BILD_URL",
    "width": 1200,
    "height": 630
  },
  "datePublished": "ISO_DATUM",
  "dateModified": "ISO_DATUM",
  "author": {
    "@type": "Person",
    "name": "Lama Konchok Samten",
    "url": "https://www.himalayahaus.de/ueber-uns/lama-konchok/"
  },
  "publisher": {
    "@id": "https://www.himalayahaus.de/#organization"
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "ARTIKEL_CANONICAL_URL"
  },
  "inLanguage": "de-DE",
  "keywords": "TAGS_KOMMAGETRENNT"
}
```

**Projektseiten** — `Project` + `ItemList` auf Übersichtsseite:

```json
{
  "@context": "https://schema.org",
  "@type": "Project",
  "name": "Nalanda Schule Ladakh",
  "description": "Bau und Betrieb der Nalanda Schule in Ladakh für Kinder der Region",
  "url": "https://www.himalayahaus.de/projekte/nalanda-schule/",
  "founder": {
    "@type": "Person",
    "name": "Lama Konchok Samten"
  },
  "sponsor": {
    "@id": "https://www.himalayahaus.de/#organization"
  },
  "location": {
    "@type": "Place",
    "name": "Ladakh",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN",
      "addressRegion": "Ladakh"
    }
  }
}
```

**Über-uns / Person-Seite** — `Person`:

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Lama Konchok Samten",
  "jobTitle": "Buddhistische Mönch, Vereinsgründer",
  "description": "Tibetisch-buddhistischer Mönch der Drikung-Kagyü-Tradition, Gründer und Leiter des Himalaya-Haus e.V.",
  "affiliation": {
    "@id": "https://www.himalayahaus.de/#organization"
  },
  "url": "https://www.himalayahaus.de/ueber-uns/lama-konchok/",
  "image": "https://www.himalayahaus.de/images/lama-konchok/portrait.jpg",
  "nationality": [
    {"@type": "Country", "name": "India"},
    {"@type": "Country", "name": "Germany"}
  ]
}
```

**Breadcrumb** (auf allen Unterseiten):

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Startseite",
      "item": "https://www.himalayahaus.de/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Projekte",
      "item": "https://www.himalayahaus.de/projekte/"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Nalanda Schule",
      "item": "https://www.himalayahaus.de/projekte/nalanda-schule/"
    }
  ]
}
```

### 4.3 hreflang-Implementierung

**Version 1 (DE only):**
```html
<link rel="alternate" hreflang="de" href="https://www.himalayahaus.de/AKTUELLE_SEITE/" />
<link rel="alternate" hreflang="x-default" href="https://www.himalayahaus.de/AKTUELLE_SEITE/" />
```

**Vorbereitung für Version 2 (DE + EN):**
```
Wenn /en/ ergänzt wird:
<link rel="alternate" hreflang="de" href="https://www.himalayahaus.de/projekte/nalanda-schule/" />
<link rel="alternate" hreflang="en" href="https://www.himalayahaus.de/en/projects/nalanda-school/" />
<link rel="alternate" hreflang="x-default" href="https://www.himalayahaus.de/projekte/nalanda-schule/" />
```
Implementierung: In `SEOHead.astro` als optionaler `alternateUrl`-Prop wenn EN-Route existiert.

### 4.4 Sitemap

`@astrojs/sitemap` in `astro.config.mjs`:

```javascript
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.himalayahaus.de',
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/datenschutz') === false &&  // Datenschutz WIRD indexiert
        !page.includes('/api/'),                      // API-Routen ausschließen (falls vorhanden)
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      customPages: [],
      serialize(item) {
        // Homepage höhere Priority
        if (item.url === 'https://www.himalayahaus.de/') {
          return { ...item, priority: 1.0, changefreq: 'weekly' };
        }
        // Blog-Artikel mittlere Priority
        if (item.url.includes('/blog/')) {
          return { ...item, priority: 0.8, changefreq: 'monthly' };
        }
        return item;
      }
    })
  ]
});
```

Ausgabe: `/sitemap-index.xml` → verweist auf `/sitemap-0.xml` (automatisch bei <50.000 URLs)

In Google Search Console einreichen: `https://www.himalayahaus.de/sitemap-index.xml`

### 4.5 robots.txt

```
User-agent: *
Allow: /

# Admin-Bereiche ausschließen (falls später CMS ergänzt wird)
Disallow: /admin/
Disallow: /api/

# Duplikat-Inhalte (Paginierungsseiten sind OK für Google, aber Parameterversionen nicht)
Disallow: /*?*

# Sitemap-Verweis
Sitemap: https://www.himalayahaus.de/sitemap-index.xml

# Crawl-Delay für respektvolle Crawler
Crawl-delay: 1
```

### 4.6 Canonical URLs

Prinzipien:
- Jede Seite hat exakt eine kanonische URL
- Trailing Slash konsistent (Astro default: mit Trailing Slash)
- `www.himalayahaus.de` ist Canonical (nicht `himalayahaus.de` ohne www)
- In `astro.config.mjs`: `trailingSlash: 'always'`
- Redirect: `http://himalayahaus.de` → `https://www.himalayahaus.de` (in `_redirects` Datei)

```
# public/_redirects
http://himalayahaus.de/*    https://www.himalayahaus.de/:splat    301!
https://himalayahaus.de/*   https://www.himalayahaus.de/:splat    301!
```

### 4.7 Performance-Budget (Core Web Vitals Ziele)

| Metrik | Ziel | Akzeptabel | Kritisch |
|---|---|---|---|
| **LCP** (Largest Contentful Paint) | < 1.8s | < 2.5s | > 4.0s |
| **CLS** (Cumulative Layout Shift) | < 0.05 | < 0.1 | > 0.25 |
| **INP** (Interaction to Next Paint) | < 100ms | < 200ms | > 500ms |
| **FCP** (First Contentful Paint) | < 1.2s | < 1.8s | > 3.0s |
| **TTFB** (Time to First Byte) | < 200ms | < 600ms | > 1800ms |
| **Total JS (gzipped)** | < 30KB | < 50KB | > 100KB |
| **Total CSS (gzipped)** | < 15KB | < 25KB | > 50KB |
| **Bilder** | WebP/AVIF, lazy load | max 200KB pro Bild | > 500KB |
| **Lighthouse Score** | > 95 | > 85 | < 70 |

**Maßnahmen zur Erreichung:**
- `@astrojs/image` für automatische WebP/AVIF-Konvertierung und responsive `srcset`
- Tailwind CSS wird auf verwendete Klassen purged (kein ungenutztes CSS)
- Fonts: System-Font-Stack als Default, oder selbst-gehostete Fonts via `font-display: swap`
- Kein Google Fonts (verhindert externen DNS-Lookup, DSGVO-konform)
- Alpine.js nur wo notwendig, als `defer` geladen
- Bilder: `loading="lazy"` für alle Bilder below the fold, `fetchpriority="high"` für LCP-Bild

---

## 5. BLOG-SYSTEM-SPEZIFIKATION

### 5.1 Content Collections Konfiguration (`src/content/config.ts`)

```typescript
import { defineCollection, z } from 'astro:content';

// ============================================================
// BLOG-COLLECTION
// ============================================================
const blog = defineCollection({
  type: 'content', // Markdown-Dateien
  schema: ({ image }) => z.object({
    // Pflichtfelder
    title: z.string().min(10).max(70),           // SEO: Titel-Länge begrenzt
    description: z.string().min(120).max(158),   // SEO: Meta-Description-Länge
    pubDate: z.coerce.date(),                     // Veröffentlichungsdatum
    author: z.enum([                              // Kontrolliertes Vokabular
      'Lama Konchok Samten',
      'Himalaya-Haus e.V.',
      'Redaktion'
    ]).default('Himalaya-Haus e.V.'),

    // Optionale Felder
    updatedDate: z.coerce.date().optional(),      // Aktualisierungsdatum (für dateModified)
    heroImage: image().optional(),                // Astro-Image-Helper für Bildoptimierung
    heroImageAlt: z.string().optional(),          // Alt-Text für Barrierefreiheit + SEO
    category: z.enum([                            // Haupt-Kategorie (genau eine)
      'schulbau',
      'waisenhaus',
      'medical-camp',
      'kinderpatenschaft',
      'reisebericht',
      'vereinsnews',
      'ladakh-kultur'
    ]),
    tags: z.array(z.string()).default([]),         // Freitags (zusätzlich zur Kategorie)
    featured: z.boolean().default(false),          // Für Homepage-Highlight
    draft: z.boolean().default(false),             // Entwurf — wird nicht gebaut

    // SEO-Overrides (optional, überschreiben automatische Werte)
    seoTitle: z.string().max(60).optional(),       // Custom Title-Tag (ohne Sitename)
    seoDescription: z.string().max(158).optional(),// Custom Meta-Description
    canonicalUrl: z.string().url().optional(),     // Nur bei Syndizierung nötig
    noindex: z.boolean().default(false),           // Für versteckte Entwurfs-Previews
  }),
});

// ============================================================
// PROJEKTE-COLLECTION
// ============================================================
const projekte = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    // Pflichtfelder
    title: z.string(),
    description: z.string().min(120).max(158),
    status: z.enum([
      'im-bau',           // Nalanda Schule
      'aktiv',            // Medical Camp, Kinderpatenschaft
      'abgeschlossen',    // Vergangene Projekte
      'planung'           // Zukünftige Projekte
    ]),
    order: z.number().int(),                      // Reihenfolge auf Übersichtsseite

    // Inhaltsfelder
    heroImage: image().optional(),
    heroImageAlt: z.string().optional(),
    startDate: z.coerce.date().optional(),        // Projektbeginn
    location: z.string().default('Ladakh, Indien'),
    targetAmount: z.number().optional(),          // Förderbedarf in EUR (statische Info)
    raisedAmount: z.number().optional(),          // Bisher gesammelt (manuell gepflegt)
    beneficiaries: z.string().optional(),         // "ca. 120 Kinder"

    // SEO
    seoTitle: z.string().max(60).optional(),
    seoDescription: z.string().max(158).optional(),
  }),
});

export const collections = { blog, projekte };
```

### 5.2 Beispiel-Frontmatter: Blog-Post

```markdown
---
title: "Baufortschritt Nalanda Schule: Erstes Stockwerk steht"
description: "Lama Konchok berichtet direkt aus Ladakh über den aktuellen Stand des Schulbaus der Nalanda Schule in Shey. Das erste Stockwerk wurde im September fertiggestellt — ein Meilenstein für alle Unterstützer."
pubDate: 2025-09-15
updatedDate: 2025-09-18
author: "Lama Konchok Samten"
heroImage: "../../public/images/projekte/nalanda-schule/baufortschritt-sept-2025.jpg"
heroImageAlt: "Erstes Stockwerk der Nalanda Schule in Shey, Ladakh — September 2025"
category: "schulbau"
tags: ["nalanda-schule", "baufortschritt", "ladakh", "spenden-update"]
featured: true
draft: false
---

Liebe Unterstützerinnen und Unterstützer,

ich schreibe euch aus Leh, wo ich gerade...
```

### 5.3 Beispiel-Frontmatter: Projektseite

```markdown
---
title: "Nalanda Schule & Waisenhaus"
description: "Die Nalanda Schule in Shey (Ladakh) bietet 120 Kindern aus ärmsten Verhältnissen kostenlose Bildung und Unterkunft. Aktuell im Bau — Ihre Spende hilft direkt."
status: "im-bau"
order: 1
heroImage: "../../public/images/projekte/nalanda-schule/rendering.jpg"
heroImageAlt: "Architekturrendering der Nalanda Schule in Shey, Ladakh"
startDate: 2023-04-01
location: "Shey, Ladakh, Indien"
targetAmount: 180000
raisedAmount: 95000
beneficiaries: "ca. 120 Kinder"
seoTitle: "Nalanda Schule Ladakh — Bildung für Kinder in Not"
seoDescription: "Die Nalanda Schule in Shey bietet 120 Kindern aus Ladakh kostenlose Bildung. Jetzt im Bau — unterstützen Sie das Projekt des Himalaya-Haus e.V."
---
```

### 5.4 Kategorien & Tags-System

**Kategorien** (fest definiert, ein Wert pro Post):
- `schulbau` — Nalanda Schule Bauberichte
- `waisenhaus` — Waisenhausleben und -betrieb
- `medical-camp` — Medizinische Camps
- `kinderpatenschaft` — Paten-Updates
- `reisebericht` — Lamas Reisen nach Ladakh
- `vereinsnews` — Vereinsinternes, Veranstaltungen Frankfurt
- `ladakh-kultur` — Buddhismus, Kultur, Land & Leute (SEO-Potenzial!)

**Tags** (freie Vergabe, mehrere pro Post möglich):
Beispiele: `nalanda-schule`, `baufortschritt`, `lama-konchok`, `spenden-update`, `drikung-kagyu`, `ladakh`, `kinder`, `bildung`, `winter-in-ladakh`, `frankfurt`

**URL-Pattern für Kategorie-Seiten (V1.1):**
`/blog/kategorie/[kategorie]/` und `/blog/tag/[tag]/`

### 5.5 Paginierung

- **Posts pro Seite:** 9 (3×3 Grid auf Desktop, 1 Spalte auf Mobile)
- **URL-Schema:** `/blog/` (Seite 1) und `/blog/seite/2/`, `/blog/seite/3/` etc.
- **Rel-Tags:** `<link rel="prev">` und `<link rel="next">` auf paginierten Seiten
- **Implementierung:** Astros eingebaute `paginate()`-Funktion in `getStaticPaths()`

```typescript
// pages/blog/seite/[page].astro
export async function getStaticPaths({ paginate }) {
  const allPosts = await getCollection('blog', ({ data }) => !data.draft);
  const sortedPosts = allPosts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );
  return paginate(sortedPosts, { pageSize: 9 });
}
```

### 5.6 RSS-Feed (`src/pages/rss.xml.ts`)

```typescript
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return rss({
    title: 'Himalaya-Haus e.V. — Blog',
    description: 'Neuigkeiten aus Ladakh: Schulbau, Medical Camps, Reiseberichte von Lama Konchok Samten',
    site: context.site,
    items: posts
      .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
      .map((post) => ({
        title: post.data.title,
        pubDate: post.data.pubDate,
        description: post.data.description,
        author: post.data.author,
        categories: [post.data.category, ...post.data.tags],
        link: `/blog/${post.slug}/`,
      })),
    customData: `<language>de-de</language>`,
    stylesheet: false,
  });
}
```

---

## 6. EXTERNE INTEGRATIONEN (DSGVO-konform)

### 6.1 Newsletter: Brevo (ehemals Sendinblue)

**Methode: Native HTML-Form-POST (kein JavaScript-Widget)**

Begründung: Brevo's JavaScript-Widget setzt Cookies und erfordert Cookie-Consent. Ein reiner HTML-POST-Request setzt keine Cookies und ist consent-frei unter Art. 25 DSGVO (Privacy by Design).

**Implementierung:**

```astro
<!-- src/components/forms/NewsletterForm.astro -->
---
const BREVO_LIST_ID = import.meta.env.PUBLIC_BREVO_LIST_ID; // z.B. "5"
const BREVO_REDIRECT_SUCCESS = "https://www.himalayahaus.de/newsletter-bestaetigung/";
const BREVO_REDIRECT_ERROR = "https://www.himalayahaus.de/kontakt/?newsletter=fehler";
---

<form
  action="https://sibforms.com/serve/MUIAAAAA_FORMULAR_ID"
  method="POST"
  class="newsletter-form"
  aria-label="Newsletter-Anmeldung"
>
  <!-- Pflichtfeld: Doppelter Opt-in ist in Brevo standardmäßig aktiv -->
  <input type="hidden" name="locale" value="de" />
  <input type="hidden" name="html_type" value="simple" />

  <div class="form-group">
    <label for="EMAIL" class="sr-only">E-Mail-Adresse</label>
    <input
      type="email"
      id="EMAIL"
      name="EMAIL"
      placeholder="Ihre E-Mail-Adresse"
      required
      autocomplete="email"
      class="..."
    />
  </div>

  <div class="form-group">
    <label for="FNAME" class="sr-only">Vorname (optional)</label>
    <input
      type="text"
      id="FNAME"
      name="FNAME"
      placeholder="Vorname (optional)"
      autocomplete="given-name"
      class="..."
    />
  </div>

  <!-- DSGVO-Pflichtfeld: Einverständnis -->
  <div class="form-group flex items-start gap-2">
    <input type="checkbox" id="gdpr" name="OPT_IN" value="1" required />
    <label for="gdpr" class="text-sm">
      Ich möchte den Newsletter des Himalaya-Haus e.V. erhalten und akzeptiere
      die <a href="/datenschutz/">Datenschutzerklärung</a>.
      Abmeldung jederzeit möglich.
    </label>
  </div>

  <button type="submit" class="...">Anmelden</button>
</form>
```

**Technische Details:**
- Brevo Double Opt-in ist Standard — der Nutzer erhält eine Bestätigungsmail
- Formular-ID aus Brevo-Dashboard unter "Forms" kopieren
- Kein Brevo-JS wird geladen → kein Cookie-Consent notwendig
- Nach Absenden: Redirect zur Brevo-Bestätigungsseite (kann auf eigene Seite umgeleitet werden)
- Datenschutzerklärung muss Brevo als Auftragsverarbeiter nennen (Art. 28 DSGVO)

**Felder:**
- EMAIL (Pflicht)
- FNAME — Vorname (optional, für personalisierte Ansprache)
- OPT_IN — DSGVO-Checkbox (Pflicht)

### 6.2 Kontaktformular: Formspree

**Methode: HTML-Form-POST zu Formspree Free Tier**

Begründung: Formspree Free (50 Submissions/Monat) reicht für eine NGO dieser Größe vollständig aus. Netlify Forms wäre alternativ kostenfrei aber an Netlify gebunden.

```astro
<!-- src/components/forms/ContactForm.astro -->
---
const FORMSPREE_ID = import.meta.env.PUBLIC_FORMSPREE_ID; // z.B. "xwpezgvb"
---

<form
  action={`https://formspree.io/f/${FORMSPREE_ID}`}
  method="POST"
  class="contact-form"
  aria-label="Kontaktformular"
>
  <!-- Spam-Honeypot (unsichtbar für User, sichtbar für Bots) -->
  <input type="text" name="_gotcha" style="display:none" tabindex="-1" autocomplete="off" />

  <!-- Redirect nach erfolgreichem Absenden -->
  <input type="hidden" name="_next" value="https://www.himalayahaus.de/kontakt/?gesendet=1" />
  <input type="hidden" name="_subject" value="Neue Kontaktanfrage — himalayahaus.de" />
  <input type="hidden" name="_language" value="de" />

  <div class="form-group">
    <label for="name">Ihr Name *</label>
    <input type="text" id="name" name="name" required autocomplete="name" />
  </div>

  <div class="form-group">
    <label for="email">E-Mail-Adresse *</label>
    <input type="email" id="email" name="email" required autocomplete="email" />
  </div>

  <div class="form-group">
    <label for="betreff">Betreff</label>
    <select id="betreff" name="betreff">
      <option value="allgemein">Allgemeine Anfrage</option>
      <option value="spende">Spende / Bankdaten</option>
      <option value="patenschaft">Kinderpatenschaft</option>
      <option value="presse">Presse / Kooperationen</option>
      <option value="sonstiges">Sonstiges</option>
    </select>
  </div>

  <div class="form-group">
    <label for="nachricht">Nachricht *</label>
    <textarea id="nachricht" name="nachricht" rows="5" required></textarea>
  </div>

  <!-- DSGVO -->
  <div class="form-group flex items-start gap-2">
    <input type="checkbox" id="dsgvo" name="dsgvo" value="ja" required />
    <label for="dsgvo" class="text-sm">
      Ich habe die <a href="/datenschutz/">Datenschutzerklärung</a> gelesen und
      bin mit der Verarbeitung meiner Daten zur Bearbeitung meiner Anfrage einverstanden. *
    </label>
  </div>

  <button type="submit" class="...">Nachricht senden</button>
</form>
```

**DSGVO-Anforderungen Formspree:**
- Formspree Inc. (USA) ist Auftragsverarbeiter → muss in Datenschutzerklärung genannt werden
- Formspree bietet Standard Contractual Clauses (SCC) → ausreichend für EU-Datentransfer
- Daten werden 30 Tage auf Formspree-Servern gespeichert → in DSE angeben
- Kein Tracking/Analytics durch Formspree im HTML-Only-Modus

### 6.3 Analytics: Entscheidung für Version 1

**Empfehlung: Kein Analytics in Version 1 des Prototypen**

Begründung:
- Für einen Prototypen ist Analytics-Daten irrelevant (Baseline nicht vorhanden)
- Jede Analytics-Lösung erhöht Komplexität und Deployment-Risiko
- Matomo selbst-gehostet benötigt eigenen Server (kostet Geld oder Tech-Aufwand)
- Plausible Analytics ($9/Monat, cookiefrei) wäre die beste Option für V2

**Vorbereitung für V2 — Platzhalter in `BaseLayout.astro`:**
```astro
{import.meta.env.PUBLIC_PLAUSIBLE_DOMAIN && (
  <script
    defer
    data-domain={import.meta.env.PUBLIC_PLAUSIBLE_DOMAIN}
    src="https://plausible.io/js/script.js"
  />
)}
```
Wenn `PUBLIC_PLAUSIBLE_DOMAIN` nicht gesetzt ist, wird kein Script geladen.

### 6.4 Cookie-Banner: Nicht notwendig in Version 1

**Rechtliche Bewertung:**

| Integration | Cookie-Pflicht | Begründung |
|---|---|---|
| Formspree (HTML POST) | Nein | Kein Cookie wird gesetzt |
| Brevo (HTML POST) | Nein | Kein Cookie wird gesetzt |
| Netlify CDN | Nein | Technisch notwendige Session-Cookies fallen unter §25 TTDSG Abs. 2 |
| Eigene Schriften | Nein | Selbst-gehostet, kein Tracking |
| Plausible (V2) | Nein | Cookiefrei by design |
| Google Analytics | JA | Erfordert Cookie-Consent |
| Google Fonts (CDN) | JA | IP-Übertragung an US-Server ohne Rechtsgrundlage |

**Ergebnis:** Bei konsequenter Implementierung (kein Google Analytics, kein Google Fonts, kein Brevo-JS, kein Formspree-JS) ist kein Cookie-Banner gemäß §25 TTDSG und Art. 6 DSGVO notwendig. Dies ist ein erheblicher UX- und SEO-Vorteil.

---

## 7. DEPLOYMENT & HOSTING

### 7.1 Hosting-Empfehlung: Netlify (Free Tier)

**Begründung:**
- Free Tier: 100GB Bandwidth/Monat, 300 Build-Minuten/Monat — ausreichend für NGO-Traffic
- Native `_redirects`-Datei-Support: kritisch für Migration der alten Joomla-URLs
- Netlify Edge Network: globales CDN, TTFB < 100ms für DE-Nutzer (Server in Frankfurt)
- Automatischer HTTPS via Let's Encrypt
- Deploy-Previews bei Pull Requests (nützlich für Content-Review)
- Custom Domain kostenlos konfigurierbar

### 7.2 Build-Konfiguration

**`netlify.toml`:**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"
  NPM_VERSION = "10"

# Astro erfordert Node 20+ für Content Collections
[[redirects]]
  # Catch-all für Astro SPA-Fallback (nicht notwendig bei SSG, aber als Sicherheit)
  from = "/*"
  to = "/404.html"
  status = 404

# Alte Joomla-URLs (Beispiele — vollständige Liste nach Audit der alten Site)
[[redirects]]
  from = "/index.php"
  to = "/"
  status = 301

[[redirects]]
  from = "/projekte"
  to = "/projekte/"
  status = 301

[[redirects]]
  from = "/about"
  to = "/ueber-uns/"
  status = 301

[context.production]
  environment = { NODE_ENV = "production" }

[context.deploy-preview]
  environment = { NODE_ENV = "development" }

# Security Headers
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"
    # Content Security Policy (anpassen wenn externe Ressourcen ergänzt werden)
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; form-action 'self' https://formspree.io https://sibforms.com; frame-ancestors 'none';"

# Statische Assets: Lang-Cache
[[headers]]
  for = "/images/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/_astro/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

**`astro.config.mjs`:**
```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import alpinejs from '@astrojs/alpinejs';
import { remarkReadingTime } from './src/utils/remark-reading-time.mjs';

export default defineConfig({
  site: 'https://www.himalayahaus.de',
  trailingSlash: 'always',
  output: 'static',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap(),
    mdx(),
    alpinejs({ entrypoint: '/src/entrypoints/alpine.ts' }),
  ],
  markdown: {
    remarkPlugins: [remarkReadingTime],
    shikiConfig: { theme: 'github-light' },
  },
  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
  i18n: {
    defaultLocale: 'de',
    locales: ['de'],
    // Vorbereitung für EN: locales: ['de', 'en'], routing: { prefixDefaultLocale: false }
  },
  vite: {
    build: {
      cssMinify: true,
    },
  },
});
```

### 7.3 Domain-Setup

**Szenario A: Sofortige Migration (empfohlen)**
- `himalayahaus.de` Nameserver auf Netlify umstellen
- `www.himalayahaus.de` als Primary Domain in Netlify
- `himalayahaus.de` (ohne www) → 301 Redirect zu `www.himalayahaus.de`
- SSL-Zertifikat: automatisch via Netlify/Let's Encrypt

**Szenario B: Parallelbetrieb während Entwicklung**
- Prototyp auf `neu.himalayahaus.de` (Subdomain) oder `himalayahaus.netlify.app`
- `X-Robots-Tag: noindex` auf Subdomain während Entwicklung
- Bei Go-Live: Domain-Switch und 301-Redirect-Kette sauber umstellen

### 7.4 CI/CD

**GitHub → Netlify (automatisch):**
1. Repository auf GitHub erstellen
2. Netlify mit GitHub verbinden (OAuth)
3. Automatischer Trigger: jeder Push auf `main` → Production Deploy
4. Pull Requests → Deploy Preview (eigene URL für Review)
5. Build-Zeit: ca. 45-90 Sekunden für statischen Build

**Empfohlene Branch-Strategie:**
```
main          → Production (himalayahaus.de)
develop       → Staging/Preview
feature/*     → Deploy-Previews
content/*     → Deploy-Previews (für Lama Konchok / Ehrenamtliche)
```

---

## 8. DEPENDENCIES (package.json)

```json
{
  "name": "himalaya-haus-website",
  "version": "1.0.0",
  "description": "Website des Himalaya-Haus e.V. — Hilfsprojekte in Ladakh",
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro",
    "lint": "eslint src --ext .ts,.astro",
    "check": "astro check"
  },
  "dependencies": {
    "astro": "^4.16.0"
  },
  "devDependencies": {
    "@astrojs/alpinejs": "^0.4.0",
    "@astrojs/mdx": "^3.1.0",
    "@astrojs/rss": "^4.0.7",
    "@astrojs/sitemap": "^3.1.6",
    "@astrojs/tailwind": "^5.1.0",
    "@tailwindcss/typography": "^0.5.15",
    "@types/alpinejs": "^3.13.10",
    "alpinejs": "^3.14.1",
    "sharp": "^0.33.5",
    "tailwindcss": "^3.4.13",
    "typescript": "^5.6.3",
    "zod": "^3.23.8"
  }
}
```

**Package-Begründungen:**

| Package | Zweck | Begründung |
|---|---|---|
| `astro@^4.16` | Core Framework | LTS-Version, Content Collections stabil |
| `@astrojs/tailwind` | Tailwind-Integration | Offiziell, konfiguriert PostCSS automatisch |
| `tailwindcss@^3.4` | CSS-Framework | v3 stabil, v4 noch in Beta (zu riskant für Produktion) |
| `@tailwindcss/typography` | Prose-Styles für Markdown | Automatische Typografie für Blog-Artikel |
| `@astrojs/mdx` | MDX-Support | Ermöglicht React-Komponenten in Markdown (z.B. Spendenbox in Artikel) |
| `@astrojs/rss` | RSS-Feed | Offizielles Astro-Package, minimal |
| `@astrojs/sitemap` | XML-Sitemap | Automatische Generierung aus allen Routen |
| `@astrojs/alpinejs` | Alpine.js-Integration | Für Mobile Menu, Accordion, Tabs (minimal JS) |
| `alpinejs@^3.14` | Lightweight JS-Framework | ~15KB gzipped, kein Virtual DOM, ideal für kleine Interaktionen |
| `sharp@^0.33` | Bildoptimierung | Astro's Image-Service, konvertiert zu WebP/AVIF |
| `zod@^3.23` | Schema-Validierung | Für Content Collections Frontmatter-Validierung |
| `typescript@^5.6` | Typsicherheit | Astro hat First-Class TypeScript-Support |
| `@types/alpinejs` | TypeScript-Types für Alpine.js | Entwickler-Komfort |

**Nicht aufgenommene Packages (mit Begründung):**
- `framer-motion` — Zu schwer, unnötig für NGO-Site
- `react`/`vue`/`svelte` — Keine UI-Framework-Komponenten notwendig
- `@astrojs/image` — In Astro 4 ist Image-Optimierung in Core integriert (`astro:assets`)
- `gray-matter` — In Astro's Content Collections bereits integriert
- `date-fns` — Eigene `formatDate.ts`-Utility reicht für die Anforderungen
- `eslint` — Nützlich aber nicht Deployment-kritisch für V1

---

## 9. KRITISCHE SEO-KEYWORDS

### 9.1 Top 10 Primary Keywords

| # | Keyword | Suchvolumen | Intent | Schwierigkeit |
|---|---|---|---|---|
| 1 | `ladakh hilfsprojekte` | Niedrig (~100/Mo) | Informational | Gering |
| 2 | `kinderpatenschaft indien` | Mittel (~500/Mo) | Transactional | Mittel |
| 3 | `spenden ladakh` | Niedrig (~100/Mo) | Transactional | Gering |
| 4 | `buddhistische hilfsorganisation` | Niedrig (<50/Mo) | Informational | Gering |
| 5 | `nalanda schule ladakh` | Sehr niedrig (<50/Mo) | Navigational | Sehr gering |
| 6 | `lama konchok samten` | Sehr niedrig (<50/Mo) | Navigational | Sehr gering |
| 7 | `kinderpatenschaft buddhismus` | Niedrig (~100/Mo) | Transactional | Gering |
| 8 | `medizinische hilfe ladakh` | Sehr niedrig (<50/Mo) | Informational | Sehr gering |
| 9 | `waisenhaus indien spenden` | Niedrig (~200/Mo) | Transactional | Mittel |
| 10 | `ngo ladakh` | Niedrig (~100/Mo) | Informational | Gering |

**Strategische Einordnung:** Das Keyword-Universum dieser Nische ist klein, aber die Konkurrenz ist ebenfalls minimal. Eine gut optimierte Site kann für fast alle relevanten Begriffe auf Seite 1 ranken. Der strategische Vorteil liegt nicht im hohen Suchvolumen sondern in der hohen Konversionsrate: wer "kinderpatenschaft ladakh" sucht, ist direkt kaufbereit.

### 9.2 Keyword-Zuordnung je Seite

| Seite | Primary Keyword | Secondary Keywords |
|---|---|---|
| `/` (Homepage) | `himalaya-haus e.v. ladakh` | `hilfsprojekte ladakh`, `buddhistische ngo`, `spenden ladakh indien` |
| `/projekte/nalanda-schule/` | `nalanda schule ladakh` | `schule ladakh bauen`, `bildung ladakh kinder`, `schulprojekt indien spenden` |
| `/projekte/waisenhaus/` | `waisenhaus ladakh spenden` | `waisenhaus indien`, `kinder ladakh helfen`, `himalaya waisenhaus` |
| `/projekte/kinderpatenschaft/` | `kinderpatenschaft ladakh` | `kind aus indien unterstützen`, `kinderpatenschaft indien kosten`, `patenschaft buddhistisch` |
| `/projekte/medical-camp/` | `medical camp ladakh` | `medizinische versorgung ladakh`, `ärztliche hilfe himalaya` |
| `/ueber-uns/lama-konchok/` | `lama konchok samten` | `drikung kagyu mönch`, `tibetischer mönch frankfurt`, `lama konchok biografie` |
| `/ueber-uns/` | `himalaya-haus verein` | `verein ladakh hilfe`, `gemeinnütziger verein buddhismus` |
| `/unterstuetzen/spenden/` | `himalaya-haus spenden` | `ngo spenden steuerlich absetzbar`, `bankdaten himalaya haus`, `spendenquittung verein` |
| `/blog/` | `ladakh blog` | `neuigkeiten ladakh`, `schulbau ladakh fortschritt`, `lama konchok reisebericht` |
| `/kontakt/` | `himalaya-haus kontakt` | `kontakt verein ladakh`, `himalaya haus frankfurt` |

### 9.3 Content-Gap-Analyse: Höchstes SEO-Potenzial für Blog

**Priorität 1: Informational + Long-tail (geringer Wettbewerb, echter Traffic)**

1. **"Leben in Ladakh — wie ist es für Kinder in der Region wirklich?"**
   - Keyword: `kinder ladakh` (informational)
   - Warum: Hohes emotionales Engagement, Einstiegspunkt für potenzielle Paten

2. **"Wie funktioniert eine Kinderpatenschaft? — Unsere Erfahrungen aus Ladakh"**
   - Keyword: `kinderpatenschaft wie funktioniert das`
   - Warum: Direkte Conversion-Relevanz, hoher Transactional Intent

3. **"Baufortschritt der Nalanda Schule — Update [Quartal/Jahr]"**
   - Keyword: `nalanda schule update`, `schulbau ladakh`
   - Warum: Regelmäßig aktualisierbar, hält Stammbesucher engagiert, zeigt Transparenz

4. **"Drikung Kagyü — Was ist diese buddhistische Tradition?"**
   - Keyword: `drikung kagyu`, `tibetischer buddhismus tradition`
   - Warum: Zero-Competition-Nische auf Deutsch, baut thematische Autorität auf, Lama Konchok ist authentische Quelle

5. **"Medizinische Versorgung in Ladakh — Was fehlt wirklich?"**
   - Keyword: `gesundheitsversorgung ladakh`, `medical camp himalaya`
   - Warum: Verbindet SEO mit Spendenmotivation

6. **"Steuerlich absetzen: Ihre Spende an Himalaya-Haus e.V."**
   - Keyword: `spende steuerlich absetzen ngo`
   - Warum: Praktische Info mit Conversion-Funktion, wird von Spendern aktiv gesucht

7. **"Ladakh im Winter — warum Hilfsprojekte ganzjährig arbeiten müssen"**
   - Keyword: `ladakh winter`, `ladakh reise erfahrungen`
   - Warum: Lama Konchoks persönliche Berichte, starkes Storytelling, hohe Sharing-Rate

8. **"Bildung als Befreiung — Warum Schule in Ladakh ein Akt des Mitgefühls ist"**
   - Keyword: `bildung entwicklungsländer bedeutung`
   - Warum: Thought-Leadership, hoher Backlink-Potenzial von buddhistischen und NGO-Blogs

9. **"Wie kommt Ihre Spende bei uns an? — Vollständige Transparenz"**
   - Keyword: `spende transparenz ngo`, `mittelverwendung verein`
   - Warum: Vertrauensaufbau, YMYL-Kontext (Google bewertet Trustworthiness bei Spendenorganisationen besonders stark)

10. **"Kinderpatenschaft vs. einmalige Spende: Was hilft mehr?"**
    - Keyword: `kinderpatenschaft oder spende`, `patenschaft sinnvoll`
    - Warum: Hoher Transactional Intent, direkte SEO-Konkurrenz zu World Vision / SOS-Kinderdorf mit Long-tail-Flanke

**Strategische Content-Empfehlung:**
Ein Artikel pro Monat reicht für eine Organisation dieser Größe. Priorität: Baufortschritts-Updates der Nalanda Schule (regelmäßige Termine, Fotos von vor Ort = einzigartiger Content den kein Konkurrent hat), gefolgt von persönlichen Reiseberichten von Lama Konchok (authentisch, nicht replizierbar).

---

## Anhang: Wichtige Implementierungshinweise

### Joomla-Migration URL-Mapping

Vor dem Go-Live muss ein vollständiges Crawl der alten Site durchgeführt werden (z.B. mit Screaming Frog) um alle bestehenden URLs zu erfassen. Diese werden in `public/_redirects` als 301-Weiterleitungen eingetragen. Priorität: alle Seiten mit Backlinks (aus Google Search Console exportieren falls vorhanden).

### Bilder-Strategie

Alle Bilder sollten vor dem Upload:
1. Auf maximale Breite 1920px skaliert werden
2. Als JPG gespeichert werden (Astro konvertiert zu WebP/AVIF beim Build)
3. Einen aussagekräftigen Dateinamen haben (SEO: `baufortschritt-nalanda-schule-2025.jpg`, nicht `IMG_4829.jpg`)
4. Einen vollständigen Alt-Text im Frontmatter haben

### Datenschutzerklärung — Pflichtangaben

Die Datenschutzerklärung muss als Auftragsverarbeiter nennen:
- Formspree Inc. (Kontaktformular)
- Brevo SAS (Newsletter)
- Netlify Inc. (Hosting)
- Zukünftig: Plausible Analytics OÜ

Mustertext-Quelle: datenschutz-generator.de oder opr.vc/datenschutz

### Gründungsdatum Verein

Im Schema.org `foundingDate` muss das tatsächliche Vereinsgründungsdatum eingetragen werden (aus dem Vereinsregister). Placeholder `XXXX` ersetzen.

---

*Spezifikation erstellt: 2026-05-03*  
*Nächster Review: Nach Prototyp-Build, vor Go-Live*
