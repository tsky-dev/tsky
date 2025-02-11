import { describe, expect, it } from 'vitest';

import type { AtpSessionData } from '@atcute/client';

import { createAgent } from '~/tsky';

describe('createAgent', () => {
  it('can create agent for Alice', async () => {
    const agent = await createAgent(
      {
        identifier: 'alice.test',
        password: 'password',
      },
      { service: TEST_NETWORK.pds.url },
    );
    expect(agent.session).not.toBe(undefined);
    expect(agent.session?.handle).toBe('alice.test');
    expect(agent.session?.email).toBe('alice.test@example.com');
  });

  it('can resume from stored session', async () => {
    let session: AtpSessionData;
    {
      const agent = await createAgent(
        {
          identifier: 'alice.test',
          password: 'password',
        },
        { service: TEST_NETWORK.pds.url },
      );
      expect(agent.session).toBeDefined();
      session = agent.session as AtpSessionData;
    }

    {
      const agent = await createAgent(
        { session },
        { service: TEST_NETWORK.pds.url },
      );
      expect(agent.session).not.toBe(undefined);
      expect(agent.session?.handle).toBe('alice.test');
      expect(agent.session?.email).toBe('alice.test@example.com');
    }
  });
});
