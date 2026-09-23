# 主题

在仓库根目录 `_config.yml` 中设置支持的主题字段：

```yaml
theme:
  feature: true
  dark_mode: true # 初始外观；访客仍可切换并保存选择
  profile_shape: diamond # circle | diamond | rounded
  gradient:
    color_1: '#24c6dc'
    color_2: '#5433ff'
    color_3: '#ff0099'
```

`feature` 控制现有首页文章选择模式。`dark_mode` 设置初始外观；访客明确选择优先级更高，并保存在浏览器本地。`profile_shape` 同时用于侧栏和页脚头像。三个十六进制颜色会写入 Aurora 渐变 CSS 变量。

外观切换属于增强功能；禁用 JavaScript 后静态内容和导航仍然可读。主题选择只保存在浏览器，不会发送到服务器。
