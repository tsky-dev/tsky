import { CredentialManager, XRPC } from '@atcute/client';
import { describe, expect, it } from 'vitest';
import { Tsky } from '~/index';

const formatSecret = (secret: string | undefined) => {
  if (!secret) {
    throw new Error('Secret is required');
  }

  return secret.replace(/^tsky /g, '').trim();
};

const env = process.env;
const TEST_CREDENTIALS = {
  alice: {
    handle: 'alice.tsky.dev',
    did: 'did:plc:jguhdmnjclquqf5lsvkyxqy3',
    appPassword: formatSecret(env.ALICE_APP_PASSWORD),
  },
  bob: {
    handle: 'bob.tsky.dev',
    did: 'did:plc:2ig7akkyfq256j42uxvc4g2h',
    appPassword: formatSecret(env.BOB_APP_PASSWORD),
  },
};

console.log('env keys', Object.keys(process.env));

async function getAliceTsky() {
  const manager = new CredentialManager({ service: 'https://bsky.social' });
  await manager.login({
    identifier: TEST_CREDENTIALS.alice.handle,
    password: TEST_CREDENTIALS.alice.appPassword,
  });

  const xrpc = new XRPC({ handler: manager });

  return new Tsky(xrpc);
}

describe('bsky', () => {
  it('.profile()', async () => {
    const tsky = await getAliceTsky();
    const profile = await tsky.bsky.profile(TEST_CREDENTIALS.alice.did);

    expect(profile).toBeDefined();
    expect(profile).toHaveProperty('handle', TEST_CREDENTIALS.alice.handle);
  });

  describe('feed', () => {
    it('.timeline()', async () => {
      const tsky = await getAliceTsky();

      const paginator = await tsky.bsky.feed.getTimeline({
        limit: 30,
      });

      expect(paginator).toBeDefined();
      expect(paginator.values).toBeDefined();
      expect(paginator.values).toBeInstanceOf(Array);
      expect(paginator.values.length).toBe(1); // we should get the first page from the paginator
      expect(paginator.values[0].feed.length).toBeGreaterThan(0); // alice has some posts ;)
      expect(paginator.values[0].feed[0]).toHaveProperty('post');
    });
  });
});