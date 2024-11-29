import type {
  AppBskyFeedGetLikes,
  AppBskyFeedGetPosts,
  AppBskyFeedGetPostThread,
  AppBskyFeedGetQuotes,
  AppBskyFeedGetRepostedBy,
  AppBskyFeedSearchPosts,
  AppBskyNS,
} from '@atproto/api';
import { Paginator } from './paginate';

export class Post {
  /**
   * Creates a new instance of the Post class.
   * @param instance The instance of the `AppBskyNS` class.
   */
  constructor(private instance: AppBskyNS) {}

  /**
   * Get posts in a thread. Does not require auth, but additional metadata and filtering will be applied for authed requests.
   * @param params The query parameters.
   * @param options Additional options.
   * @returns The posts in the thread.
   */
  async threads(
    params: AppBskyFeedGetPostThread.QueryParams,
    options?: AppBskyFeedGetPostThread.CallOptions
  ) {
    const res = await this.instance.feed.getPostThread(params, options);

    return res.data;
  }

  /**
   * Get like records which reference a subject (by AT-URI and CID).
   * @param params The query parameters.
   * @param options Additional options.
   * @returns The likes paginator of a post.
   */
  likes(
    params: AppBskyFeedGetLikes.QueryParams,
    options?: AppBskyFeedGetLikes.CallOptions
  ) {
    return new Paginator(async (cursor) => {
      const res = await this.instance.feed.getLikes(
        { cursor, ...params },
        options
      );

      return res.data;
    });
  }

  /**
   * Get a list of quotes for a given post.
   * @param params The query parameters.
   * @param options Additional options.
   * @returns The quotes paginator of a post.
   */
  quotes(
    params: AppBskyFeedGetQuotes.QueryParams,
    options?: AppBskyFeedGetQuotes.CallOptions
  ) {
    return new Paginator(async (cursor) => {
      const res = await this.instance.feed.getQuotes(
        { cursor, ...params },
        options
      );

      return res.data;
    });
  }

  /**
   * Get a list of reposts for a given post.
   * @param params The query parameters.
   * @param options Additional options.
   * @returns The reposts paginator of a post.
   */
  repostedBy(
    params: AppBskyFeedGetRepostedBy.QueryParams,
    options?: AppBskyFeedGetRepostedBy.CallOptions
  ) {
    return new Paginator(async (cursor) => {
      const res = await this.instance.feed.getRepostedBy(
        { cursor, ...params },
        options
      );

      return res.data;
    });
  }

  /**
   * Find posts matching search criteria, returning views of those posts.
   * @param params The query parameters.
   * @param options Additional options.
   * @returns The posts paginator.
   */
  static search(
    instance: AppBskyNS,
    params: AppBskyFeedSearchPosts.QueryParams,
    options?: AppBskyFeedSearchPosts.CallOptions
  ) {
    return new Paginator(async (cursor) => {
      const res = await instance.feed.searchPosts(
        { cursor, ...params },
        options
      );

      return res.data;
    });
  }

  /**
   * Gets post views for a specified list of posts (by AT-URI). This is sometimes referred to as 'hydrating' a 'feed skeleton'.
   * @param instance The instance of the `AppBskyNS` class.
   * @param posts The list of posts to get.
   * @param options Additional options.
   * @returns The hydrated posts.
   */
  static async getMany(
    instance: AppBskyNS,
    posts: string[],
    options?: AppBskyFeedGetPosts.CallOptions
  ) {
    const res = await instance.feed.getPosts({ uris: posts }, options);

    return res.data.posts;
  }
}
