import type { AppBskyGraphMuteActor, AppBskyGraphMuteActorList, AppBskyGraphUnmuteActor, AppBskyGraphUnmuteActorList, AppBskyNS } from '@atproto/api'
import { BaseActor } from './BaseActor'

export class Actor extends BaseActor {
  /**
   * Creates a mute relationship for the specified account. Mutes are private in Bluesky. Requires auth.
   */
  mute(options?: AppBskyGraphMuteActor.CallOptions) {
    return this.instance.graph.muteActor({ actor: this.actor }, options)
  }

  /**
   * Unmutes the specified account. Requires auth.
   */
  unmute(options?: AppBskyGraphUnmuteActor.CallOptions) {
    return this.instance.graph.unmuteActor({ actor: this.actor }, options)
  }

  /**
   * Creates a mute relationship for the specified list of accounts. Mutes are private in Bluesky. Requires auth.
   */
  static muteMany(
    instance: AppBskyNS,
    actors: string[],
    options?: AppBskyGraphMuteActorList.CallOptions,
  ) {
    // FIXME: Shouldn't this take an array?
    return instance.graph.muteActorList({ list: actors[0] }, options)
  }

  /**
   * Unmutes the specified list of accounts. Requires auth.
   */
  static unmuteMany(
    instance: AppBskyNS,
    actors: string[],
    options?: AppBskyGraphUnmuteActorList.CallOptions,
  ) {
    // FIXME: Shouldn't this take an array?
    return instance.graph.unmuteActorList({ list: actors[0] }, options)
  }
}
