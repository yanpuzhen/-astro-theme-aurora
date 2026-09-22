---
title: Images, Media and Aurora Features
date: 2026-09-10
demo: true
slug: demo-media
translationKey: demo-media
lang: en
cover: https://picsum.photos/seed/aurora-demo-09/1600/900
tags: [Images, Lightbox, Aurora, i18n, Pagefind]
categories: [Design, Guide]
description: Remote media, accessible alt text, lightbox enhancement, safe links, and Aurora-specific metadata.
keywords: [AuroraSearchAlpha, Astro internationalization, images, lightbox]
toc: true
comments: false
feature: false
---

This article combines AuroraSearchAlpha with media behavior: every image remains ordinary HTML, while the Lightbox island adds an optional keyboard-friendly enhancement.

## A landscape image

<figure>
  <img src="https://picsum.photos/seed/aurora-media-landscape/1400/780" alt="A deterministic landscape used to demonstrate Aurora media" title="Aurora landscape" />
  <figcaption>A remote image with stable dimensions, meaningful alt text, and an optional title.</figcaption>
</figure>

## A portrait and a second landscape

<div class="media-gallery">
  <figure>
    <img src="https://picsum.photos/seed/aurora-media-portrait/640/900" alt="A deterministic portrait image in the Aurora gallery" />
    <figcaption>Portrait</figcaption>
  </figure>
  <figure>
    <img src="https://picsum.photos/seed/aurora-media-wide/1600/700" alt="A wide deterministic image in the Aurora gallery" />
    <figcaption>Wide</figcaption>
  </figure>
</div>

The [Aurora repository](https://github.com/yanpuzhen/astro-theme-aurora) is an external link. The [math showcase](/post/demo-math/) is an internal link, and [Unicode 设计](/cn/post/demo-media/) tests a locale-aware target.

The long URL `https://yanpuzhen.github.io/astro-theme-aurora/demo/post/demo-media/` should wrap or scroll inside the article without creating document-wide overflow.
