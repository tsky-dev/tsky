import { inject } from 'vitest';
import { createAgent } from '~/tsky';

/**
 * Get Agent instance for testing accounts.
 * There are `@alice.test` and `@bob.test` now.
 * @param handle - handle name for test agent (without `@`)
 */
export async function getTestAgent(handle: 'alice.test' | 'bob.test') {
  const agent = await createAgent(
    {
      identifier: handle,
      password: 'password',
    },
    { service: inject('testPdsUrl') },
  );

  return agent;
}
