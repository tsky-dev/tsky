import type {
  AppBskyGraphMuteThread,
  AppBskyGraphUnmuteThread,
  AppBskyNS,
} from '@atproto/api';

export class Thread {
  constructor(
    private instance: AppBskyNS,
    private thread: string,
  ) {}

  /**
   * Mutes a thread preventing notifications from the thread and any of its children. Mutes are private in Bluesky. Requires auth.
   */
  mute(options?: AppBskyGraphMuteThread.CallOptions) {
    return this.instance.graph.muteThread({ root: this.thread }, options);
  }

  /**
   * Unmutes the specified thread. Requires auth.
   */
  unmute(options?: AppBskyGraphUnmuteThread.CallOptions) {
    return this.instance.graph.unmuteThread({ root: this.thread }, options);
  }
}
