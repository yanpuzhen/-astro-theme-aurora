---
title: Routing & Deployment
date: 2026-09-16
demo: true
permalink: /routing-and-deployment/
tags: [routing, GitHub Pages, deployment]
categories: engineering
description: A custom-permalink example that remains correct below the Demo base path.
excerpt: Every internal link is composed from Astro's configured base instead of assuming the site lives at /.
keywords: [GitHub Pages, nested base, permalink]
lang: en
comments: false
---

This article uses a custom permalink in frontmatter. Its public URL is still composed with the deployment base:

`/astro-theme-aurora/demo/routing-and-deployment/`

The [documentation](/) and [GitHub repository](https://github.com/yanpuzhen/astro-theme-aurora) remain available from the Demo menu. Try opening the page directly, then use the header to move between the home page, taxonomies, and search.

:::warning
The path in this example is intentionally explicit. When migrating an existing blog, verify old URLs and comment identities before changing them.
:::
