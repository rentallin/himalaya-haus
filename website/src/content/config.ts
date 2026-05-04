import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.enum(['Lama Konchok Samten', 'Himalaya-Haus e.V.', 'Redaktion']).default('Himalaya-Haus e.V.'),
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),
    category: z.enum([
      'schulbau',
      'waisenhaus',
      'medical-camp',
      'kinderpatenschaft',
      'reisebericht',
      'vereinsnews',
      'ladakh-kultur',
    ]),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
  }),
});

const projekte = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    status: z.enum(['im-bau', 'aktiv', 'abgeschlossen', 'planung']),
    order: z.number().int(),
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),
    startDate: z.coerce.date().optional(),
    location: z.string().default('Ladakh, Indien'),
    targetAmount: z.number().optional(),
    raisedAmount: z.number().optional(),
    beneficiaries: z.string().optional(),
    icon: z.string().optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
  }),
});

export const collections = { blog, projekte };
