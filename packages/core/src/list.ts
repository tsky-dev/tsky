import type {
  AppBskyFeedGetListFeed,
  AppBskyGraphGetList,
  AppBskyNS,
} from '@atproto/api';
import { Paginator } from './paginate';

export class BskyList {
  /**
   * Creates a new instance of the List class.
   * @param instance The instance of the `AppBskyNS` class.
   * @param uri The atproto identifier of the list.
   */
  constructor(private instance: AppBskyNS, private uri: string) {}

  /**
   * Gets a 'view' (with additional context) of a specified list.
   * @param limit The maximum number of items to return per page.
   * @param options Additional options.
   * @returns The list view paginator.
   */
  about(limit?: number, options?: AppBskyGraphGetList.CallOptions) {
    return new Paginator(async (cursor) => {
      const res = await this.instance.graph.getList(
        {
          cursor,
          list: this.uri,
          limit,
        },
        options
      );

      return res.data;
    });
  }

  /**
   * Get a feed of recent posts from a list (posts and reposts from any actors on the list). Does not require auth.
   * @param limit The maximum number of items to return per page.
   * @param options Additional options.
   * @returns The list feed paginator.
   */
  feed(limit?: number, options?: AppBskyFeedGetListFeed.CallOptions) {
    return new Paginator(async (cursor) => {
      const res = await this.instance.feed.getListFeed(
        {
          cursor,
          list: this.uri,
          limit,
        },
        options
      );

      return res.data;
    });
  }
}
