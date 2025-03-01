import type { AppBskyFeedGetTimeline } from '@tsky/lexicons';
import { ActorWithProfileFunction } from '~/actor';
import type { RPCOptions } from '~/types';
import { Paginator } from '~/utils';
import { Mute } from './mute';
import { Muted } from './muted';
import { Preferences } from './preferences';
import { Suggestion } from './suggestion';
import { Unmute } from './unmute';

export class User extends ActorWithProfileFunction {
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
        params: { cursor, actor: this.did, limit },
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

  get mute() {
    return new Mute(this.client);
  }

  get unmute() {
    return new Unmute(this.client);
  }
}
