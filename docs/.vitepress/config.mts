import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'TSky',
  description: 'A BlueSky API client for nimble apps and tools',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/examples' },
    ],

    sidebar: [
      { text: 'Getting Started', link: '/getting-started' },
      {
        text: 'API Reference',
        link: '/api',
        items: [
          { text: 'new Tsky', link: '/api#tsky' },
          { text: 'tsky.profile', link: '/api#profile' },
          { text: 'tsky.typeahead', link: '/api#typeahead' },
        ],
      },
      {
        text: 'Examples',
        link: '/examples',
      },
    ],

    search: {
      provider: 'local',
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/tsky-dev/tsky' },
      { icon: 'discord', link: 'https://discord.gg/f7XWweBJQP' },
      { icon: 'bluesky', link: 'https://bsky.app/profile/tsky.dev' },
    ],

    editLink: {
      pattern: 'https://github.com/tsky-dev/tsky/edit/main/docs/:path',
    },
  },
});
