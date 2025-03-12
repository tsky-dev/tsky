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

describe('profile', async () => {
  it("Getting alice's profile", async () => {
    const agent = await createAgent({
      credentials: {
        identifier: TEST_CREDENTIALS.alice.handle,
        password: TEST_CREDENTIALS.alice.password,
      },
    });

    const profile = await agent.user.profile();

    expect(profile).toBeDefined();
    expect(profile.handle).toBe(TEST_CREDENTIALS.alice.handle);
  });

  it("Getting bob's profile", async () => {
    const agent = await createAgent({
      credentials: {
        identifier: TEST_CREDENTIALS.bob.handle,
        password: TEST_CREDENTIALS.bob.password,
      },
    });

    const profile = await agent.user.profile();

    expect(profile).toBeDefined();
    expect(profile.handle).toBe(TEST_CREDENTIALS.bob.handle);
  });
});
