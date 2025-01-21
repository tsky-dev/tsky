import type { AppBskyActorDefs } from '@tsky/lexicons';
import type { Client } from '~/tsky/client';
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
}
