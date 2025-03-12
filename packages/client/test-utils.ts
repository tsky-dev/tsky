import { inject } from 'vitest';

import type { Agent } from '~/agent';
import { createAgent } from '~/tsky';

type Handle = 'alice.test' | 'bob.test';

const testAgents: Record<Handle, Agent> = {
  'alice.test': await createTestAgent('alice.test'),
  'bob.test': await createTestAgent('bob.test'),
};

function createTestAgent(handle: Handle) {
  return createAgent({
    credentials: {
      identifier: handle,
      password: 'password',
    },
    options: { service: inject('testPdsUrl') },
  });
}

/**
 * Get Agent instance for testing accounts.
 * There are `@alice.test` and `@bob.test` now.
 * @param handle - handle name for test agent (without `@`)
 */
export async function getTestAgent(handle: Handle) {
  return testAgents[handle];
}
