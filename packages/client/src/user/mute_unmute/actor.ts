import type { Client } from '~/tsky/client';
import type { RPCOptions } from '~/types';

export class MuteUnmuteActor {
  constructor(
    private client: Client,
    private identifier: string,
  ) {}

  /**
   * Creates a mute relationship for the specified account. Mutes are private in Bluesky.
   */
  mute(options: RPCOptions = {}) {
    return this.client.call('app.bsky.graph.muteActor', {
      data: { actor: this.identifier },
      ...options,
    });
  }

  /**
   * Unmutes the specified account.
   */
  unmute(options: RPCOptions = {}) {
    return this.client.call('app.bsky.graph.unmuteActor', {
      data: { actor: this.identifier },
      ...options,
    });
  }
}
