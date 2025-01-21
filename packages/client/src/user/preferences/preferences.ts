import type { AppBskyActorPutPreferences } from '@tsky/lexicons';
import type { Client } from '~/tsky/client';
import type { RPCOptions } from '~/types';

export class Preferences {
  constructor(private client: Client) {}

  /**
   * Get private preferences attached to the current account. Expected use is synchronization between multiple devices, and import/export during account migration. Requires auth.
   */
  async get(options: RPCOptions = {}) {
    const res = await this.client.get('app.bsky.actor.getPreferences', options);

    return res.data.preferences;
  }

  /**
   * Set the private preferences attached to the account.
   */
  async set(
    preferences: AppBskyActorPutPreferences.Input['preferences'],
    options: RPCOptions = {},
  ) {
    await this.client.call('app.bsky.actor.putPreferences', {
      data: { preferences },
      ...options,
    });
  }
}
