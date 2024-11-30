import { describe, expect, it } from 'vitest';
import { TSky } from './index';
import { PasswordSession } from './tsky/session';

const env = process.env;
const TEST_CREDENTIALS = {
  alice: {
    handle: 'alice.tsky.dev',
    did: 'did:plc:jguhdmnjclquqf5lsvkyxqy3',
    appPassword: env.ALICE_APP_PASSWORD,
  },
  bob: {
    handle: 'bob.tsky.dev',
    did: 'did:plc:2ig7akkyfq256j42uxvc4g2h',
    appPassword: env.BOB_APP_PASSWORD,
  },
};
const TEST_ENDPOINT = 'https://bsky.social';

describe('tSky', () => {
  it('.profile()', async () => {
    const session = new PasswordSession(TEST_ENDPOINT);
    await session.login(TEST_CREDENTIALS.alice.did, TEST_CREDENTIALS.alice.appPassword);

    const tSky = new TSky(session);

    const profile = await tSky.profile(TEST_CREDENTIALS.alice.did);

    expect(profile).toBeDefined();
    expect(profile).toHaveProperty('handle', TEST_CREDENTIALS.alice.handle);
  });

  describe('feed', () => {
    it('.timeline()', async () => {
      const session = new PasswordSession(TEST_ENDPOINT);
      await session.login(TEST_CREDENTIALS.alice.did, TEST_CREDENTIALS.alice.appPassword);

      const tSky = new TSky(session);

      const paginator = tSky.feed.timeline({
        limit: 30,
      });

      await paginator.next();

      expect(paginator).toBeDefined();
      expect(paginator.values).toBeDefined();
      expect(paginator.values).toBeInstanceOf(Array);
      expect(paginator.values.length).toBe(1); // we should get the first page from the paginator
      expect(paginator.values[0].feed.length).toBeGreaterThan(0); // alice has some posts ;)
      expect(paginator.values[0].feed[0]).toHaveProperty('post');
    });
  });
});
