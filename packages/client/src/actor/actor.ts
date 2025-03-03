import type {
  AppBskyActorDefs,
  AppBskyFeedGetAuthorFeed,
  AppBskyGraphDefs,
  At,
  ComAtprotoLabelDefs,
  ComAtprotoRepoStrongRef,
} from '@tsky/lexicons';
import type { Client } from '~/agent/client';
import { FeedGeneratorView } from '~/feed/generator';
import { ListView } from '~/list';
import type { RPCOptions } from '~/types';
import { Paginator } from '~/utils';

export class Actor {
  client: Client;
  did: At.DID;

  constructor(client: Client, did: At.DID) {
    this.client = client;
    this.did = did;
  }

  /**
   * Get a list of starter packs created by the actor.
   */
  starterPacks(limit?: number, options: RPCOptions = {}) {
    return Paginator.init(async (cursor) => {
      const res = await this.client.get('app.bsky.graph.getActorStarterPacks', {
        params: { cursor, actor: this.did, limit },
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
          actor: this.did,
          limit,
        },
        ...options,
      });

      return {
        ...res.data,
        subject: new ActorProfile(this.client, res.data.subject),
        followers: res.data.followers.map(
          (follower) => new ActorProfile(this.client, follower),
        ),
      };
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
          actor: this.did,
          limit,
        },
        ...options,
      });

      return {
        ...res.data,
        subject: new ActorProfile(this.client, res.data.subject),
        follows: res.data.follows.map(
          (follow) => new ActorProfile(this.client, follow),
        ),
      };
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
          actor: this.did,
          limit,
        },
        ...options,
      });

      return {
        ...res.data,
        lists: res.data.lists.map((list) => new ListView(this.client, list)),
      };
    });
  }

  /**
   * Enumerates public relationships between one account, and a list of other accounts. Does not require auth.
   */
  async relationships(others?: string[], options?: RPCOptions) {
    const res = await this.client.get('app.bsky.graph.getRelationships', {
      params: {
        actor: this.did,
        others,
      },
      ...options,
    });

    return {
      ...res.data,
      actor: res.data.actor
        ? new Actor(this.client, res.data.actor)
        : undefined,
    };
  }

  /**
   * Get a view of an actor's 'author feed' (post and reposts by the author). Does not require auth.
   */
  feeds(limit?: number, options?: RPCOptions) {
    return Paginator.init(async (cursor) => {
      const res = await this.client
        .get('app.bsky.feed.getActorFeeds', {
          params: { cursor, actor: this.did, limit },
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

  /**
   * Get a list of feeds (feed generator records) created by the actor (in the actor's repo).
   */
  feed(
    params?: Omit<AppBskyFeedGetAuthorFeed.Params, 'actor'>,
    options?: RPCOptions,
  ) {
    return Paginator.init(async (cursor) => {
      const res = await this.client.get('app.bsky.feed.getAuthorFeed', {
        params: { cursor, ...params, actor: this.did },
        ...options,
      });

      return res.data;
    });
  }
}

// TODO: we can give this a better name
export class ActorWithProfileFunction extends Actor {
  async profile() {
    const data = await this.client
      .get('app.bsky.actor.getProfile', {
        params: { actor: this.did },
      })
      .then((res) => res.data);

    if (
      data.viewer?.knownFollowers?.followers &&
      data.viewer?.knownFollowers?.followers.length > 0
    ) {
      data.viewer.knownFollowers.followers =
        data.viewer.knownFollowers.followers.map(
          (follower) => new BasicActorProfile(this.client, follower),
        );
    }

    return data;
  }
}

export class BasicActorProfile
  extends Actor
  implements AppBskyActorDefs.ProfileViewBasic
{
  handle!: string;
  associated?: AppBskyActorDefs.ProfileAssociated;
  avatar?: string;
  createdAt?: string;
  displayName?: string;
  labels?: ComAtprotoLabelDefs.Label[];
  viewer?: AppBskyActorDefs.ViewerState;
  $type?: string;

  constructor(client: Client, actor: AppBskyActorDefs.ProfileViewBasic) {
    super(client, actor.did);
    Object.assign(this, actor);
  }
}

export class ActorProfile
  extends BasicActorProfile
  implements AppBskyActorDefs.ProfileView
{
  description?: string;
  indexedAt?: string;

  constructor(client: Client, actor: AppBskyActorDefs.ProfileViewDetailed) {
    super(client, actor);
    Object.assign(this, actor);
  }
}

export class DetailedActorProfile
  extends ActorProfile
  implements AppBskyActorDefs.ProfileViewDetailed
{
  banner?: string;
  followersCount?: number;
  followsCount?: number;
  joinedViaStarterPack?: AppBskyGraphDefs.StarterPackViewBasic;
  pinnedPost?: ComAtprotoRepoStrongRef.Main;
  postsCount?: number;

  constructor(client: Client, actor: AppBskyActorDefs.ProfileViewDetailed) {
    super(client, actor);
    Object.assign(this, actor);
  }
}
