import { describe, expect, inject, it } from 'vitest';

import type { AtpSessionData } from '@atcute/client';

import { createAgent } from '~/tsky';

describe('createAgent', () => {
  it('can create agent for Alice', async () => {
    const agent = await createAgent({
      credentials: {
        identifier: 'alice.test',
        password: 'password',
      },
      options: { service: inject('testPdsUrl') },
    });
    expect(agent.session).not.toBe(undefined);
    expect(agent.session?.handle).toBe('alice.test');
    expect(agent.session?.email).toBe('alice.test@example.com');
  });

  it('can resume from stored session', async () => {
    let session: AtpSessionData;
    {
      const agent = await createAgent({
        credentials: {
          identifier: 'alice.test',
          password: 'password',
        },
        options: { service: inject('testPdsUrl') },
      });
      expect(agent.session).toBeDefined();
      session = agent.session as AtpSessionData;
    }

    {
      const agent = await createAgent({
        credentials: { session },
        options: { service: inject('testPdsUrl') },
      });
      expect(agent.session).not.toBe(undefined);
      expect(agent.session?.handle).toBe('alice.test');
      expect(agent.session?.email).toBe('alice.test@example.com');
    }
  });
});
