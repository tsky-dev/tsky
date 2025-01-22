import type { Client } from '~/tsky/client';
import type { RPCOptions } from '~/types';

export class Unmute {
  constructor(private client: Client) {}

  /**
   * Unmutes the specified account.
   */
  actor(identifier: string, options: RPCOptions = {}) {
    return this.client.call('app.bsky.graph.unmuteActor', {
      data: { actor: identifier },
      ...options,
    });
  }

  /**
   * Unmutes the specified thread.
   */
  thread(identifier: string, options: RPCOptions = {}) {
    return this.client.call('app.bsky.graph.unmuteThread', {
      data: { root: identifier },
      ...options,
    });
  }

  /**
   * Unmute an entire list (specified by AT-URI) of actors. This removes the mute relationship for all actors
   * on the specified list.
   */
  actorList(identifier: string, options: RPCOptions = {}) {
    return this.client.call('app.bsky.graph.unmuteActorList', {
      data: { list: identifier },
      ...options,
    });
  }
}
