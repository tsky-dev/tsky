import type {
  AppBskyFeedSearchPosts,
  AppBskyGraphSearchStarterPacks,
} from '@tsky/lexicons';
import type { Client } from '~/agent/client';
import type { RPCOptions } from '~/types';
import { Paginator } from '~/utils';

export class Search {
  constructor(private client: Client) {}

  /**
   * Find posts matching search criteria, returning views of those posts.
   */
  posts(params: AppBskyFeedSearchPosts.Params, options: RPCOptions = {}) {
    return Paginator.init(async (cursor) => {
      const res = await this.client.get('app.bsky.feed.searchPosts', {
        params: { cursor, ...params },
        ...options,
      });

      return res.data;
    });
  }

  /**
   * Search for starter packs.
   */
  starterpacks(
    params: AppBskyGraphSearchStarterPacks.Params,
    options?: RPCOptions,
  ) {
    return Paginator.init(async (cursor) => {
      const res = await this.client.get('app.bsky.graph.searchStarterPacks', {
        params: {
          cursor,
          ...params,
        },
        ...options,
      });

      return res.data;
    });
  }
}
