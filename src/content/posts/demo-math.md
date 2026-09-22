---
title: Mathematics and Scientific Writing
date: 2026-09-12
demo: true
slug: demo-math
translationKey: demo-math
lang: en
cover: https://picsum.photos/seed/aurora-demo-07/1600/900
tags: [Math, KaTeX, Science, Markdown]
categories: [Science, Guide]
description: Build-time KaTeX rendering for inline equations, displays, matrices, and scientific prose.
keywords: [MatrixFormula, Aurora math, Gaussian integral]
toc: true
comments: false
---

MatrixFormula is a stable search marker. Equations are rendered at build time, so the meaning remains visible with JavaScript disabled.

## Inline and display math

The famous relation is $E = mc^2$, while the quadratic roots are given by:

$$
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$

The Gaussian integral is:

$$
\int_{-\infty}^{\infty} e^{-x^2}\,dx = \sqrt{\pi}
$$

## Summation, Greek symbols, and indices

$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}, \qquad \alpha_0 < \alpha_1 < \alpha_2
$$

Subscripts and superscripts such as $a_1$, $x^2$, and $\sigma_{total}$ stay inside the equation rather than becoming raw LaTeX text.

## Matrix multiplication

$$
\begin{bmatrix}
1 & 2 \\
3 & 4
\end{bmatrix}
\begin{bmatrix}
a \\
b
\end{bmatrix}
=
\begin{bmatrix}
a+2b \\
3a+4b
\end{bmatrix}
$$

Aligned equations are supported by KaTeX when the environment is valid:

$$
\begin{aligned}
f(x) &= x^2 + 2x + 1 \\
      &= (x+1)^2
\end{aligned}
$$
