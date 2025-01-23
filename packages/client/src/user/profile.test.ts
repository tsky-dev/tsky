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

describe('profile', async () => {
  const tsky = new Tsky();

  await tsky.auth.login(
    TEST_CREDENTIALS.alice.handle,
    TEST_CREDENTIALS.alice.password,
  );

  it("Getting alice's profile", async () => {
    const profile = await tsky.user.profile();

    expect(profile).toBeDefined();
    expect(profile.handle).toBe(TEST_CREDENTIALS.alice.handle);
  });

  it("Switching to bob's profile", async () => {
    await tsky.auth.login(
      TEST_CREDENTIALS.bob.handle,
      TEST_CREDENTIALS.bob.password,
    );
  });

  it("Getting bob's profile", async () => {
    const profile = await tsky.user.profile();

    expect(profile).toBeDefined();
    expect(profile.handle).toBe(TEST_CREDENTIALS.bob.handle);
  });
});
