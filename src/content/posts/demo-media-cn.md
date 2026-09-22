---
title: 图片、媒体与 Aurora 功能测试
date: 2026-09-10
demo: true
slug: demo-media-cn
permalink: /post/demo-media/
translationKey: demo-media
lang: zh-CN
cover: https://picsum.photos/seed/aurora-demo-10/1600/900
tags: [图片, Lightbox, Aurora, 国际化, Pagefind]
categories: [设计, 指南]
description: 展示远程媒体、无障碍 alt 文本、灯箱增强、安全链接和 Aurora 元数据。
keywords: [极光搜索测试, Astro 国际化, 图片, Lightbox]
toc: true
comments: false
---

这篇文章结合极光搜索测试和媒体行为：每张图片都是普通 HTML，Lightbox island 只提供可选的键盘友好增强。

## 横向图片

<figure>
  <img src="https://picsum.photos/seed/aurora-media-landscape-cn/1400/780" alt="用于展示 Aurora 媒体能力的确定性风景图" title="Aurora 风景" />
  <figcaption>稳定尺寸、明确 alt 文本和可选标题的远程图片。</figcaption>
</figure>

## 竖向图片与第二张横图

<div class="media-gallery">
  <figure>
    <img src="https://picsum.photos/seed/aurora-media-portrait-cn/640/900" alt="Aurora 图库中的确定性竖向图片" />
    <figcaption>竖向</figcaption>
  </figure>
  <figure>
    <img src="https://picsum.photos/seed/aurora-media-wide-cn/1600/700" alt="Aurora 图库中的确定性宽幅图片" />
    <figcaption>宽幅</figcaption>
  </figure>
</div>

[Aurora 仓库](https://github.com/yanpuzhen/astro-theme-aurora)是外部链接，[数学展示](/cn/post/demo-math/)是站内链接，[English media](/post/demo-media/)用于测试语言切换目标。

长 URL `https://yanpuzhen.github.io/astro-theme-aurora/demo/cn/post/demo-media/` 应该在文章内部换行或滚动，不应造成整页横向溢出。
