import { DetailedActorProfile } from '~/actor';
import type { Client } from '~/agent/client';
import { ListView } from '~/list';
import type { RPCOptions } from '~/types';
import { Paginator } from '~/utils';

export class Muted {
  constructor(private client: Client) {}

  /**
   * Enumerates mod lists that the requesting account (actor) currently has muted. Requires auth.
   */
  lists(limit?: number, options?: RPCOptions) {
    return Paginator.init(async (cursor) => {
      const res = await this.client
        .get('app.bsky.graph.getListMutes', {
          params: {
            cursor,
            limit,
          },
          ...options,
        })
        .then((res) => res.data);

      return {
        ...res,
        lists: res.lists.map((list) => new ListView(this.client, list)),
      };
    });
  }

  /**
   * Enumerates accounts that the requesting account (actor) currently has muted. Requires auth.
   */
  profiles(limit?: number, options?: RPCOptions) {
    return Paginator.init(async (cursor) => {
      const res = await this.client
        .get('app.bsky.graph.getMutes', {
          params: {
            cursor,
            limit,
          },
          ...options,
        })
        .then((res) => res.data);

      return {
        ...res,
        mutes: res.mutes.map(
          (mute) => new DetailedActorProfile(this.client, mute),
        ),
      };
    });
  }
}
