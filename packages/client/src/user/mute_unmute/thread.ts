import type { Client } from '~/tsky/client';
import type { RPCOptions } from '~/types';

export class MuteUnmuteThread {
  constructor(
    private client: Client,
    private thread: string,
  ) {}

  /**
   * Mutes a thread preventing notifications from the thread and any of its children. Mutes are private in Bluesky.
   */
  mute(options: RPCOptions = {}) {
    return this.client.call('app.bsky.graph.muteThread', {
      data: { root: this.thread },
      ...options,
    });
  }

  /**
   * Unmutes the specified thread.
   */
  unmute(options: RPCOptions = {}) {
    return this.client.call('app.bsky.graph.unmuteThread', {
      data: { root: this.thread },
      ...options,
    });
  }
}
