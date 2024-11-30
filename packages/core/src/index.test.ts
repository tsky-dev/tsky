import { describe, expect, it } from 'vitest';

describe('tSky', () => {
  it('profile', async () => {
    // TODO: use actual client
    const profile = {
      handle: 'alice.tsky.dev',
    };

    expect(profile).toBeDefined();
    expect(profile).toHaveProperty('handle', 'alice.tsky.dev');
  });
});
