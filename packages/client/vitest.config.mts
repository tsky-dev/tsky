import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'istanbul',
    }
  },
  resolve: {
    alias: {
      '~': '/src',
    },
  },
});
