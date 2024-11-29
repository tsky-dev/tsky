import { defineConfig } from 'vitepress'

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
      { text: 'API Reference', link: '/api',
        items: [
          { text: 'new Tsky', link: '/api#tsky' },
          { text: 'tsky.profile', link: '/api#profile' },
          { text: 'tsky.typeahead', link: '/api#typeahead' }
        ],
      },
      {
        text: 'Examples',
        link: '/examples',
      }
    ],

    search: {
      provider: 'local'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],

    editLink: {
      pattern: 'https://github.com/tsky-dev/tsky/edit/main/docs/:path',
    }
  }
})
