# 主题

Aurora 有三种有效的外观状态：浅色、深色和系统偏好回退。首次加载时，head 中的脚本读取系统偏好；Theme island 会把明确选择保存在 `localStorage` 的 `aurora-theme` 中。

当前默认值位于 `src/lib/config.ts`：

```ts
theme: {
  feature: true,
  darkMode: true,
  profileShape: 'diamond',
  colors: ['#24c6dc', '#5433ff', '#ff0099'],
}
```

`darkMode` 和 `profileShape` 属于类型化配置面；当前公开 shell 提供浅色/深色切换与 Aurora 渐变系统。切换属于增强功能，生成后的内容和导航不依赖它。

响应式布局覆盖首页网格、文章、taxonomy 卡片、归档、搜索和移动导航。主题选择只保存在当前浏览器，不会发送到服务器。
