import type { AppBskyFeedGetTimeline } from '@tsky/lexicons';
import { Actor } from '~/bsky/autor';
import type { RPCOptions } from '~/types';
import { Paginator } from '~/utils';
import {
  MuteUnmuteActor,
  MuteUnmuteActorList,
  MuteUnmuteThread,
} from './mute_unmute';
import { Muted } from './muted';
import { Preferences } from './preferences';
import { Suggestion } from './suggestion';

export class User extends Actor {
  get preferences() {
    return new Preferences(this.client);
  }

  /**
   * Get a view of the requesting account's home timeline. This is expected to be some form of reverse-chronological feed.
   */
  timeline(
    params: AppBskyFeedGetTimeline.Params,
    options?: AppBskyFeedGetTimeline.Input,
  ): Promise<Paginator<AppBskyFeedGetTimeline.Output>> {
    return Paginator.init(async (cursor) => {
      const res = await this.client.get('app.bsky.feed.getTimeline', {
        ...(options ?? {}),
        params: {
          cursor,
          ...params,
        },
      });

      return res.data;
    });
  }

  /**
   * Get a list of posts liked by the current user
   */
  likes(limit?: number, options: RPCOptions = {}) {
    return Paginator.init(async (cursor) => {
      const res = await this.client.get('app.bsky.feed.getActorLikes', {
        params: { cursor, actor: this.identifier, limit },
        ...options,
      });

      return res.data;
    });
  }

  get muted() {
    return new Muted(this.client);
  }

  get suggestion() {
    return new Suggestion(this.client);
  }

  /** ----- */

  /**
   * Mute or unmute a thread
   */
  thread(thread: string) {
    return new MuteUnmuteThread(this.client, thread);
  }

  /**
   * Mute or unmute an actor
   */
  actor(identifier: string) {
    return new MuteUnmuteActor(this.client, identifier);
  }

  /**
   * Mute or unmute an actor list
   */
  actorList(identifier: string) {
    return new MuteUnmuteActorList(this.client, identifier);
  }
}
