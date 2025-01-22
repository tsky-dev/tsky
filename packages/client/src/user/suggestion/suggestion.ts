import type { Client } from '~/tsky/client';
import type { RPCOptions } from '~/types';
import { Paginator } from '~/utils';

export class Suggestion {
  constructor(private client: Client) {}

  /**
   * Get a list of suggested actors. Expected use is discovery of accounts to follow during new account onboarding.
   */
  follow(limit?: number, options?: RPCOptions) {
    return Paginator.init(async (cursor) => {
      const res = await this.client.get('app.bsky.actor.getSuggestions', {
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
   * Enumerates follows similar to a given account (actor). Expected use is to recommend additional accounts immediately after following one account.
   */
  afterFollowing(actor: string, options?: RPCOptions) {
    return this.client.get('app.bsky.graph.getSuggestedFollowsByActor', {
      params: {
        actor,
      },
      ...options,
    });
  }

  /**
   * Get a list of suggested feeds (feed generators) for the requesting account.
   */
  feeds(limit?: number, options?: RPCOptions) {
    return Paginator.init(async (cursor) => {
      const res = await this.client.get('app.bsky.feed.getSuggestedFeeds', {
        params: { cursor, limit },
        ...options,
      });

      return res.data;
    });
  }
}
