# 基础配置

仓库根目录的 `_config.yml` 是日常 Aurora 设置的唯一用户入口。构建时会解析 YAML、规范化明确支持的 Aurora 2 别名、用 Zod 校验规范配置、补默认值，最后应用环境变量覆盖。优先级为**环境变量覆盖 > `_config.yml` > Aurora 默认值**。缺少文件时使用默认值；YAML 错误、未知规范字段或非法值会显示字段路径并停止构建。组件只读取规范化后的配置，不会在浏览器解析 YAML。

```yaml
site:
  title: 我的 Aurora 博客
  subtitle: 个人博客
  author: 你的名字
  description: 静态优先的多语言博客。
  avatar: /images/avatar.png
  logo: /favicon.svg
  language: zh-CN # en | zh-CN；路由仍固定为英文和简体中文
  started_date: '' # 可选 YYYY-MM-DD
  url: https://example.com # 仅 origin，不含路径、查询或片段
  base: / # 也可为 /aurora/、/blog/theme/ 等
theme:
  feature: true
  dark_mode: true
  profile_shape: diamond # circle | diamond | rounded
  gradient: { color_1: '#24c6dc', color_2: '#5433ff', color_3: '#ff0099' }
menu: { home: true, tags: true, categories: true, archives: true, about: true, links: false }
socials:
  - { label: GitHub, href: https://github.com/you, icon: github }
```

## 配置范围

| 区块 | 用途与校验 |
| --- | --- |
| `site` | 标题、副标题、作者、描述、头像/Logo、显示语言、真实 `YYYY-MM-DD`、仅 origin 的 HTTP(S) URL、安全 base 路径。 |
| `i18n` | 固定英文默认语言和 `[en, zh-CN]`；不是任意语言插件接口。 |
| `theme` | 精选逻辑、初始明暗主题、头像形状、三个十六进制渐变色。 |
| `menu` | 六个内置路由的布尔开关；菜单标签和路由结构固定并本地化。 |
| `socials` | 最多 32 个安全 HTTP(S)、`mailto:` 或 `tel:` 链接；图标为 `github` 或 `link`。 |
| `comments` | `provider` 和已测试的 provider 字段；见[集成](/cn/configs/integrations)。不接受客户端 secret 字段。 |
| `dia` | 启用开关、`auto`/英文/中文 locale、最多 20 条短提示。 |
| `footer` | 版本/头像显示、仅用于展示的手动统计字符串、可选备案链接；不代表存在统计后端。 |
| `links` | 最多 200 条校验过的友链：名称、URL、头像、描述、分类和颜色。 |
| `seo` | 最多 40 个站点关键词；文章 frontmatter 关键词优先。 |

规范配置区块为严格模式，未知字段会报错，避免拼写错误被忽略。YAML 布尔值请写 `true`/`false`，日期写带引号的 ISO 字符串，颜色使用十六进制。除社交链接允许 `mailto:`/`tel:` 外，URL 必须为绝对 HTTP(S)。静态配置不得保存秘密：传给浏览器的任何值都是公开的。

### 环境变量覆盖

`ASTRO_SITE` 和 `ASTRO_BASE` 分别覆盖 `site.url`、`site.base`。为部署/CI 兼容保留的可选 `PUBLIC_AURORA_*`、`PUBLIC_COMMENT_PROVIDER` 和 provider `PUBLIC_*` 也是构建期公开覆盖；留空即可使用 YAML。`PUBLIC_AURORA_DIA` 必须是明确布尔字符串。`ASTRO_DEMO_BUILD`、`ASTRO_CONFIG_FILE` 和 `ASTRO_PREFLIGHT_TESTS` 是构建/测试控制，不是日常主题设置。完整列表见 `.env.example`。

GFM、KaTeX 数学公式和 Shiki 是始终启用的构建能力，不提供无效开关。Demo 身份与内容由独立 Demo 构建选择，不会继承生产用户配置。
