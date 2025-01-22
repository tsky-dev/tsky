import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json-summary', 'json', 'html'],
      reportOnFailure: true,
    }
  },
  resolve: {
    alias: {
      '~': '/src',
    },
  },
});
