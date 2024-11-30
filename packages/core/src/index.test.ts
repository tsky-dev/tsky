import { describe, expect, it } from 'vitest';
import { TSky } from './index';

describe('tSky', () => {
  it('get Profile', async () => {
    const tSky = new TSky();
    const profile = await tSky.profile('');

    expect(profile).toEqual({
      handle: 'tSky',
    });
  });
});
