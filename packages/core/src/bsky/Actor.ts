import type {
  AppBskyGraphMuteActor,
  AppBskyGraphMuteActorList,
  AppBskyGraphUnmuteActor,
  AppBskyGraphUnmuteActorList,
  AppBskyNS,
} from '@atproto/api';
import { BaseActor } from './BaseActor';

export class Actor extends BaseActor {
  /**
   * Creates a mute relationship for the specified account. Mutes are private in Bluesky. Requires auth.
   */
  mute(options?: AppBskyGraphMuteActor.CallOptions) {
    return this.instance.graph.muteActor({ actor: this.actor }, options);
  }

  /**
   * Unmutes the specified account. Requires auth.
   */
  unmute(options?: AppBskyGraphUnmuteActor.CallOptions) {
    return this.instance.graph.unmuteActor({ actor: this.actor }, options);
  }

  /**
   * Mute an entire list (specified by AT-URI) of actors. This creates a mute relationship for all actors
   * on the specified list. Mutes are private on Bluesky. Requires auth.
   *
   * @param instance The AppBskyNS instance
   * @param listUri The AT-URI of the list to mute (e.g. at://did:plc:123/app.bsky.graph.list/456)
   * @param options Optional API call options
   */
  static muteList(
    instance: AppBskyNS,
    listUri: string, // AT-URI of the list, not an array of actors
    options?: AppBskyGraphMuteActorList.CallOptions
  ) {
    return instance.graph.muteActorList({ list: listUri }, options);
  }

  /**
   * Unmute an entire list (specified by AT-URI) of actors. This removes the mute relationship for all actors
   * on the specified list. Requires auth.
   *
   * @param instance The AppBskyNS instance
   * @param listUri The AT-URI of the list to unmute (e.g. at://did:plc:123/app.bsky.graph.list/456)
   * @param options Optional API call options
   */
  static unmuteList(
    instance: AppBskyNS,
    listUri: string, // AT-URI of the list, not an array of actors
    options?: AppBskyGraphUnmuteActorList.CallOptions
  ) {
    return instance.graph.unmuteActorList({ list: listUri }, options);
  }
}
