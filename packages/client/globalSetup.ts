import type { TestProject } from 'vitest/node';

import { CredentialManager, XRPC } from '@atcute/client';
import { TestNetwork } from '@atproto/dev-env';

let network: TestNetwork;

export async function setup(project: TestProject) {
  network = await TestNetwork.create({});
  console.log(
    `🌐 Created test network:\n- pds: ${network.pds.url}\n- plc: ${network.plc.url}`,
  );

  const manager = new CredentialManager({ service: network.pds.url });
  const rpc = new XRPC({
    handler: manager,
  });

  await createAccount(rpc, 'alice.test');
  await createAccount(rpc, 'bob.test');

  project.provide('testPdsUrl', network.pds.url);
  project.provide('testPlcUrl', network.plc.url);
}

export async function teardown() {
  await network.close();
}

const createAccount = async (rpc: XRPC, handle: string) => {
  await rpc.call('com.atproto.server.createAccount', {
    data: {
      handle: handle,
      email: `${handle}@example.com`,
      password: 'password',
    },
  });
  console.log(`🙋 Created new account: @${handle}`);
};

declare module 'vitest' {
  export interface ProvidedContext {
    testPdsUrl: string;
    testPlcUrl: string;
  }
}
