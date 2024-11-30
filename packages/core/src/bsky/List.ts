import type {
  AppBskyFeedGetListFeed,
  AppBskyGraphGetList,
  AppBskyNS,
} from '@atproto/api';
import { Paginator } from '~/tsky/paginate';

export class BskyList {
  constructor(
    private instance: AppBskyNS,
    private uri: string,
  ) {}

  /**
   * Gets a 'view' (with additional context) of a specified list.
   */
  about(limit?: number, options?: AppBskyGraphGetList.CallOptions) {
    return new Paginator(async (cursor) => {
      const res = await this.instance.graph.getList(
        {
          cursor,
          list: this.uri,
          limit,
        },
        options,
      );

      return res.data;
    });
  }

  /**
   * Get a feed of recent posts from a list (posts and reposts from any actors on the list). Does not require auth.
   */
  feed(limit?: number, options?: AppBskyFeedGetListFeed.CallOptions) {
    return new Paginator(async (cursor) => {
      const res = await this.instance.feed.getListFeed(
        {
          cursor,
          list: this.uri,
          limit,
        },
        options,
      );

      return res.data;
    });
  }
}
