import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import alpinejs from '@astrojs/alpinejs';

const isGitHubPages = process.env.GITHUB_PAGES === 'true';

export default defineConfig({
  site: isGitHubPages ? 'https://rentallin.github.io' : 'https://www.himalayahaus.de',
  base: isGitHubPages ? '/himalaya-haus' : undefined,
  trailingSlash: 'always',
  output: 'static',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap({
      filter: (page) => !page.includes('/danke') && !page.includes('/404'),
    }),
    mdx(),
    alpinejs(),
  ],
  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
  markdown: {
    shikiConfig: { theme: 'github-light' },
  },
  vite: {
    build: { cssMinify: true },
  },
});
