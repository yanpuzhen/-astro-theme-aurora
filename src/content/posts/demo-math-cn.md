---
title: 数学公式与科学写作测试
date: 2026-09-12
demo: true
slug: demo-math-cn
permalink: /post/demo-math/
translationKey: demo-math
lang: zh-CN
cover: https://picsum.photos/seed/aurora-demo-08/1600/900
tags: [数学, KaTeX, 科学写作, Markdown]
categories: [科学, 指南]
description: 使用构建期 KaTeX 渲染行内公式、块级公式、矩阵和科学写作。
keywords: [矩阵公式, Aurora 数学, 高斯积分]
toc: true
comments: false
---

矩阵公式是稳定的搜索标记。公式在构建期完成渲染，因此关闭 JavaScript 后仍然可读。

## 行内与块级公式

著名的质能方程是 $E = mc^2$，二次方程的根为：

$$
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$

高斯积分为：

$$
\int_{-\infty}^{\infty} e^{-x^2}\,dx = \sqrt{\pi}
$$

## 求和、希腊字母与上下标

$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}, \qquad \alpha_0 < \alpha_1 < \alpha_2
$$

像 $a_1$、$x^2$ 和 $\sigma_{total}$ 这样的上下标会留在公式中，不会显示原始 LaTeX。

## 矩阵乘法

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

当环境有效时，KaTeX 也支持对齐公式：

$$
\begin{aligned}
f(x) &= x^2 + 2x + 1 \\
      &= (x+1)^2
\end{aligned}
$$
