import type { Client } from '~/tsky/client';
import type { RPCOptions } from '~/types';

export class MuteUnmuteActorList {
  constructor(
    private client: Client,
    private identifier: string,
  ) {}

  /**
   * Mute an entire list (specified by AT-URI) of actors. This creates a mute relationship for all actors
   * on the specified list. Mutes are private on Bluesky.
   */
  mute(options: RPCOptions = {}) {
    return this.client.call('app.bsky.graph.muteActorList', {
      data: { list: this.identifier },
      ...options,
    });
  }

  /**
   * Unmute an entire list (specified by AT-URI) of actors. This removes the mute relationship for all actors
   * on the specified list.
   */
  unmute(options: RPCOptions = {}) {
    return this.client.call('app.bsky.graph.unmuteActorList', {
      data: { list: this.identifier },
      ...options,
    });
  }
}
