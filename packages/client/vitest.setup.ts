import { afterAll, beforeAll } from 'vitest';

import { CredentialManager, XRPC } from '@atcute/client';
import { TestNetwork } from '@atcute/internal-dev-env';

declare global {
  var TEST_NETWORK: TestNetwork;
}

beforeAll(async () => {
  globalThis.TEST_NETWORK = await TestNetwork.create({});

  const rpc = new XRPC({
    handler: new CredentialManager({ service: TEST_NETWORK.pds.url }),
  });
  await createAccount(rpc, 'alice.test');
  await createAccount(rpc, 'bob.test');
});

afterAll(async () => {
  await TEST_NETWORK.close();
});

const createAccount = async (rpc: XRPC, handle: string) => {
  await rpc.call('com.atproto.server.createAccount', {
    data: {
      handle: handle,
      email: `${handle}@example.com`,
      password: 'password',
    },
  });
};
