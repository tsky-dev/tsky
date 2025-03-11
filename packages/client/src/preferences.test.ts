import { describe, expect, it } from 'vitest';
import { createAgent } from '~/index';

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

describe('preferences', () => {
  it('.get()', async () => {
    const agent = await createAgent({
      credentials: {
        identifier: TEST_CREDENTIALS.alice.handle,
        password: TEST_CREDENTIALS.alice.password,
      },
    });
    const preferences = await agent.user.preferences.get();

    expect(preferences).toBeDefined();
  });

  it('.set()', async () => {
    const agent = await createAgent({
      credentials: {
        identifier: TEST_CREDENTIALS.alice.handle,
        password: TEST_CREDENTIALS.alice.password,
      },
    });

    const payload = {
      $type: 'app.bsky.actor.defs.adultContentPref',
      enabled: false,
    };

    await agent.user.preferences.set([payload]);

    const preferences = await agent.user.preferences.get();

    expect(preferences).toBeDefined();

    const pref = preferences.find((p) => p.$type === payload.$type);

    expect(pref).toBeDefined();
    expect(pref).toHaveProperty('enabled');

    // @ts-ignore
    expect(pref.enabled).toBe(payload.enabled);
  });
});
