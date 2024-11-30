import { AppBskyFeedGetActorFeeds, AppBskyFeedGetActorLikes, AppBskyFeedGetAuthorFeed, AppBskyGraphGetRelationships, AppBskyNS } from "@atproto/api";
import { Paginator } from "~/tsky/Paginator";
import { Thread } from "./Thread";

export class BaseActor {
  constructor(
    readonly instance: AppBskyNS,
    readonly actor: string,
  ) {}

  /**
   * Get a list of starter packs created by the actor.
   */
  starterPacks(limit?: number) {
    return new Paginator(async (cursor) => {
      const res = await this.instance.graph.getActorStarterPacks({
        cursor,
        actor: this.actor,
        limit,
      });

      return res.data;
    });
  }

  /**
   * Enumerates accounts which follow a specified account (actor).
   */
  followers(limit?: number) {
    return new Paginator(async (cursor) => {
      const res = await this.instance.graph.getFollowers({
        cursor,
        actor: this.actor,
        limit,
      });

      return res.data;
    });
  }

  /**
   * Enumerates accounts which a specified account (actor) follows.
   */
  follows(limit?: number) {
    return new Paginator(async (cursor) => {
      const res = await this.instance.graph.getFollows({
        cursor,
        actor: this.actor,
        limit,
      });

      return res.data;
    });
  }

  /**
   * Enumerates the lists created by a specified account (actor).
   */
  lists(limit?: number) {
    return new Paginator(async (cursor) => {
      const res = await this.instance.graph.getLists({
        cursor,
        actor: this.actor,
        limit,
      });

      return res.data;
    });
  }

  /**
   * Enumerates public relationships between one account, and a list of other accounts. Does not require auth.
   */
  async relationships(
    others?: string[],
    options?: AppBskyGraphGetRelationships.CallOptions,
  ) {
    const res = await this.instance.graph.getRelationships(
      {
        actor: this.actor,
        others,
      },
      options,
    );

    return res.data;
  }

  /**
   * Get a view of an actor's 'author feed' (post and reposts by the author). Does not require auth.
   */
  feeds(limit?: number, options?: AppBskyFeedGetActorFeeds.CallOptions) {
    return new Paginator(async (cursor) => {
      const res = await this.instance.feed.getActorFeeds(
        { cursor, actor: this.actor, limit },
        options,
      );

      return res.data;
    });
  }

  /**
   * Get a list of posts liked by an actor. Requires auth, actor must be the requesting account.
   */
  likes(limit?: number, options?: AppBskyFeedGetActorLikes.CallOptions) {
    return new Paginator(async (cursor) => {
      const res = await this.instance.feed.getActorLikes(
        { cursor, actor: this.actor, limit },
        options,
      );

      return res.data;
    });
  }

  /**
   * Get a list of feeds (feed generator records) created by the actor (in the actor's repo).
   */
  feed(
    params: AppBskyFeedGetAuthorFeed.QueryParams,
    options?: AppBskyFeedGetAuthorFeed.CallOptions,
  ) {
    return new Paginator(async (cursor) => {
      const res = await this.instance.feed.getActorFeeds(
        { cursor, ...params, actor: this.actor },
        options,
      );

      return res.data;
    });
  }

  thread(thread: string) {
    return new Thread(this.instance, thread);
  }
}