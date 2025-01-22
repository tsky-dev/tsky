import type { Client } from '~/tsky/client';
import type { RPCOptions } from '~/types';
import { Paginator } from '~/utils';

export class List {
  constructor(
    private client: Client,
    private uri: string,
  ) {}

  /**
   * Gets a 'view' (with additional context) of a specified list.
   */
  about(limit?: number, options?: RPCOptions) {
    return Paginator.init(async (cursor) => {
      const res = await this.client.get('app.bsky.graph.getList', {
        params: {
          cursor,
          list: this.uri,
          limit,
        },
        ...options,
      });

      return res.data;
    });
  }

  /**
   * Get a feed of recent posts from a list (posts and reposts from any actors on the list). Does not require auth.
   */
  feed(limit?: number, options?: RPCOptions) {
    return Paginator.init(async (cursor) => {
      const res = await this.client.get('app.bsky.feed.getListFeed', {
        params: {
          cursor,
          list: this.uri,
          limit,
        },
        ...options,
      });

      return res.data;
    });
  }
}
