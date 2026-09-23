import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'
import { normalizeLegacyData } from './lib/content'

const scalarOrList = z.union([z.string(), z.array(z.string())]).optional()
const booleanLike = z.union([z.boolean(), z.string(), z.number()]).optional()
const author = z.union([
  z.string(),
  z.object({
    name: z.string().optional(), slug: z.string().optional(), avatar: z.string().optional(),
    link: z.string().optional(), description: z.string().optional(), socials: z.record(z.string()).optional(),
  }).passthrough(),
]).optional()

const sharedSchema = z.object({
  title: z.string().min(1), date: z.coerce.date(), updated: z.coerce.date().optional(),
  tags: scalarOrList, categories: scalarOrList, cover: scalarOrList,
  description: z.string().optional(), excerpt: z.string().optional(), abstracts: z.string().optional(),
  preview: z.number().optional(), keywords: scalarOrList, author,
  feature: booleanLike, sticky: booleanLike, pinned: booleanLike, slug: z.string().optional(),
  permalink: z.string().optional(), permalinkMode: z.enum(['slug', 'uid', 'explicit']).optional(),
  uid: z.string().optional(), legacyUid: z.string().optional(), legacyPermalink: scalarOrList,
  legacyPermalinks: scalarOrList, aliases: scalarOrList, photos: z.array(z.string()).optional(),
  toc: z.union([z.boolean(), z.string()]).optional(), comment: booleanLike, comments: booleanLike,
  commentId: z.string().optional(), commentPath: z.string().optional(), lang: z.string().optional(),
  translationKey: z.string().optional(),
  hidden: booleanLike, published: booleanLike, draft: booleanLike, rawHtml: booleanLike,
  allowHtml: booleanLike, type: z.string().optional(), categoryMode: z.string().optional(),
  data: z.unknown().optional(), demo: booleanLike, rss: booleanLike, sitemap: booleanLike,
}).passthrough()

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: sharedSchema.transform((value) => normalizeLegacyData(value, 'post')),
})

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: sharedSchema.transform((value) => normalizeLegacyData(value, 'page')),
})

export const collections = { posts, pages }
