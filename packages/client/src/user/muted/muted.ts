import type { Client } from '~/agent/client';
import type { RPCOptions } from '~/types';
import { Paginator } from '~/utils';

export class Muted {
  constructor(private client: Client) {}

  /**
   * Enumerates mod lists that the requesting account (actor) currently has muted. Requires auth.
   */
  lists(limit?: number, options?: RPCOptions) {
    return Paginator.init(async (cursor) => {
      const res = await this.client.get('app.bsky.graph.getListMutes', {
        params: {
          cursor,
          limit,
        },
        ...options,
      });

      return res.data;
    });
  }

  /**
   * Enumerates accounts that the requesting account (actor) currently has muted. Requires auth.
   */
  profiles(limit?: number, options?: RPCOptions) {
    return Paginator.init(async (cursor) => {
      const res = await this.client.get('app.bsky.graph.getMutes', {
        params: {
          cursor,
          limit,
        },
        ...options,
      });

      return res.data;
    });
  }
}
