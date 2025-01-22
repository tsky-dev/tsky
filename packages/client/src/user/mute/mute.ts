import type { Client } from '~/tsky/client';
import type { RPCOptions } from '~/types';

export class Mute {
  constructor(private client: Client) {}

  /**
   * Creates a mute relationship for the specified account. Mutes are private in Bluesky.
   */
  actor(identifier: string, options: RPCOptions = {}) {
    return this.client.call('app.bsky.graph.muteActor', {
      data: { actor: identifier },
      ...options,
    });
  }

  /**
   * Mutes a thread preventing notifications from the thread and any of its children. Mutes are private in Bluesky.
   */
  thread(identifier: string, options: RPCOptions = {}) {
    return this.client.call('app.bsky.graph.muteThread', {
      data: { root: identifier },
      ...options,
    });
  }

  /**
   * Mute an entire list (specified by AT-URI) of actors. This creates a mute relationship for all actors
   * on the specified list. Mutes are private on Bluesky.
   */
  actorList(identifier: string, options: RPCOptions = {}) {
    return this.client.call('app.bsky.graph.muteActorList', {
      data: { list: identifier },
      ...options,
    });
  }
}
