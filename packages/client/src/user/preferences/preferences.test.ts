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

describe('preferences', () => {
  it('.get()', async () => {
    const tsky = await getAliceTsky();
    const preferences = await tsky.user.preferences.get();

    expect(preferences).toBeDefined();
  });

  it('.set()', async () => {
    const tsky = await getAliceTsky();

    const payload = {
      $type: 'app.bsky.actor.defs.adultContentPref',
      enabled: false,
    };

    await tsky.user.preferences.set([payload]);

    const preferences = await tsky.user.preferences.get();

    expect(preferences).toBeDefined();

    const pref = preferences.find((p) => p.$type === payload.$type);

    expect(pref).toBeDefined();
    expect(pref).toHaveProperty('enabled');

    // @ts-ignore
    expect(pref.enabled).toBe(payload.enabled);
  });
});
