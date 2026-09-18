import { defineCollection, z } from 'astro:content'

const list = z.union([z.string(), z.array(z.string())]).optional().default([])

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: list,
    categories: list,
    slug: z.string().optional(),
    uid: z.string().optional(),
    description: z.string().optional(),
    comments: z.boolean().optional().default(true),
    feature: z.boolean().optional().default(false),
    pinned: z.boolean().optional().default(false),
    hidden: z.boolean().optional().default(false),
    lang: z.string().optional().default('en'),
  }),
})

export const collections = { posts }
