export interface AuroraConfig {
  site: {
    title: string
    subtitle: string
    author: string
    description: string
    language: string
  }
  theme: { feature: boolean; darkMode: boolean; profileShape: 'circle' | 'diamond' | 'rounded'; colors: [string, string, string] }
  menu: { label: string; href: string }[]
  comments: { provider: 'gitalk' | 'valine' | 'twikoo' | 'waline' | 'none'; enabled: boolean; gitalkIdMode: 'uid' | 'pathname' }
}

const configuredProvider = import.meta.env.PUBLIC_COMMENT_PROVIDER
const provider = configuredProvider === 'gitalk' || configuredProvider === 'valine' || configuredProvider === 'twikoo' || configuredProvider === 'waline' ? configuredProvider : 'none'

export const config: AuroraConfig = {
  site: {
    title: 'Aurora', subtitle: "Aurora's Blog", author: 'Aurora',
    description: 'An Aurora blog powered by Astro.', language: 'en',
  },
  theme: {
    feature: true, darkMode: true, profileShape: 'diamond',
    colors: ['#24c6dc', '#5433ff', '#ff0099'],
  },
  menu: [
    { label: 'Home', href: '/' }, { label: 'Tags', href: '/tags/' },
    { label: 'Archives', href: '/archives/' }, { label: 'About', href: '/about/' },
  ],
  comments: { provider, enabled: provider !== 'none', gitalkIdMode: import.meta.env.PUBLIC_GITALK_ID_MODE === 'pathname' ? 'pathname' : 'uid' },
}
