import type {
  AppBskyActorDefs,
  AppBskyFeedGetAuthorFeed,
} from '@tsky/lexicons';
import type { Client } from '~/agent/client';
import type { RPCOptions } from '~/types';
import { Paginator } from '~/utils';

export class Actor {
  client: Client;
  identifier: string;

  constructor(client: Client, identifier: string) {
    this.client = client;
    this.identifier = identifier;
  }

  /**
   * Get detailed profile view of an actor. Does not require auth, but contains relevant metadata with auth.
   */
  async profile(): Promise<AppBskyActorDefs.ProfileViewDetailed> {
    const res = await this.client.get('app.bsky.actor.getProfile', {
      params: { actor: this.identifier },
    });

    return res.data;
  }

  /**
   * Get a list of starter packs created by the actor.
   */
  starterPacks(limit?: number, options: RPCOptions = {}) {
    return Paginator.init(async (cursor) => {
      const res = await this.client.get('app.bsky.graph.getActorStarterPacks', {
        params: { cursor, actor: this.identifier, limit },
        ...options,
      });

      return res.data;
    });
  }

  /**
   * Enumerates accounts which follow a specified account (actor).
   */
  followers(limit?: number, options: RPCOptions = {}) {
    return Paginator.init(async (cursor) => {
      const res = await this.client.get('app.bsky.graph.getFollowers', {
        params: {
          cursor,
          actor: this.identifier,
          limit,
        },
        ...options,
      });

      return res.data;
    });
  }

  /**
   * Enumerates accounts which a specified account (actor) follows.
   */
  follows(limit?: number, options: RPCOptions = {}) {
    return Paginator.init(async (cursor) => {
      const res = await this.client.get('app.bsky.graph.getFollows', {
        params: {
          cursor,
          actor: this.identifier,
          limit,
        },
        ...options,
      });

      return res.data;
    });
  }

  /**
   * Enumerates the lists created by a specified account (actor).
   */
  lists(limit?: number, options: RPCOptions = {}) {
    return Paginator.init(async (cursor) => {
      const res = await this.client.get('app.bsky.graph.getLists', {
        params: {
          cursor,
          actor: this.identifier,
          limit,
        },
        ...options,
      });

      return res.data;
    });
  }

  /**
   * Enumerates public relationships between one account, and a list of other accounts. Does not require auth.
   */
  async relationships(others?: string[], options?: RPCOptions) {
    const res = await this.client.get('app.bsky.graph.getRelationships', {
      params: {
        actor: this.identifier,
        others,
      },
      ...options,
    });

    return res.data;
  }

  /**
   * Get a view of an actor's 'author feed' (post and reposts by the author). Does not require auth.
   */
  feeds(limit?: number, options?: RPCOptions) {
    return Paginator.init(async (cursor) => {
      const res = await this.client.get('app.bsky.feed.getActorFeeds', {
        params: { cursor, actor: this.identifier, limit },
        ...options,
      });

      return res.data;
    });
  }

  /**
   * Get a list of feeds (feed generator records) created by the actor (in the actor's repo).
   */
  feed(
    params?: Omit<AppBskyFeedGetAuthorFeed.Params, 'actor'>,
    options?: RPCOptions,
  ) {
    return Paginator.init(async (cursor) => {
      const res = await this.client.get('app.bsky.feed.getAuthorFeed', {
        params: { cursor, ...params, actor: this.identifier },
        ...options,
      });

      return res.data;
    });
  }
}
