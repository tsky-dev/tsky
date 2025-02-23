import fs from 'node:fs/promises';

import type { TestProject } from 'vitest/node';

import { CredentialManager, XRPC } from '@atcute/client';
import { TestNetwork } from '@atcute/internal-dev-env';

declare module 'vitest' {
  export interface ProvidedContext {
    testPdsUrl: string;
    testPlcUrl: string;
  }
}

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

  await manager.login({ identifier: 'alice.test', password: 'password' });
  await createProfileRecord(rpc, 'alice.test');
  await createSamplePosts(rpc, 'alice.test');

  await manager.login({ identifier: 'bob.test', password: 'password' });
  await createProfileRecord(rpc, 'bob.test');
  await createSamplePosts(rpc, 'bob.test');

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

async function createProfileRecord(rpc: XRPC, handle: string) {
  const imageBuffer = await fs.readFile('alice-avatar.jpeg');
  const { data: blob } = await rpc.call('com.atproto.repo.uploadBlob', {
    headers: { 'content-type': 'image/jpeg' },
    data: imageBuffer,
  });

  await rpc.call('com.atproto.repo.createRecord', {
    data: {
      repo: handle,
      collection: 'app.bsky.actor.profile',
      record: {
        $type: 'app.bsky.actor.profile',
        avatar: blob.blob,
        createdAt: new Date().toISOString(),
        description: "I'm Alice!",
        displayName: 'alice',
      },
    },
  });
}

async function createSamplePosts(rpc: XRPC, handle: string) {
  await rpc.call('com.atproto.repo.createRecord', {
    data: {
      repo: handle,
      collection: 'app.bsky.feed.post',
      record: {
        $type: 'app.bsky.feed.post',
        createdAt: new Date().toISOString(),
        text: `Hi, I'm ${handle}!`,
        langs: ['en'],
      },
    },
  });
}
