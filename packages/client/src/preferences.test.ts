import type { AppBskyActorDefs } from '@atcute/bluesky';
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
      $type: 'app.bsky.actor.defs#adultContentPref',
      enabled: false,
    } as const satisfies AppBskyActorDefs.AdultContentPref;

    await agent.user.preferences.set([payload]);

    const preferences = await agent.user.preferences.get();

    expect(preferences).toBeDefined();

    const pref = preferences?.find(
      (p: unknown): p is AppBskyActorDefs.AdultContentPref =>
        (p as { $type: string }).$type ===
        'app.bsky.actor.defs#adultContentPref',
    );

    expect(pref).toBeDefined();
    expect(pref).toHaveProperty('enabled');

    // @ts-ignore
    expect(pref.enabled).toBe(payload.enabled);
  });
});
