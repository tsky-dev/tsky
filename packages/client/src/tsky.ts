import {
  CredentialManager,
  type CredentialManagerOptions,
} from '@atcute/client';
import { Agent } from '~/agent';
import type { CreateAgentOptions } from '~/types';

export async function createAgent(config: {
  credentials?: CreateAgentOptions;
  options?: CredentialManagerOptions;
}) {
  const { credentials, options } = config;

  const manager = new CredentialManager(
    options ?? { service: 'https://bsky.social' },
  );

  if (credentials) {
    if ('session' in credentials) {
      await manager.resume(credentials.session);
    } else {
      await manager.login(credentials);
    }
  }

  return new Agent(manager);
}
