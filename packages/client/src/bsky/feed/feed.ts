import type {
  AppBskyFeedGetFeed,
  AppBskyFeedSendInteractions,
} from '@tsky/lexicons';
import type { Client } from '~/tsky/client';
import type { RPCOptions } from '~/types';
import { Paginator } from '~/utils';
import { FeedGenerator } from './generator';

export class Feed {
  constructor(private client: Client) {}

  /**
   * Get a hydrated feed from an actor's selected feed generator. Implemented by App View.
   */
  async get(
    params: AppBskyFeedGetFeed.Params,
    options?: AppBskyFeedGetFeed.Input,
  ): Promise<Paginator<AppBskyFeedGetFeed.Output>> {
    return Paginator.init(async (cursor) => {
      const res = await this.client.get('app.bsky.feed.getFeed', {
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
   * Send information about interactions with feed items back to the feed generator that served them.
   */
  async sendInteractions(
    interactions: AppBskyFeedSendInteractions.Input['interactions'],
    options: RPCOptions = {},
  ) {
    const res = await this.client.call('app.bsky.feed.sendInteractions', {
      data: { interactions },
      ...options,
    });

    return res.data;
  }

  generator() {
    return new FeedGenerator(this.client);
  }
}
