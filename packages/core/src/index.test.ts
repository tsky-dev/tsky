import { describe, expect, it } from 'vitest';
import { TSky } from './index';

const ALICE_DID = 'did:plc:jguhdmnjclquqf5lsvkyxqy3';
const BOB_DID = 'did:plc:2ig7akkyfq256j42uxvc4g2h';

const env = process.env;
const TEST_CREDENTIALS = {
  alice: {
    handle: 'tSky',
    did: ALICE_DID,
    appPassword: env.ALICE_APP_PASSWORD,
  },
  bob: {
    handle: 'tSky',
    did: BOB_DID,
    appPassword: env.BOB_APP_PASSWORD,
  },
};
const TEST_ENDPOINT = 'https://bsky.social';

describe('tSky', () => {
  const tSky = new TSky({
    url: TEST_ENDPOINT,
    identifier: TEST_CREDENTIALS.alice.did,
    password: TEST_CREDENTIALS.alice.appPassword,
  });

  it('get Profile', async () => {
    const profile = await tSky.profile(ALICE_DID);

    expect(profile).toBeDefined();
    expect(profile).toHaveProperty('handle', 'alice.tsky.dev');
  });
});
