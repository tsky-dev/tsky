import { describe, expect, it } from 'vitest';
import { Tsky } from '~/index';

const TEST_CREDENTIALS = {
  alice: {
    handle: 'alice.tsky.dev',
    did: 'did:plc:jguhdmnjclquqf5lsvkyxqy3',
    password: 'alice_and_bob',
  },
  bob: {
    handle: 'bob.tsky.dev',
    did: 'did:plc:2ig7akkyfq256j42uxvc4g2h',
    password: 'alice_and_bob',
  },
};

async function getAliceTsky() {
  const tsky = new Tsky();

  await tsky.auth.login(
    TEST_CREDENTIALS.alice.handle,
    TEST_CREDENTIALS.alice.password,
  );

  return tsky;
}

describe('feed', () => {
  it('.getFeed()', async () => {
    const tsky = await getAliceTsky();
    const paginator = await tsky.bsky.feed.getFeed({
      // "Birds! 🦉" custom feed
      // - https://bsky.app/profile/daryllmarie.bsky.social/feed/aaagllxbcbsje
      feed: 'at://did:plc:ffkgesg3jsv2j7aagkzrtcvt/app.bsky.feed.generator/aaagllxbcbsje',
      limit: 30,
    });
    expect(paginator).toBeDefined();
    expect(paginator.values).toBeDefined();
    expect(paginator.values).toBeInstanceOf(Array);
    expect(paginator.values.length).toBe(1); // we should get the first page from the paginator
    expect(paginator.values[0].feed.length).toBeGreaterThan(0); // we found some birds posts ;)
    expect(paginator.values[0].feed[0]).toHaveProperty('post');
  });
});
