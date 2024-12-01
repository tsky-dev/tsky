import type {
  AppBskyFeedGetSuggestedFeeds,
  AppBskyGraphGetSuggestedFollowsByActor,
  AppBskyNS,
} from '@atproto/api';
import { Paginator } from '~/tsky/paginator';

export class Suggestions {
  constructor(private instance: AppBskyNS) {}

  /**
   * Get a list of suggested actors. Expected use is discovery of accounts to follow during new account onboarding.
   */
  follow(limit?: number) {
    return new Paginator(async (cursor) => {
      const res = await this.instance.actor.getSuggestions({
        cursor,
        limit,
      });

      return res.data;
    });
  }

  /**
   * Enumerates follows similar to a given account (actor). Expected use is to recommend additional accounts immediately after following one account.
   */
  afterFollowing(
    actor: string,
    options?: AppBskyGraphGetSuggestedFollowsByActor.CallOptions,
  ) {
    return this.instance.graph.getSuggestedFollowsByActor(
      {
        actor,
      },
      options,
    );
  }

  /**
   * Get a list of suggested feeds (feed generators) for the requesting account.
   */
  feeds(limit?: number, options?: AppBskyFeedGetSuggestedFeeds.CallOptions) {
    return new Paginator(async (cursor) => {
      const res = await this.instance.feed.getSuggestedFeeds(
        { cursor, limit },
        options,
      );

      return res.data;
    });
  }
}
