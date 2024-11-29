import { defineConfig } from 'vitepress'
import typedocSidebar from '../api/typedoc-sidebar.json';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "TSky",
  description: "A BlueSky API client for nimble apps and tools",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/examples' }
    ],

    sidebar: [
      { text: 'Getting Started', link: '/getting-started' },
      { text: 'API', items: typedocSidebar },
      {
        text: 'Examples',
        link: '/examples',
      }
    ],

    search: {
      provider: 'local'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/tsky-dev/tsky' }
    ],

    editLink: {
      pattern: 'https://github.com/tsky-dev/tsky/edit/main/docs/:path',
    }
  }
})
