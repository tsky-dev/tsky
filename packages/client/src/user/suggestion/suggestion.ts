import { DetailedActorProfile } from '~/actor';
import type { Client } from '~/agent/client';
import { FeedGeneratorView } from '~/feed/generator';
import type { RPCOptions } from '~/types';
import { Paginator } from '~/utils';

export class Suggestion {
  constructor(private client: Client) {}

  /**
   * Get a list of suggested actors. Expected use is discovery of accounts to follow during new account onboarding.
   */
  follow(limit?: number, options?: RPCOptions) {
    return Paginator.init(async (cursor) => {
      const res = await this.client
        .get('app.bsky.actor.getSuggestions', {
          params: {
            cursor,
            limit,
          },
          ...options,
        })
        .then((res) => res.data);

      return {
        ...res,
        actors: res.actors.map(
          (actor) => new DetailedActorProfile(this.client, actor),
        ),
      };
    });
  }

  /**
   * Enumerates follows similar to a given account (actor). Expected use is to recommend additional accounts immediately after following one account.
   */
  async afterFollowing(actor: string, options?: RPCOptions) {
    const res = await this.client
      .get('app.bsky.graph.getSuggestedFollowsByActor', {
        params: {
          actor,
        },
        ...options,
      })
      .then((res) => res.data);

    return {
      ...res,
      suggestions: res.suggestions.map(
        (suggestion) => new DetailedActorProfile(this.client, suggestion),
      ),
    };
  }

  /**
   * Get a list of suggested feeds (feed generators) for the requesting account.
   */
  feeds(limit?: number, options?: RPCOptions) {
    return Paginator.init(async (cursor) => {
      const res = await this.client
        .get('app.bsky.feed.getSuggestedFeeds', {
          params: { cursor, limit },
          ...options,
        })
        .then((res) => res.data);

      return {
        ...res,
        feeds: res.feeds.map(
          (feed) => new FeedGeneratorView(this.client, feed),
        ),
      };
    });
  }
}
