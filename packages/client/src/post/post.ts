import type {
  AppBskyFeedGetLikes,
  AppBskyFeedGetPostThread,
  AppBskyFeedGetQuotes,
  AppBskyFeedGetRepostedBy,
} from '@tsky/lexicons';
import type { Client } from '~/agent/client';
import type { RPCOptions } from '~/types';
import { Paginator } from '~/utils';

export class Post {
  constructor(
    private client: Client,
    private uri: string,
  ) {}

  /**
   * Get posts in a thread. Does not require auth, but additional metadata and filtering will be applied for authed requests.
   */
  async threads(
    params: Omit<AppBskyFeedGetPostThread.Params, 'uri'> = {},
    options: RPCOptions = {},
  ) {
    const res = await this.client.get('app.bsky.feed.getPostThread', {
      params: { uri: this.uri, ...params },
      ...options,
    });

    return res.data;
  }

  /**
   * Get like records which reference a subject (by AT-URI and CID).
   */
  likes(
    params: Omit<AppBskyFeedGetLikes.Params, 'uri'> = {},
    options: RPCOptions = {},
  ) {
    return Paginator.init(async (cursor) => {
      const res = await this.client.get('app.bsky.feed.getLikes', {
        params: { cursor, uri: this.uri, ...params },
        ...options,
      });

      return res.data;
    });
  }

  /**
   * Get a list of quotes for a given post.
   */
  quotes(
    params: Omit<AppBskyFeedGetQuotes.Params, 'uri'> = {},
    options: RPCOptions = {},
  ) {
    return Paginator.init(async (cursor) => {
      const res = await this.client.get('app.bsky.feed.getQuotes', {
        params: { cursor, uri: this.uri, ...params },
        ...options,
      });

      return res.data;
    });
  }

  /**
   * Get a list of reposts for a given post.
   */
  repostedBy(
    params: Omit<AppBskyFeedGetRepostedBy.Params, 'uri'> = {},
    options: RPCOptions = {},
  ) {
    return Paginator.init(async (cursor) => {
      const res = await this.client.get('app.bsky.feed.getRepostedBy', {
        params: { cursor, uri: this.uri, ...params },
        ...options,
      });

      return res.data;
    });
  }

  /**
   * Gets post views for a specified list of posts (by AT-URI). This is sometimes referred to as 'hydrating' a 'feed skeleton'.
   */
  static async getMany(
    client: Client,
    posts: string[],
    options: RPCOptions = {},
  ) {
    const res = await client.get('app.bsky.feed.getPosts', {
      params: { uris: posts },
      ...options,
    });

    return res.data.posts;
  }
}
