import type {
  AppBskyFeedGetActorFeeds,
  AppBskyFeedGetActorLikes,
  AppBskyFeedGetAuthorFeed,
  AppBskyFeedGetSuggestedFeeds,
  AppBskyGraphGetKnownFollowers,
  AppBskyGraphGetListBlocks,
  AppBskyGraphGetListMutes,
  AppBskyGraphGetMutes,
  AppBskyGraphGetRelationships,
  AppBskyGraphGetSuggestedFollowsByActor,
  AppBskyGraphMuteActor,
  AppBskyGraphMuteActorList,
  AppBskyGraphMuteThread,
  AppBskyGraphUnmuteActor,
  AppBskyGraphUnmuteActorList,
  AppBskyGraphUnmuteThread,
  AppBskyNS,
} from '@atproto/api'
import { Paginator } from './paginate'
import { Preferences } from './preference'

export class BaseActor {
  constructor(readonly instance: AppBskyNS, readonly actor: string) {}

  /**
   * Get a list of starter packs created by the actor.
   */
  starterPacks(limit?: number) {
    return new Paginator(async (cursor) => {
      const res = await this.instance.graph.getActorStarterPacks({
        cursor,
        actor: this.actor,
        limit,
      })

      return res.data
    })
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
      })

      return res.data
    })
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
      })

      return res.data
    })
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
      })

      return res.data
    })
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
    )

    return res.data
  }

  /**
   * Get a view of an actor's 'author feed' (post and reposts by the author). Does not require auth.
   */
  feeds(limit?: number, options?: AppBskyFeedGetActorFeeds.CallOptions) {
    return new Paginator(async (cursor) => {
      const res = await this.instance.feed.getActorFeeds(
        { cursor, actor: this.actor, limit },
        options,
      )

      return res.data
    })
  }

  /**
   * Get a list of posts liked by an actor. Requires auth, actor must be the requesting account.
   */
  likes(limit?: number, options?: AppBskyFeedGetActorLikes.CallOptions) {
    return new Paginator(async (cursor) => {
      const res = await this.instance.feed.getActorLikes(
        { cursor, actor: this.actor, limit },
        options,
      )

      return res.data
    })
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
      )

      return res.data
    })
  }

  thread(thread: string) {
    return new Thread(this.instance, thread)
  }
}

class Thread {
  constructor(private instance: AppBskyNS, private thread: string) {}

  /**
   * Mutes a thread preventing notifications from the thread and any of its children. Mutes are private in Bluesky. Requires auth.
   */
  mute(options?: AppBskyGraphMuteThread.CallOptions) {
    return this.instance.graph.muteThread({ root: this.thread }, options)
  }

  /**
   * Unmutes the specified thread. Requires auth.
   */
  unmute(options?: AppBskyGraphUnmuteThread.CallOptions) {
    return this.instance.graph.unmuteThread({ root: this.thread }, options)
  }
}

export class Actor extends BaseActor {
  /**
   * Creates a mute relationship for the specified account. Mutes are private in Bluesky. Requires auth.
   */
  mute(options?: AppBskyGraphMuteActor.CallOptions) {
    return this.instance.graph.muteActor({ actor: this.actor }, options)
  }

  /**
   * Unmutes the specified account. Requires auth.
   */
  unmute(options?: AppBskyGraphUnmuteActor.CallOptions) {
    return this.instance.graph.unmuteActor({ actor: this.actor }, options)
  }

  /**
   * Creates a mute relationship for the specified list of accounts. Mutes are private in Bluesky. Requires auth.
   */
  static muteMany(
    instance: AppBskyNS,
    actors: string[],
    options?: AppBskyGraphMuteActorList.CallOptions,
  ) {
    // FIXME: Shouldn't this take an array?
    return instance.graph.muteActorList({ list: actors[0] }, options)
  }

  /**
   * Unmutes the specified list of accounts. Requires auth.
   */
  static unmuteMany(
    instance: AppBskyNS,
    actors: string[],
    options?: AppBskyGraphUnmuteActorList.CallOptions,
  ) {
    // FIXME: Shouldn't this take an array?
    return instance.graph.unmuteActorList({ list: actors[0] }, options)
  }
}

export class User extends BaseActor {
  /**
   * Enumerates accounts which follow a specified account (actor) and are followed by the viewer.
   */
  knowFollowers(
    params: { actor: string, limit?: number },
    options?: AppBskyGraphGetKnownFollowers.CallOptions,
  ) {
    return new Paginator(async (cursor) => {
      const res = await this.instance.graph.getKnownFollowers(
        {
          cursor,
          ...params,
        },
        options,
      )

      return res.data
    })
  }

  /**
   * Get mod lists that the requesting account (actor) is blocking. Requires auth.
   */
  blockedLists(
    limit?: number,
    options?: AppBskyGraphGetListBlocks.CallOptions,
  ) {
    return new Paginator(async (cursor) => {
      const res = await this.instance.graph.getListBlocks(
        {
          cursor,
          limit,
        },
        options,
      )

      return res.data
    })
  }

  /**
   * Enumerates mod lists that the requesting account (actor) currently has muted. Requires auth.
   */
  mutedLists(limit?: number, options?: AppBskyGraphGetListMutes.CallOptions) {
    return new Paginator(async (cursor) => {
      const res = await this.instance.graph.getListMutes(
        {
          cursor,
          limit,
        },
        options,
      )

      return res.data
    })
  }

  /**
   * Enumerates accounts that the requesting account (actor) currently has muted. Requires auth.
   */
  mutedProfiles(limit?: number, options?: AppBskyGraphGetMutes.CallOptions) {
    return new Paginator(async (cursor) => {
      const res = await this.instance.graph.getMutes(
        {
          cursor,
          limit,
        },
        options,
      )

      return res.data
    })
  }

  suggestions() {
    return new Suggestions(this.instance)
  }

  preferences() {
    return new Preferences(this.instance)
  }
}

class Suggestions {
  constructor(private instance: AppBskyNS) {}

  /**
   * Get a list of suggested actors. Expected use is discovery of accounts to follow during new account onboarding.
   */
  follow(limit?: number) {
    return new Paginator(async (cursor) => {
      const res = await this.instance.actor.getSuggestions({
        cursor,
        limit,
      })

      return res.data
    })
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
    )
  }

  /**
   * Get a list of suggested feeds (feed generators) for the requesting account.
   */
  feeds(limit?: number, options?: AppBskyFeedGetSuggestedFeeds.CallOptions) {
    return new Paginator(async (cursor) => {
      const res = await this.instance.feed.getSuggestedFeeds(
        { cursor, limit },
        options,
      )

      return res.data
    })
  }
}
