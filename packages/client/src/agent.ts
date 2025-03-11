import { type CredentialManager, XRPC } from '@atcute/client';
import type {
  AppBskyActorDefs,
  AppBskyActorPutPreferences,
  AppBskyEmbedExternal,
  AppBskyEmbedImages,
  AppBskyEmbedRecord,
  AppBskyEmbedRecordWithMedia,
  AppBskyEmbedVideo,
  AppBskyFeedDefs,
  AppBskyFeedGetAuthorFeed,
  AppBskyFeedGetFeed,
  AppBskyFeedGetFeedGenerator,
  AppBskyFeedGetFeedGenerators,
  AppBskyFeedGetFeedSkeleton,
  AppBskyFeedGetLikes,
  AppBskyFeedGetPostThread,
  AppBskyFeedGetQuotes,
  AppBskyFeedGetRepostedBy,
  AppBskyFeedGetTimeline,
  AppBskyFeedSearchPosts,
  AppBskyFeedSendInteractions,
  AppBskyGraphDefs,
  AppBskyGraphGetStarterPack,
  AppBskyGraphGetStarterPacks,
  AppBskyGraphSearchStarterPacks,
  AppBskyRichtextFacet,
  AppBskyVideoDefs,
  AppBskyVideoUploadVideo,
  At,
  ComAtprotoLabelDefs,
  ComAtprotoRepoStrongRef,
  Queries,
  Typed,
} from '@tsky/lexicons';
import { Client } from './client';
import type { RPCOptions } from './types';
import { Paginator, parseAtUri } from './utils';

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
      const data = await this.client
        .get('app.bsky.graph.getActorStarterPacks', {
          params: { cursor, actor: this.did, limit },
          ...options,
        })
        .then((res) => res.data);

      data.starterPacks = data.starterPacks.map(
        (starterPack) => new StarterpackBasicView(this.client, starterPack),
      );

      return data;
    });
  }

  /**
   * Enumerates accounts which follow a specified account (actor).
   */
  followers(limit?: number, options: RPCOptions = {}) {
    return Paginator.init(async (cursor) => {
      const data = await this.client
        .get('app.bsky.graph.getFollowers', {
          params: {
            cursor,
            actor: this.did,
            limit,
          },
          ...options,
        })
        .then((res) => res.data);

      data.subject = new ActorProfile(this.client, data.subject);
      data.followers = data.followers.map(
        (follower) => new ActorProfile(this.client, follower),
      );

      return data;
    });
  }

  /**
   * Enumerates accounts which a specified account (actor) follows.
   */
  follows(limit?: number, options: RPCOptions = {}) {
    return Paginator.init(async (cursor) => {
      const data = await this.client
        .get('app.bsky.graph.getFollows', {
          params: {
            cursor,
            actor: this.did,
            limit,
          },
          ...options,
        })
        .then((res) => res.data);

      data.subject = new ActorProfile(this.client, data.subject);
      data.follows = data.follows.map(
        (follow) => new ActorProfile(this.client, follow),
      );

      return data;
    });
  }

  /**
   * Enumerates the lists created by a specified account (actor).
   */
  lists(limit?: number, options: RPCOptions = {}) {
    return Paginator.init(async (cursor) => {
      const data = await this.client
        .get('app.bsky.graph.getLists', {
          params: {
            cursor,
            actor: this.did,
            limit,
          },
          ...options,
        })
        .then((res) => res.data);

      data.lists = data.lists.map((list) => new ListView(this.client, list));

      return data;
    });
  }

  /**
   * Enumerates public relationships between one account, and a list of other accounts. Does not require auth.
   */
  async relationships(others?: string[], options?: RPCOptions) {
    const data = await this.client
      .get('app.bsky.graph.getRelationships', {
        params: {
          actor: this.did,
          others,
        },
        ...options,
      })
      .then((res) => res.data);

    return {
      ...data,
      actor: data.actor
        ? new ActorLazyProfile(this.client, data.actor)
        : undefined,
    };
  }

  /**
   * Get a view of an actor's 'author feed' (post and reposts by the author). Does not require auth.
   */
  feeds(limit?: number, options?: RPCOptions) {
    return Paginator.init(async (cursor) => {
      const data = await this.client
        .get('app.bsky.feed.getActorFeeds', {
          params: { cursor, actor: this.did, limit },
          ...options,
        })
        .then((res) => res.data);

      data.feeds = data.feeds.map(
        (feed) => new FeedGeneratorView(this.client, feed),
      );

      return data;
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
      const data = await this.client
        .get('app.bsky.feed.getAuthorFeed', {
          params: { cursor, ...params, actor: this.did },
          ...options,
        })
        .then((res) => res.data);

      data.feed = data.feed.map((item) => new FeedViewPost(this.client, item));

      return data;
    });
  }

  toJSON() {
    return {
      did: this.did,
    };
  }
}

export class ActorLazyProfile extends Actor {
  async profile() {
    const data = await this.client
      .get('app.bsky.actor.getProfile', {
        params: { actor: this.did },
      })
      .then((res) => res.data);

    return new ActorProfile(this.client, data);
  }
}

export class ActorBasicProfile
  extends Actor
  implements AppBskyActorDefs.ProfileViewBasic
{
  handle: string;
  associated?: AppBskyActorDefs.ProfileAssociated | undefined;
  avatar?: string | undefined;
  createdAt?: string | undefined;
  displayName?: string | undefined;
  labels?: ComAtprotoLabelDefs.Label[] | undefined;
  viewer?: AppBskyActorDefs.ViewerState | undefined;
  $type?: string | undefined;

  constructor(client: Client, actor: AppBskyActorDefs.ProfileViewBasic) {
    super(client, actor.did);
    this.handle = actor.handle;
    this.associated = actor.associated;
    this.avatar = actor.avatar;
    this.createdAt = actor.createdAt;
    this.displayName = actor.displayName;
    this.labels = actor.labels;
    this.$type = actor.$type;

    if (actor.viewer) {
      this.viewer = actor.viewer;

      if (actor.viewer?.knownFollowers) {
        actor.viewer.knownFollowers.followers =
          actor.viewer.knownFollowers.followers.map(
            (follower) => new ActorBasicProfile(client, follower),
          );
      }

      if (actor.viewer?.blockingByList) {
        actor.viewer.blockingByList = new ListBasicView(
          client,
          actor.viewer.blockingByList,
        );
      }
    }
  }

  override toJSON() {
    return {
      ...super.toJSON(),
      handle: this.handle,
      associated: this.associated,
      avatar: this.avatar,
      createdAt: this.createdAt,
      displayName: this.displayName,
      labels: this.labels,
      viewer: this.viewer,
      $type: this.$type,
    };
  }
}

export class ActorProfile
  extends ActorBasicProfile
  implements AppBskyActorDefs.ProfileViewDetailed
{
  description?: string;
  indexedAt?: string;
  followersCount?: number;
  followsCount?: number;
  postsCount?: number;
  banner?: string | undefined;
  joinedViaStarterPack?: AppBskyGraphDefs.StarterPackViewBasic | undefined;
  pinnedPost?: ComAtprotoRepoStrongRef.Main | undefined;

  constructor(client: Client, actor: AppBskyActorDefs.ProfileViewDetailed) {
    super(client, actor);
    this.description = actor.description;
    this.indexedAt = actor.indexedAt;
    this.followersCount = actor.followersCount;
    this.followsCount = actor.followsCount;
    this.postsCount = actor.postsCount;
    this.banner = actor.banner;
    this.joinedViaStarterPack = actor.joinedViaStarterPack;
    this.pinnedPost = actor.pinnedPost;
  }

  override toJSON() {
    return {
      ...super.toJSON(),
      description: this.description,
      indexedAt: this.indexedAt,
      followersCount: this.followersCount,
      followsCount: this.followsCount,
      postsCount: this.postsCount,
      banner: this.banner,
      joinedViaStarterPack: this.joinedViaStarterPack,
      pinnedPost: this.pinnedPost,
    };
  }
}

export class List {
  client: Client;
  uri: string;

  constructor(client: Client, uri: string) {
    this.client = client;
    this.uri = uri;
  }

  /**
   * Gets a 'view' (with additional context) of a specified list.
   */
  about(limit?: number, options?: RPCOptions) {
    return Paginator.init(async (cursor) => {
      const data = await this.client
        .get('app.bsky.graph.getList', {
          params: {
            cursor,
            list: this.uri,
            limit,
          },
          ...options,
        })
        .then((res) => res.data);

      data.items = data.items.map((item) => {
        item.subject = new ActorProfile(this.client, item.subject);

        return item;
      });

      data.list = new ListView(this.client, data.list);

      return data;
    });
  }

  /**
   * Get a feed of recent posts from a list (posts and reposts from any actors on the list). Does not require auth.
   */
  feed(limit?: number, options?: RPCOptions) {
    return Paginator.init(async (cursor) => {
      const data = await this.client
        .get('app.bsky.feed.getListFeed', {
          params: {
            cursor,
            list: this.uri,
            limit,
          },
          ...options,
        })
        .then((res) => res.data);

      data.feed = data.feed.map((item) => new FeedViewPost(this.client, item));

      return data;
    });
  }
}

export class ListBasicView
  extends List
  implements AppBskyGraphDefs.ListViewBasic
{
  cid: string;
  name: string;
  purpose: AppBskyGraphDefs.ListPurpose;
  avatar?: string | undefined;
  indexedAt?: string | undefined;
  labels?: ComAtprotoLabelDefs.Label[] | undefined;
  listItemCount?: number | undefined;
  viewer?: AppBskyGraphDefs.ListViewerState | undefined;
  $type?: string | undefined;

  constructor(client: Client, list: AppBskyGraphDefs.ListViewBasic) {
    super(client, list.uri);
    this.cid = list.cid;
    this.name = list.name;
    this.purpose = list.purpose;
    this.avatar = list.avatar;
    this.indexedAt = list.indexedAt;
    this.labels = list.labels;
    this.listItemCount = list.listItemCount;
    this.viewer = list.viewer;
    this.$type = list.$type;
  }
}

export class ListView
  extends ListBasicView
  implements AppBskyGraphDefs.ListView
{
  override indexedAt: string;
  creator: AppBskyActorDefs.ProfileView;
  description?: string | undefined;
  descriptionFacets?: AppBskyRichtextFacet.Main[] | undefined;

  constructor(client: Client, list: AppBskyGraphDefs.ListView) {
    super(client, list);
    this.indexedAt = list.indexedAt;
    this.creator = new ActorProfile(client, list.creator);
    this.description = list.description;
    this.descriptionFacets = list.descriptionFacets;
  }
}

export class Starterpack {
  cid: string;
  creator: AppBskyActorDefs.ProfileViewBasic;
  indexedAt: string;
  record: unknown;
  uri: string;
  joinedAllTimeCount?: number | undefined;
  joinedWeekCount?: number | undefined;
  labels?: ComAtprotoLabelDefs.Label[] | undefined;
  $type?: string | undefined;

  constructor(
    public client: Client,
    payload: Omit<AppBskyGraphDefs.StarterPackViewBasic, 'listItemCount'>,
  ) {
    this.cid = payload.cid;
    this.creator = new ActorBasicProfile(this.client, payload.creator);
    this.indexedAt = payload.indexedAt;
    this.record = payload.record;
    this.uri = payload.uri;
    this.joinedAllTimeCount = payload.joinedAllTimeCount;
    this.joinedWeekCount = payload.joinedWeekCount;
    this.labels = payload.labels;
    this.$type = payload.$type;
  }
}

export class StarterpackBasicView
  extends Starterpack
  implements AppBskyGraphDefs.StarterPackViewBasic
{
  listItemCount?: number | undefined;

  constructor(client: Client, payload: AppBskyGraphDefs.StarterPackViewBasic) {
    super(client, payload);
    this.listItemCount = payload.listItemCount;
  }
}

export class StarterpackView
  extends Starterpack
  implements AppBskyGraphDefs.StarterPackView
{
  feeds?: AppBskyFeedDefs.GeneratorView[] | undefined;
  list?: AppBskyGraphDefs.ListViewBasic | undefined;
  listItemsSample?: AppBskyGraphDefs.ListItemView[] | undefined;

  constructor(client: Client, payload: AppBskyGraphDefs.StarterPackView) {
    super(client, payload);
    this.feeds = payload.feeds?.map(
      (feed) => new FeedGeneratorView(client, feed),
    );

    if (payload.list) {
      this.list = new ListBasicView(client, payload.list);
    }

    this.listItemsSample = payload.listItemsSample?.map((item) => {
      item.subject = new ActorProfile(client, item.subject);
      return item;
    });
  }
}

export class PostView implements AppBskyFeedDefs.PostView {
  author: AppBskyActorDefs.ProfileViewBasic;
  cid: string;
  indexedAt: string;
  record: unknown;
  uri: string;
  embed?:
    | Typed<AppBskyEmbedExternal.View, string>
    | Typed<AppBskyEmbedImages.View, string>
    | Typed<AppBskyEmbedRecord.View, string>
    | Typed<AppBskyEmbedRecordWithMedia.View, string>
    | Typed<AppBskyEmbedVideo.View, string>
    | undefined;
  labels?: ComAtprotoLabelDefs.Label[] | undefined;
  likeCount?: number | undefined;
  quoteCount?: number | undefined;
  replyCount?: number | undefined;
  repostCount?: number | undefined;
  threadgate?: AppBskyFeedDefs.ThreadgateView | undefined;
  viewer?: AppBskyFeedDefs.ViewerState | undefined;
  $type?: string | undefined;

  constructor(
    public client: Client,
    payload: AppBskyFeedDefs.PostView,
  ) {
    this.author = new ActorBasicProfile(this.client, payload.author);
    this.cid = payload.cid;
    this.indexedAt = payload.indexedAt;
    this.record = payload.record;
    this.uri = payload.uri;
    this.embed = payload.embed;
    this.labels = payload.labels;
    this.likeCount = payload.likeCount;
    this.quoteCount = payload.quoteCount;
    this.replyCount = payload.replyCount;
    this.repostCount = payload.repostCount;
    this.threadgate = payload.threadgate;
    this.viewer = payload.viewer;
    this.$type = payload.$type;
  }

  isOfCurrentUser() {
    const { host: repo } = parseAtUri(this.uri);
    return repo !== this.client.crenditials.session?.did;
  }

  remove(options: RPCOptions = {}) {
    return this.client.deleteRecord(this.uri, options);
  }

  // TODO: method for liking, unliking, reposting, un-reposting, quoting, etc.

  /**
   * Get posts in a thread. Does not require auth, but additional metadata and filtering will be applied for authed requests.
   */
  async threads(
    params: Omit<AppBskyFeedGetPostThread.Params, 'uri'> = {},
    options: RPCOptions = {},
  ) {
    return this.client
      .get('app.bsky.feed.getPostThread', {
        params: { uri: this.uri, ...params },
        ...options,
      })
      .then((res) => res.data);
  }

  /**
   * Get like records which reference a subject (by AT-URI and CID).
   */
  likes(
    params: Omit<AppBskyFeedGetLikes.Params, 'uri'> = {},
    options: RPCOptions = {},
  ) {
    return Paginator.init(async (cursor) => {
      const data = await this.client
        .get('app.bsky.feed.getLikes', {
          params: { cursor, uri: this.uri, ...params },
          ...options,
        })
        .then((res) => res.data);

      data.likes = data.likes.map((like) => {
        like.actor = new ActorBasicProfile(this.client, like.actor);
        return like;
      });

      return data;
    });
  }

  /**
   * Get a list of quotes for a given post.
   */
  quotes(
    params: Omit<AppBskyFeedGetQuotes.Params, 'uri'> = {},
    options: RPCOptions = {},
  ) {
    return Paginator.init(async (cursor) => {
      const data = await this.client
        .get('app.bsky.feed.getQuotes', {
          params: { cursor, uri: this.uri, ...params },
          ...options,
        })
        .then((res) => res.data);

      data.posts = data.posts.map((post) => new PostView(this.client, post));

      return data;
    });
  }

  /**
   * Get a list of reposts for a given post.
   */
  repostedBy(
    params: Omit<AppBskyFeedGetRepostedBy.Params, 'uri'> = {},
    options: RPCOptions = {},
  ) {
    return Paginator.init(async (cursor) => {
      const data = await this.client
        .get('app.bsky.feed.getRepostedBy', {
          params: { cursor, uri: this.uri, ...params },
          ...options,
        })
        .then((res) => res.data);

      data.repostedBy = data.repostedBy.map(
        (repost) => new ActorProfile(this.client, repost),
      );

      return data;
    });
  }

  /**
   * Gets post views for a specified list of posts (by AT-URI). This is sometimes referred to as 'hydrating' a 'feed skeleton'.
   */
  static async getMany(
    client: Client,
    posts: string[],
    options: RPCOptions = {},
  ) {
    const data = await client
      .get('app.bsky.feed.getPosts', {
        params: { uris: posts },
        ...options,
      })
      .then((res) => res.data);

    data.posts = data.posts.map((post) => new PostView(client, post));

    return data;
  }
}

export class Search {
  constructor(private client: Client) {}

  /**
   * Find posts matching search criteria, returning views of those posts.
   */
  posts(params: AppBskyFeedSearchPosts.Params, options: RPCOptions = {}) {
    return Paginator.init(async (cursor) => {
      const data = await this.client
        .get('app.bsky.feed.searchPosts', {
          params: { cursor, ...params },
          ...options,
        })
        .then((res) => res.data);

      data.posts = data.posts.map((post) => new PostView(this.client, post));

      return data;
    });
  }

  /**
   * Search for starter packs.
   */
  starterpacks(
    params: AppBskyGraphSearchStarterPacks.Params,
    options?: RPCOptions,
  ) {
    return Paginator.init(async (cursor) => {
      const data = await this.client
        .get('app.bsky.graph.searchStarterPacks', {
          params: {
            cursor,
            ...params,
          },
          ...options,
        })
        .then((res) => res.data);

      data.starterPacks = data.starterPacks.map(
        (starterPack) => new StarterpackBasicView(this.client, starterPack),
      );

      return data;
    });
  }
}

export class FeedViewPost implements AppBskyFeedDefs.FeedViewPost {
  post: AppBskyFeedDefs.PostView;
  feedContext?: string | undefined;
  reason?:
    | Typed<AppBskyFeedDefs.ReasonPin, string>
    | Typed<AppBskyFeedDefs.ReasonRepost, string>
    | undefined;
  reply?: AppBskyFeedDefs.ReplyRef | undefined;
  $type?: string | undefined;

  constructor(
    public client: Client,
    payload: AppBskyFeedDefs.FeedViewPost,
  ) {
    this.$type = payload.$type;
    this.feedContext = payload.feedContext;
    this.reason = payload.reason;
    this.post = new PostView(this.client, payload.post);

    if (payload.reply) {
      this.reply = {
        ...payload.reply,
        grandparentAuthor: payload.reply.grandparentAuthor
          ? new ActorBasicProfile(this.client, payload.reply.grandparentAuthor)
          : undefined,
      };
    }
  }
}

export class FeedGenerator {
  constructor(public client: Client) {}

  /**
   * Get information about a feed generator, including policies and offered feed URIs. Does not require auth; implemented by Feed Generator services (not App View).
   */
  async describe(options: RPCOptions = {}) {
    return this.client
      .get('app.bsky.feed.describeFeedGenerator', options)
      .then((res) => res.data);
  }

  /**
   * Get information about a feed generator. Implemented by AppView.
   */
  feed(
    feed: string,
    options: RPCOptions,
  ): Promise<AppBskyFeedGetFeedGenerator.Output>;
  /**
   * Get information about a list of feed generators.
   */
  feed(
    feeds: string[],
    options: RPCOptions,
  ): Promise<AppBskyFeedGetFeedGenerators.Output['feeds']>;

  async feed(feed: string | string[], options: RPCOptions) {
    if (Array.isArray(feed)) {
      const data = await this.client
        .get('app.bsky.feed.getFeedGenerators', {
          params: {
            feeds: feed,
          },
          ...options,
        })
        .then((res) => res.data);

      return data.feeds;
    }

    return this.client
      .get('app.bsky.feed.getFeedGenerator', {
        params: { feed },
        ...options,
      })
      .then((res) => res.data);
  }

  /**
   * Get a skeleton of a feed provided by a feed generator. Auth is optional, depending on provider requirements, and provides the DID of the requester. Implemented by Feed Generator Service.
   */
  skeleton(
    params: AppBskyFeedGetFeedSkeleton.Params,
    options: RPCOptions = {},
  ) {
    return Paginator.init(async (cursor) => {
      return this.client
        .get('app.bsky.feed.getFeedSkeleton', {
          params: { cursor, ...params },
          ...options,
        })
        .then((res) => res.data);
    });
  }
}

export class FeedGeneratorView implements AppBskyFeedDefs.GeneratorView {
  cid: string;
  creator: AppBskyActorDefs.ProfileView;
  did: At.DID;
  displayName: string;
  indexedAt: string;
  uri: string;
  acceptsInteractions?: boolean | undefined;
  avatar?: string | undefined;
  contentMode?:
    | (string & {})
    | 'app.bsky.feed.defs#contentModeUnspecified'
    | 'app.bsky.feed.defs#contentModeVideo'
    | undefined;
  description?: string | undefined;
  descriptionFacets?: AppBskyRichtextFacet.Main[] | undefined;
  labels?: ComAtprotoLabelDefs.Label[] | undefined;
  likeCount?: number | undefined;
  viewer?: AppBskyFeedDefs.GeneratorViewerState | undefined;
  $type?: string | undefined;

  constructor(
    public client: Client,
    payload: AppBskyFeedDefs.GeneratorView,
  ) {
    this.cid = payload.cid;
    this.creator = new ActorProfile(this.client, payload.creator);
    this.did = payload.did;
    this.displayName = payload.displayName;
    this.indexedAt = payload.indexedAt;
    this.uri = payload.uri;
    this.acceptsInteractions = payload.acceptsInteractions;
    this.avatar = payload.avatar;
    this.contentMode = payload.contentMode;
    this.description = payload.description;
    this.descriptionFacets = payload.descriptionFacets;
    this.labels = payload.labels;
    this.likeCount = payload.likeCount;
    this.viewer = payload.viewer;
    this.$type = payload.$type;
  }
}

export class Preferences {
  constructor(public client: Client) {}

  /**
   * Get private preferences attached to the current account. Expected use is synchronization between multiple devices, and import/export during account migration. Requires auth.
   */
  async get(options: RPCOptions = {}) {
    const res = await this.client.get('app.bsky.actor.getPreferences', options);

    return res.data.preferences;
  }

  /**
   * Set the private preferences attached to the account.
   */
  async set(
    preferences: AppBskyActorPutPreferences.Input['preferences'],
    options: RPCOptions = {},
  ) {
    await this.client.call('app.bsky.actor.putPreferences', {
      data: { preferences },
      ...options,
    });
  }
}

export class Muted {
  constructor(public client: Client) {}

  /**
   * Enumerates mod lists that the requesting account (actor) currently has muted. Requires auth.
   */
  lists(limit?: number, options?: RPCOptions) {
    return Paginator.init(async (cursor) => {
      const data = await this.client
        .get('app.bsky.graph.getListMutes', {
          params: {
            cursor,
            limit,
          },
          ...options,
        })
        .then((res) => res.data);

      data.lists = data.lists.map((list) => new ListView(this.client, list));

      return data;
    });
  }

  /**
   * Enumerates accounts that the requesting account (actor) currently has muted. Requires auth.
   */
  profiles(limit?: number, options?: RPCOptions) {
    return Paginator.init(async (cursor) => {
      const data = await this.client
        .get('app.bsky.graph.getMutes', {
          params: {
            cursor,
            limit,
          },
          ...options,
        })
        .then((res) => res.data);

      data.mutes = data.mutes.map(
        (mute) => new ActorProfile(this.client, mute),
      );

      return data;
    });
  }
}

export class Suggestion {
  constructor(private client: Client) {}

  /**
   * Get a list of suggested actors. Expected use is discovery of accounts to follow during new account onboarding.
   */
  follow(limit?: number, options?: RPCOptions) {
    return Paginator.init(async (cursor) => {
      const data = await this.client
        .get('app.bsky.actor.getSuggestions', {
          params: {
            cursor,
            limit,
          },
          ...options,
        })
        .then((res) => res.data);

      data.actors = data.actors.map(
        (actor) => new ActorProfile(this.client, actor),
      );

      return data;
    });
  }

  /**
   * Enumerates follows similar to a given account (actor). Expected use is to recommend additional accounts immediately after following one account.
   */
  async afterFollowing(actor: string, options?: RPCOptions) {
    const data = await this.client
      .get('app.bsky.graph.getSuggestedFollowsByActor', {
        params: {
          actor,
        },
        ...options,
      })
      .then((res) => res.data);

    data.suggestions = data.suggestions.map(
      (suggestion) => new ActorProfile(this.client, suggestion),
    );

    return data;
  }

  /**
   * Get a list of suggested feeds (feed generators) for the requesting account.
   */
  feeds(limit?: number, options?: RPCOptions) {
    return Paginator.init(async (cursor) => {
      const data = await this.client
        .get('app.bsky.feed.getSuggestedFeeds', {
          params: { cursor, limit },
          ...options,
        })
        .then((res) => res.data);

      data.feeds = data.feeds.map(
        (feed) => new FeedGeneratorView(this.client, feed),
      );

      return data;
    });
  }
}

export class User extends ActorLazyProfile {
  get preferences() {
    return new Preferences(this.client);
  }

  /**
   * Get a view of the requesting account's home timeline. This is expected to be some form of reverse-chronological feed.
   */
  timeline(
    params: AppBskyFeedGetTimeline.Params,
    options?: AppBskyFeedGetTimeline.Input,
  ): Promise<Paginator<AppBskyFeedGetTimeline.Output>> {
    return Paginator.init(async (cursor) => {
      const data = await this.client
        .get('app.bsky.feed.getTimeline', {
          ...(options ?? {}),
          params: {
            cursor,
            ...params,
          },
        })
        .then((res) => res.data);

      data.feed = data.feed.map((item) => new FeedViewPost(this.client, item));

      return data;
    });
  }

  /**
   * Get a list of posts liked by the current user
   */
  likes(limit?: number, options: RPCOptions = {}) {
    return Paginator.init(async (cursor) => {
      const data = await this.client
        .get('app.bsky.feed.getActorLikes', {
          params: { cursor, actor: this.did, limit },
          ...options,
        })
        .then((res) => res.data);

      data.feed = data.feed.map((item) => new FeedViewPost(this.client, item));

      return data;
    });
  }

  get muted() {
    return new Muted(this.client);
  }

  get suggestion() {
    return new Suggestion(this.client);
  }

  /**
   * Creates a mute relationship for the specified account. Mutes are private in Bluesky.
   */
  muteActor(identifier: string, options: RPCOptions = {}) {
    return this.client.call('app.bsky.graph.muteActor', {
      data: { actor: identifier },
      ...options,
    });
  }

  /**
   * Unmutes the specified account.
   */
  unmuteActor(identifier: string, options: RPCOptions = {}) {
    return this.client.call('app.bsky.graph.unmuteActor', {
      data: { actor: identifier },
      ...options,
    });
  }

  /**
   * Mutes a thread preventing notifications from the thread and any of its children. Mutes are private in Bluesky.
   */
  muteThread(identifier: string, options: RPCOptions = {}) {
    return this.client.call('app.bsky.graph.muteThread', {
      data: { root: identifier },
      ...options,
    });
  }

  /**
   * Unmutes the specified thread.
   */
  unmuteThread(identifier: string, options: RPCOptions = {}) {
    return this.client.call('app.bsky.graph.unmuteThread', {
      data: { root: identifier },
      ...options,
    });
  }

  /**
   * Mute an entire list (specified by AT-URI) of actors. This creates a mute relationship for all actors
   * on the specified list. Mutes are private on Bluesky.
   */
  muteActorList(identifier: string, options: RPCOptions = {}) {
    return this.client.call('app.bsky.graph.muteActorList', {
      data: { list: identifier },
      ...options,
    });
  }

  /**
   * Unmute an entire list (specified by AT-URI) of actors. This removes the mute relationship for all actors
   * on the specified list.
   */
  unmuteActorList(identifier: string, options: RPCOptions = {}) {
    return this.client.call('app.bsky.graph.unmuteActorList', {
      data: { list: identifier },
      ...options,
    });
  }
}

export class Video {
  constructor(private client: Client) {}

  /**
   * Get video upload limits for the authenticated user.
   */
  async limit(options: RPCOptions = {}) {
    const res = await this.client.get(
      'app.bsky.video.getUploadLimits',
      options,
    );

    return res.data;
  }

  /**
   * Get status details for a video processing job.
   */
  async status(jobId: string, options?: RPCOptions) {
    const res = await this.client.get('app.bsky.video.getJobStatus', {
      params: { jobId },
      ...options,
    });

    return new JobStatus(this.client, res.data.jobStatus);
  }

  /**
   * Upload a video to be processed then stored on the PDS.
   */
  async upload(data: AppBskyVideoUploadVideo.Input, options?: RPCOptions) {
    const res = await this.client.call('app.bsky.video.uploadVideo', {
      data,
      ...options,
    });

    return new JobStatus(this.client, res.data.jobStatus);
  }
}

class JobStatus {
  jobId: string;
  did: string;
  /** The state of the video processing job. All values not listed as a known value indicate that the job is in process. */
  state: 'JOB_STATE_COMPLETED' | 'JOB_STATE_FAILED' | (string & {});
  /** Progress within the current processing state. */
  progress?: number;
  blob?: AppBskyVideoDefs.JobStatus['blob'];
  error?: string;
  message?: string;

  constructor(
    private client: Client,
    data: AppBskyVideoDefs.JobStatus,
  ) {
    this.jobId = data.jobId;
    this.did = data.did;

    this.state = data.state;

    this.progress = data.progress;
    this.blob = data.blob;
    this.error = data.error;
    this.message = data.message;
  }

  /**
   * Update status details for a video processing job.
   */
  async refresh(options?: RPCOptions) {
    const res = await this.client
      .get('app.bsky.video.getJobStatus', {
        params: { jobId: this.jobId },
        ...options,
      })
      .then((res) => res.data.jobStatus);

    this.state = res.state;

    this.progress = res.progress;
    this.blob = res.blob;
    this.error = res.error;
    this.message = res.message;
  }
}

export class Agent {
  client: Client<Queries>;

  constructor(private handler: CredentialManager) {
    // Initialize the client
    const xrpc = new XRPC({ handler: this.handler });
    this.client = new Client(xrpc, this.handler);
  }

  get session() {
    return this.handler.session;
  }

  /**
   * Get detailed profile view of an actor. Does not require auth, but contains relevant metadata with auth.
   */
  async actor(identifier: At.DID) {
    return new ActorLazyProfile(this.client, identifier);
  }

  /**
   * Get a hydrated feed from an actor's selected feed generator. Implemented by App View.
   */
  async feed(
    params: AppBskyFeedGetFeed.Params,
    options?: AppBskyFeedGetFeed.Input,
  ) {
    return Paginator.init(async (cursor) => {
      const data = await this.client
        .get('app.bsky.feed.getFeed', {
          ...(options ?? {}),
          params: {
            cursor,
            ...params,
          },
        })
        .then((res) => res.data);

      data.feed = data.feed.map((item) => new FeedViewPost(this.client, item));

      return data;
    });
  }

  /**
   * Send information about interactions with feed items back to the feed generator that served them.
   */
  async sendInteractions(
    interactions: AppBskyFeedSendInteractions.Input['interactions'],
    options: RPCOptions = {},
  ) {
    return this.client
      .call('app.bsky.feed.sendInteractions', {
        data: { interactions },
        ...options,
      })
      .then((res) => res.data);
  }

  get search() {
    return new Search(this.client);
  }

  get user() {
    if (!this.session) {
      throw new Error('There is no active session');
    }

    return new User(this.client, this.session.did);
  }

  get video() {
    if (!this.session) {
      throw new Error('There is no active session');
    }

    return new Video(this.client);
  }

  async posts(uris: string[], options?: RPCOptions) {
    const data = await this.client
      .get('app.bsky.feed.getPosts', {
        params: { uris },
        ...options,
      })
      .then((res) => res.data);

    return data.posts.map((post) => new PostView(this.client, post));
  }

  /**
   * Gets a view of a starter pack.
   */
  startpacks(
    uri: string,
    options?: RPCOptions,
  ): Promise<AppBskyGraphGetStarterPack.Output>;
  /**
   * Get views for a list of starter packs.
   */
  startpacks(
    uris: string[],
    options?: RPCOptions,
  ): Promise<AppBskyGraphGetStarterPacks.Output['starterPacks']>;

  async startpacks(uris: string | string[], options: RPCOptions = {}) {
    if (Array.isArray(uris)) {
      const data = await this.client
        .get('app.bsky.graph.getStarterPacks', {
          params: {
            uris,
          },
          ...options,
        })
        .then((res) => res.data);

      return data.starterPacks;
    }

    const data = await this.client
      .get('app.bsky.graph.getStarterPack', {
        params: { starterPack: uris },
        ...options,
      })
      .then((res) => res.data);

    return data;
  }
}
