import type {
  AppBskyFeedSearchPosts,
  AppBskyGraphSearchStarterPacks,
} from '@tsky/lexicons';
import type { Client } from '~/agent/client';
import { Post } from '~/post';
import { BasicStarterPack } from '~/starterpack';
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

      return {
        ...res.data,
        posts: res.data.posts.map((post) => new Post(this.client, post)),
      };
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

      return {
        ...res.data,
        starterPacks: res.data.starterPacks.map(
          (starterPack) => new BasicStarterPack(this.client, starterPack),
        ),
      };
    });
  }
}
