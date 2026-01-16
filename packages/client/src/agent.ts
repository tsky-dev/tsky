import type {
  ComAtprotoLabelDefs,
  ComAtprotoRepoStrongRef,
} from '@atcute/atproto';
import type {
  AppBskyActorDefs,
  AppBskyActorPutPreferences,
  AppBskyFeedDefs,
  AppBskyFeedGetAuthorFeed,
  AppBskyFeedGetFeed,
  AppBskyFeedGetFeedGenerator,
  AppBskyFeedGetFeedGenerators,
  AppBskyFeedGetFeedSkeleton,
  AppBskyFeedGetLikes,
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
} from '@atcute/bluesky';

import { Client as AtcuteClient, type CredentialManager } from '@atcute/client';
import type {
  ActorIdentifier,
  Did,
  Handle,
  ResourceUri,
} from '@atcute/lexicons';

import { Client } from './client';
import type { RPCOptions } from './types';
import { Paginator, parseAtUri } from './utils';

export class Actor {
  client: Client;
  did: Did;

  constructor(client: Client, did: Did) {
    this.client = client;
    this.did = did;
  }

  /**
   * Get a list of starter packs created by the actor.
   */
  starterPacks(limit?: number, options: RPCOptions = {}) {
    return Paginator.init(async (cursor) => {
      const data = await this.client.get(
        'app.bsky.graph.getActorStarterPacks',
        {
          params: { cursor, actor: this.did, limit },
          ...options,
        },
      );

      data.starterPacks = data.starterPacks.map(
        (starterPack: AppBskyGraphDefs.StarterPackViewBasic) =>
          new StarterpackBasicView(this.client, starterPack),
      );

      return data;
    });
  }

  /**
   * Enumerates accounts which follow a specified account (actor).
   */
  followers(limit?: number, options: RPCOptions = {}) {
    return Paginator.init(async (cursor) => {
      const data = await this.client.get('app.bsky.graph.getFollowers', {
        params: {
          cursor,
          actor: this.did,
          limit,
        },
        ...options,
      });

      data.subject = new ActorProfile(
        this.client,
        data.subject as AppBskyActorDefs.ProfileViewDetailed,
      ) as unknown as AppBskyActorDefs.ProfileView;
      data.followers = data.followers.map(
        (follower: AppBskyActorDefs.ProfileView) =>
          new ActorProfile(
            this.client,
            follower,
          ) as unknown as AppBskyActorDefs.ProfileView,
      );

      return data;
    });
  }

  /**
   * Enumerates accounts which a specified account (actor) follows.
   */
  follows(limit?: number, options: RPCOptions = {}) {
    return Paginator.init(async (cursor) => {
      const data = await this.client.get('app.bsky.graph.getFollows', {
        params: {
          cursor,
          actor: this.did,
          limit,
        },
        ...options,
      });

      data.subject = new ActorProfile(
        this.client,
        data.subject as AppBskyActorDefs.ProfileViewDetailed,
      ) as unknown as AppBskyActorDefs.ProfileView;
      data.follows = data.follows.map(
        (follow: AppBskyActorDefs.ProfileView) =>
          new ActorProfile(
            this.client,
            follow,
          ) as unknown as AppBskyActorDefs.ProfileView,
      );

      return data;
    });
  }

  /**
   * Enumerates the lists created by a specified account (actor).
   */
  lists(limit?: number, options: RPCOptions = {}) {
    return Paginator.init(async (cursor) => {
      const data = await this.client.get('app.bsky.graph.getLists', {
        params: {
          cursor,
          actor: this.did,
          limit,
        },
        ...options,
      });

      data.lists = data.lists.map(
        (list: AppBskyGraphDefs.ListView) =>
          new ListView(
            this.client,
            list,
          ) as unknown as AppBskyGraphDefs.ListView,
      );

      return data;
    });
  }

  /**
   * Enumerates public relationships between one account, and a list of other accounts. Does not require auth.
   */
  async relationships(others?: ActorIdentifier[], options?: RPCOptions) {
    const data = await this.client.get('app.bsky.graph.getRelationships', {
      params: {
        actor: this.did,
        others,
      },
      ...(options ?? {}),
    });

    return {
      ...data,
      actor: data.actor
        ? new ActorLazyProfile(this.client, data.actor as Did)
        : undefined,
    };
  }

  /**
   * Get a view of an actor's 'author feed' (post and reposts by the author). Does not require auth.
   */
  feeds(limit?: number, options?: RPCOptions) {
    return Paginator.init(async (cursor) => {
      const data = await this.client.get('app.bsky.feed.getActorFeeds', {
        params: { cursor, actor: this.did, limit },
        ...options,
      });

      data.feeds = data.feeds.map(
        (feed: AppBskyFeedDefs.GeneratorView) =>
          new FeedGeneratorView(
            this.client,
            feed,
          ) as unknown as AppBskyFeedDefs.GeneratorView,
      );

      return data;
    });
  }

  /**
   * Get a list of feeds (feed generator records) created by the actor (in the actor's repo).
   */
  feed(
    params?: Omit<AppBskyFeedGetAuthorFeed.$params, 'actor'>,
    options?: RPCOptions,
  ) {
    return Paginator.init(async (cursor) => {
      const data = await this.client.get('app.bsky.feed.getAuthorFeed', {
        params: { cursor, ...params, actor: this.did },
        ...options,
      });

      data.feed = data.feed.map(
        (item: AppBskyFeedDefs.FeedViewPost) =>
          new FeedViewPost(this.client, item),
      );

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
    const data = await this.client.get('app.bsky.actor.getProfile', {
      params: { actor: this.did },
    });

    return new ActorProfile(
      this.client,
      data as AppBskyActorDefs.ProfileViewDetailed,
    );
  }
}

export class ActorBasicProfile
  extends Actor
  implements AppBskyActorDefs.ProfileViewBasic
{
  handle: AppBskyActorDefs.ProfileViewBasic['handle'];
  associated?: AppBskyActorDefs.ProfileAssociated | undefined;
  avatar?: AppBskyActorDefs.ProfileViewBasic['avatar'];
  createdAt?: string | undefined;
  displayName?: string | undefined;
  labels?: ComAtprotoLabelDefs.Label[] | undefined;
  viewer?: AppBskyActorDefs.ViewerState | undefined;
  $type?: AppBskyActorDefs.ProfileViewBasic['$type'];

  constructor(client: Client, actor: AppBskyActorDefs.ProfileViewBasic) {
    super(client, actor.did as Did);
    this.handle = actor.handle;
    this.associated = actor.associated;
    this.avatar = actor.avatar;
    this.createdAt = actor.createdAt;
    this.displayName = actor.displayName;
    this.labels = actor.labels;
    this.$type = actor.$type as AppBskyActorDefs.ProfileViewBasic['$type'];

    if (actor.viewer) {
      this.viewer = actor.viewer;

      if (actor.viewer?.knownFollowers) {
        actor.viewer.knownFollowers.followers =
          actor.viewer.knownFollowers.followers.map(
            (follower: AppBskyActorDefs.ProfileViewBasic) =>
              new ActorBasicProfile(client, follower),
          );
      }

      if (actor.viewer?.blockingByList) {
        actor.viewer.blockingByList = new ListBasicView(
          client,
          actor.viewer.blockingByList as AppBskyGraphDefs.ListViewBasic,
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
  description?: AppBskyActorDefs.ProfileViewDetailed['description'];
  indexedAt?: AppBskyActorDefs.ProfileViewDetailed['indexedAt'];
  followersCount?: AppBskyActorDefs.ProfileViewDetailed['followersCount'];
  followsCount?: AppBskyActorDefs.ProfileViewDetailed['followsCount'];
  postsCount?: AppBskyActorDefs.ProfileViewDetailed['postsCount'];
  banner?: AppBskyActorDefs.ProfileViewDetailed['banner'];
  joinedViaStarterPack?: AppBskyGraphDefs.StarterPackViewBasic | undefined;
  pinnedPost?: ComAtprotoRepoStrongRef.Main | undefined;
  // @ts-expect-error: $type literal in subclass conflicts with parent's type definition
  override $type?: AppBskyActorDefs.ProfileViewDetailed['$type'];

  constructor(
    client: Client,
    actor: AppBskyActorDefs.ProfileView | AppBskyActorDefs.ProfileViewDetailed,
  ) {
    super(client, actor as AppBskyActorDefs.ProfileViewBasic);
    const detailed = actor as AppBskyActorDefs.ProfileViewDetailed;
    this.description = detailed.description;
    this.indexedAt = detailed.indexedAt;
    this.followersCount = detailed.followersCount;
    this.followsCount = detailed.followsCount;
    this.postsCount = detailed.postsCount;
    this.banner = detailed.banner;
    this.joinedViaStarterPack = detailed.joinedViaStarterPack;
    this.pinnedPost = detailed.pinnedPost;
    this.$type = actor.$type as AppBskyActorDefs.ProfileViewDetailed['$type'];
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
  uri: ResourceUri;

  constructor(client: Client, uri: ResourceUri) {
    this.client = client;
    this.uri = uri;
  }

  /**
   * Gets a 'view' (with additional context) of a specified list.
   */
  about(limit?: number, options?: RPCOptions) {
    return Paginator.init(async (cursor) => {
      const data = await this.client.get('app.bsky.graph.getList', {
        params: {
          cursor,
          list: this.uri,
          limit,
        },
        ...options,
      });

      data.items = data.items.map((item: AppBskyGraphDefs.ListItemView) => {
        item.subject = new ActorProfile(
          this.client,
          item.subject as AppBskyActorDefs.ProfileView,
        ) as unknown as AppBskyActorDefs.ProfileView;

        return item;
      });

      // @ts-expect-error: ListView is a compatible superset of ListViewBasic
      data.list = new ListView(this.client, data.list);

      return data;
    });
  }

  /**
   * Get a feed of recent posts from a list (posts and reposts from any actors on the list). Does not require auth.
   */
  feed(limit?: number, options?: RPCOptions) {
    return Paginator.init(async (cursor) => {
      const data = await this.client.get('app.bsky.feed.getListFeed', {
        params: {
          cursor,
          list: this.uri,
          limit,
        },
        ...options,
      });

      data.feed = data.feed.map(
        (item: AppBskyFeedDefs.FeedViewPost) =>
          new FeedViewPost(this.client, item),
      );

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
  purpose: AppBskyGraphDefs.ListViewBasic['purpose'];
  avatar?: AppBskyGraphDefs.ListViewBasic['avatar'];
  indexedAt?: AppBskyGraphDefs.ListViewBasic['indexedAt'];
  labels?: AppBskyGraphDefs.ListViewBasic['labels'];
  listItemCount?: AppBskyGraphDefs.ListViewBasic['listItemCount'];
  viewer?: AppBskyGraphDefs.ListViewerState | undefined;
  $type?: AppBskyGraphDefs.ListViewBasic['$type'];

  constructor(client: Client, list: AppBskyGraphDefs.ListViewBasic) {
    super(client, list.uri as ResourceUri);
    this.cid = list.cid;
    this.name = list.name;
    this.purpose = list.purpose;
    this.avatar = list.avatar;
    this.indexedAt = list.indexedAt;
    this.labels = list.labels;
    this.listItemCount = list.listItemCount;
    this.viewer = list.viewer;
    this.$type = list.$type as AppBskyGraphDefs.ListViewBasic['$type'];
  }
}

export class ListView
  extends ListBasicView
  implements AppBskyGraphDefs.ListView
{
  override indexedAt: string;
  // @ts-expect-error: Property type in subclass conflicts with parent's type definition
  creator: ActorProfile;
  description?: AppBskyGraphDefs.ListView['description'];
  descriptionFacets?: AppBskyRichtextFacet.Main[] | undefined;
  // @ts-expect-error: $type literal in subclass conflicts with parent's type definition
  override $type?: AppBskyGraphDefs.ListView['$type'];

  constructor(client: Client, list: AppBskyGraphDefs.ListView) {
    super(client, list as AppBskyGraphDefs.ListViewBasic);
    this.indexedAt = list.indexedAt;
    this.creator = new ActorProfile(
      client,
      list.creator as AppBskyActorDefs.ProfileViewDetailed,
    ) as unknown as ActorProfile & AppBskyActorDefs.ProfileView;
    this.description = list.description;
    this.descriptionFacets = list.descriptionFacets;
    this.$type = list.$type;
  }
}

export class Starterpack {
  cid: string;
  creator: ActorBasicProfile;
  indexedAt: string;
  record: AppBskyGraphDefs.StarterPackViewBasic['record'];
  uri: ResourceUri;
  joinedAllTimeCount?: number | undefined;
  joinedWeekCount?: number | undefined;
  labels?: AppBskyGraphDefs.StarterPackViewBasic['labels'];
  $type?: AppBskyGraphDefs.StarterPackViewBasic['$type'];

  constructor(
    public client: Client,
    payload: Omit<AppBskyGraphDefs.StarterPackViewBasic, 'listItemCount'>,
  ) {
    this.cid = payload.cid;
    this.creator = new ActorBasicProfile(
      this.client,
      payload.creator,
    ) as unknown as ActorBasicProfile & AppBskyActorDefs.ProfileViewBasic;
    this.indexedAt = payload.indexedAt;
    this.record = payload.record;
    this.uri = payload.uri as ResourceUri;
    this.joinedAllTimeCount = payload.joinedAllTimeCount;
    this.joinedWeekCount = payload.joinedWeekCount;
    this.labels = payload.labels;
    this.$type =
      payload.$type as AppBskyGraphDefs.StarterPackViewBasic['$type'];
  }
}

export class StarterpackBasicView
  extends Starterpack
  implements AppBskyGraphDefs.StarterPackViewBasic
{
  listItemCount?: number | undefined;

  constructor(client: Client, payload: AppBskyGraphDefs.StarterPackViewBasic) {
    super(
      client,
      payload as Omit<AppBskyGraphDefs.StarterPackViewBasic, 'listItemCount'>,
    );
    this.listItemCount = payload.listItemCount;
    this.uri = payload.uri as ResourceUri;
  }
}

export class StarterpackView
  extends Starterpack
  implements AppBskyGraphDefs.StarterPackView
{
  // @ts-expect-error: Property type in subclass conflicts with parent's type definition
  feeds?: FeedGeneratorView[];
  list?: ListBasicView;
  listItemsSample?: (AppBskyGraphDefs.ListItemView & {
    subject: ActorProfile;
  })[];
  // @ts-expect-error: $type literal in subclass conflicts with parent's type definition
  override $type?: AppBskyGraphDefs.StarterPackView['$type'];

  constructor(client: Client, payload: AppBskyGraphDefs.StarterPackView) {
    super(
      client,
      payload as Omit<AppBskyGraphDefs.StarterPackViewBasic, 'listItemCount'>,
    );
    this.feeds = payload.feeds?.map(
      (feed: AppBskyFeedDefs.GeneratorView) =>
        new FeedGeneratorView(client, feed),
    );

    if (payload.list) {
      this.list = new ListBasicView(client, payload.list);
    }

    // @ts-expect-error: Property type in subclass conflicts with parent's type definition
    this.listItemsSample = payload.listItemsSample?.map(
      (item: AppBskyGraphDefs.ListItemView) => {
        return {
          ...item,
          subject: new ActorProfile(client, item.subject),
        };
      },
    );
    this.$type = payload.$type as AppBskyGraphDefs.StarterPackView['$type'];
  }
}

export class PostView implements AppBskyFeedDefs.PostView {
  author: ActorBasicProfile;
  cid: string;
  indexedAt: string;
  record: AppBskyFeedDefs.PostView['record'];
  uri: AppBskyFeedDefs.PostView['uri'];
  embed?: AppBskyFeedDefs.PostView['embed'];
  labels?: AppBskyFeedDefs.PostView['labels'];
  likeCount?: number | undefined;
  quoteCount?: number | undefined;
  replyCount?: number | undefined;
  repostCount?: number | undefined;
  threadgate?: AppBskyFeedDefs.ThreadgateView | undefined;
  viewer?: AppBskyFeedDefs.ViewerState | undefined;
  $type?: AppBskyFeedDefs.PostView['$type'];

  constructor(
    public client: Client,
    payload: AppBskyFeedDefs.PostView,
  ) {
    this.author = new ActorBasicProfile(
      this.client,
      payload.author,
    ) as unknown as ActorBasicProfile & AppBskyActorDefs.ProfileViewBasic;
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
    this.$type = payload.$type as AppBskyFeedDefs.PostView['$type'];
  }

  isOfCurrentUser() {
    const { host: repo } = parseAtUri(this.uri as string);
    return repo !== this.client.credentials.session?.did;
  }

  remove(options: RPCOptions = {}) {
    return this.client.deleteRecord(this.uri as ResourceUri, options);
  }

  // TODO: method for liking, unliking, reposting, un-reposting, quoting, etc.

  /**
   * Resolve a handle to a DID.
   */
  async resolveDIDFromHandle(handle: string, options: RPCOptions = {}) {
    return this.client.get('com.atproto.identity.resolveHandle', {
      params: { handle: handle as unknown as Handle },
      ...options,
    });
  }

  /**
   * Get like records which reference a subject (by AT-URI and CID).
   */
  likes(
    params: Omit<AppBskyFeedGetLikes.$params, 'uri'> = {},
    options: RPCOptions = {},
  ) {
    return Paginator.init(async (cursor) => {
      const data = await this.client.get('app.bsky.feed.getLikes', {
        params: { cursor, uri: this.uri, ...params },
        ...options,
      });

      data.likes = data.likes.map((like: AppBskyFeedGetLikes.Like) => {
        like.actor = new ActorBasicProfile(
          this.client,
          like.actor as AppBskyActorDefs.ProfileViewBasic,
        ) as unknown as AppBskyActorDefs.ProfileView;
        return like;
      });

      return data;
    });
  }

  /**
   * Get a list of quotes for a given post.
   */
  quotes(
    params: Omit<AppBskyFeedGetQuotes.$params, 'uri'> = {},
    options: RPCOptions = {},
  ) {
    return Paginator.init(async (cursor) => {
      const data = await this.client.get('app.bsky.feed.getQuotes', {
        params: { cursor, uri: this.uri, ...params },
        ...options,
      });

      data.posts = data.posts.map(
        (post: AppBskyFeedDefs.PostView) => new PostView(this.client, post),
      );

      return data;
    });
  }

  /**
   * Get a list of reposts for a given post.
   */
  repostedBy(
    params: Omit<AppBskyFeedGetRepostedBy.$params, 'uri'> = {},
    options: RPCOptions = {},
  ) {
    return Paginator.init(async (cursor) => {
      const data = await this.client.get('app.bsky.feed.getRepostedBy', {
        params: { cursor, uri: this.uri, ...params },
        ...options,
      });

      data.repostedBy = data.repostedBy.map(
        (repost: AppBskyActorDefs.ProfileView) =>
          new ActorProfile(
            this.client,
            repost,
          ) as unknown as AppBskyActorDefs.ProfileView,
      );

      return data;
    });
  }

  /**
   * Gets post views for a specified list of posts (by AT-URI). This is sometimes referred to as 'hydrating' a 'feed skeleton'.
   */
  static async getMany(
    client: Client,
    posts: ResourceUri[],
    options: RPCOptions = {},
  ) {
    const data = await client.get('app.bsky.feed.getPosts', {
      params: { uris: posts },
      ...options,
    });

    data.posts = data.posts.map(
      (post: AppBskyFeedDefs.PostView) => new PostView(client, post),
    );

    return data;
  }
}

export class Search {
  constructor(private client: Client) {}

  /**
   * Find posts matching search criteria, returning views of those posts.
   */
  posts(params: AppBskyFeedSearchPosts.$params, options: RPCOptions = {}) {
    return Paginator.init(async (cursor) => {
      const data = await this.client.get('app.bsky.feed.searchPosts', {
        params: { cursor, ...params },
        ...options,
      });

      data.posts = data.posts.map(
        (post: AppBskyFeedDefs.PostView) => new PostView(this.client, post),
      );

      return data;
    });
  }

  /**
   * Search for starter packs.
   */
  starterpacks(
    params: AppBskyGraphSearchStarterPacks.$params,
    options?: RPCOptions,
  ) {
    return Paginator.init(async (cursor) => {
      const data = await this.client.get('app.bsky.graph.searchStarterPacks', {
        params: {
          cursor,
          ...params,
        },
        ...options,
      });

      data.starterPacks = data.starterPacks.map(
        (starterPack: AppBskyGraphDefs.StarterPackViewBasic) =>
          new StarterpackBasicView(this.client, starterPack),
      );

      return data;
    });
  }
}

export class FeedViewPost implements AppBskyFeedDefs.FeedViewPost {
  post: PostView;
  feedContext?: string | undefined;
  reason?: AppBskyFeedDefs.FeedViewPost['reason'];
  reply?: AppBskyFeedDefs.FeedViewPost['reply'];
  $type?: AppBskyFeedDefs.FeedViewPost['$type'];

  constructor(
    public client: Client,
    payload: AppBskyFeedDefs.FeedViewPost,
  ) {
    this.$type = payload.$type as AppBskyFeedDefs.FeedViewPost['$type'];
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
    return this.client.get('app.bsky.feed.describeFeedGenerator', options);
  }

  /**
   * Get information about a feed generator. Implemented by AppView.
   */
  feed(
    feed: ResourceUri,
    options: RPCOptions,
  ): Promise<AppBskyFeedGetFeedGenerator.$output>;
  /**
   * Get information about a list of feed generators.
   */
  feed(
    feeds: ResourceUri[],
    options: RPCOptions,
  ): Promise<AppBskyFeedGetFeedGenerators.$output['feeds']>;

  async feed(feed: ResourceUri | ResourceUri[], options: RPCOptions) {
    if (Array.isArray(feed)) {
      const data = await this.client.get('app.bsky.feed.getFeedGenerators', {
        params: {
          feeds: feed,
        },
        ...options,
      });

      return data.feeds;
    }

    return this.client.get('app.bsky.feed.getFeedGenerator', {
      params: { feed },
      ...options,
    });
  }

  /**
   * Get a skeleton of a feed provided by a feed generator. Auth is optional, depending on provider requirements, and provides the DID of the requester. Implemented by Feed Generator Service.
   */
  skeleton(
    params: AppBskyFeedGetFeedSkeleton.$params,
    options: RPCOptions = {},
  ) {
    return Paginator.init(async (cursor) => {
      return this.client.get('app.bsky.feed.getFeedSkeleton', {
        params: { cursor, ...params },
        ...options,
      });
    });
  }
}

export class FeedGeneratorView implements AppBskyFeedDefs.GeneratorView {
  cid: string;
  // @ts-expect-error: Property type in subclass conflicts with parent's type definition
  creator: ActorProfile;
  did: Did;
  displayName: string;
  indexedAt: string;
  uri: AppBskyFeedDefs.GeneratorView['uri'];
  acceptsInteractions?: boolean | undefined;
  avatar?: AppBskyFeedDefs.GeneratorView['avatar'];
  contentMode?: AppBskyFeedDefs.GeneratorView['contentMode'];
  description?: string | undefined;
  descriptionFacets?: AppBskyRichtextFacet.Main[] | undefined;
  labels?: AppBskyFeedDefs.GeneratorView['labels'];
  likeCount?: number | undefined;
  viewer?: AppBskyFeedDefs.GeneratorViewerState | undefined;
  $type?: AppBskyFeedDefs.GeneratorView['$type'];

  constructor(
    public client: Client,
    payload: AppBskyFeedDefs.GeneratorView,
  ) {
    this.cid = payload.cid;
    this.creator = new ActorProfile(
      this.client,
      payload.creator as AppBskyActorDefs.ProfileViewDetailed,
    ) as unknown as ActorProfile;
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
    this.$type = payload.$type as AppBskyFeedDefs.GeneratorView['$type'];
  }
}

export class Preferences {
  constructor(public client: Client) {}

  /**
   * Get private preferences attached to the current account. Expected use is synchronization between multiple devices, and import/export during account migration. Requires auth.
   */
  async get(options: RPCOptions = {}) {
    const data = await this.client.get('app.bsky.actor.getPreferences', {
      params: {},
      ...options,
    });

    return data.preferences;
  }

  /**
   * Set the private preferences attached to the account.
   */
  async set(
    preferences: AppBskyActorPutPreferences.$input['preferences'],
    options: RPCOptions = {},
  ) {
    await this.client.call('app.bsky.actor.putPreferences', {
      input: { preferences },
      as: null,
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
      const data = await this.client.get('app.bsky.graph.getListMutes', {
        params: {
          cursor,
          limit,
        },
        ...options,
      });

      // @ts-expect-error: ListView is a compatible superset of ListViewBasic
      data.lists = data.lists.map(
        (list: AppBskyGraphDefs.ListView) => new ListView(this.client, list),
      );

      return data;
    });
  }

  /**
   * Enumerates accounts that the requesting account (actor) currently has muted. Requires auth.
   */
  profiles(limit?: number, options?: RPCOptions) {
    return Paginator.init(async (cursor) => {
      const data = await this.client.get('app.bsky.graph.getMutes', {
        params: {
          cursor,
          limit,
        },
        ...options,
      });

      // @ts-expect-error: ActorProfile is a compatible superset of ProfileView
      data.mutes = data.mutes.map(
        (mute: AppBskyActorDefs.ProfileView) =>
          new ActorProfile(this.client, mute),
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
      const data = await this.client.get('app.bsky.actor.getSuggestions', {
        params: {
          cursor,
          limit,
        },
        ...options,
      });

      // @ts-expect-error: ActorProfile is a compatible superset of ProfileView
      data.actors = data.actors.map(
        (actor: AppBskyActorDefs.ProfileView) =>
          new ActorProfile(this.client, actor),
      );

      return data;
    });
  }

  /**
   * Enumerates follows similar to a given account (actor). Expected use is to recommend additional accounts immediately after following one account.
   */
  async afterFollowing(actor: ActorIdentifier, options?: RPCOptions) {
    const data = await this.client.get(
      'app.bsky.graph.getSuggestedFollowsByActor',
      {
        params: {
          actor,
        },
        ...options,
      },
    );

    // @ts-expect-error: ActorProfile is a compatible superset of ProfileView
    data.suggestions = data.suggestions.map(
      (suggestion: AppBskyActorDefs.ProfileView) =>
        new ActorProfile(this.client, suggestion),
    );

    return data;
  }

  /**
   * Get a list of suggested feeds (feed generators) for the requesting account.
   */
  feeds(limit?: number, options?: RPCOptions) {
    return Paginator.init(async (cursor) => {
      const data = await this.client.get('app.bsky.feed.getSuggestedFeeds', {
        params: { cursor, limit },
        ...options,
      });

      data.feeds = data.feeds.map(
        (feed: AppBskyFeedDefs.GeneratorView) =>
          new FeedGeneratorView(
            this.client,
            feed,
          ) as unknown as AppBskyFeedDefs.GeneratorView,
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
    params: AppBskyFeedGetTimeline.$params,
    options?: RPCOptions,
  ): Promise<Paginator<AppBskyFeedGetTimeline.$output>> {
    return Paginator.init(async (cursor) => {
      const data = await this.client.get('app.bsky.feed.getTimeline', {
        ...(options ?? {}),
        params: {
          cursor,
          ...params,
        },
      });

      data.feed = data.feed.map(
        (item: AppBskyFeedDefs.FeedViewPost) =>
          new FeedViewPost(this.client, item),
      );

      return data;
    });
  }

  /**
   * Get a list of posts liked by the current user
   */
  likes(limit?: number, options: RPCOptions = {}) {
    return Paginator.init(async (cursor) => {
      const data = await this.client.get('app.bsky.feed.getActorLikes', {
        params: { cursor, actor: this.did, limit },
        ...options,
      });

      data.feed = data.feed.map(
        (item: AppBskyFeedDefs.FeedViewPost) =>
          new FeedViewPost(this.client, item),
      );

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
  muteActor(identifier: ActorIdentifier, options: RPCOptions = {}) {
    return this.client.call('app.bsky.graph.muteActor', {
      input: { actor: identifier },
      as: null,
      ...options,
    });
  }

  /**
   * Unmutes the specified account.
   */
  unmuteActor(identifier: ActorIdentifier, options: RPCOptions = {}) {
    return this.client.call('app.bsky.graph.unmuteActor', {
      input: { actor: identifier },
      as: null,
      ...options,
    });
  }

  /**
   * Mutes a thread preventing notifications from the thread and any of its children. Mutes are private in Bluesky.
   */
  muteThread(identifier: ResourceUri, options: RPCOptions = {}) {
    return this.client.call('app.bsky.graph.muteThread', {
      input: { root: identifier },
      as: null,
      ...options,
    });
  }

  /**
   * Resolve a handle to a DID.
   */
  async resolveDIDFromHandle(handle: string, options: RPCOptions = {}) {
    return this.client.get('com.atproto.identity.resolveHandle', {
      params: { handle: handle as unknown as Handle },
      ...options,
    });
  }

  /**
   * Mute an entire list (specified by AT-URI) of actors. This creates a mute relationship for all actors
   * on the specified list. Mutes are private on Bluesky.
   */
  muteActorList(identifier: ResourceUri, options: RPCOptions = {}) {
    return this.client.call('app.bsky.graph.muteActorList', {
      input: { list: identifier },
      as: null,
      ...options,
    });
  }

  /**
   * Unmute an entire list (specified by AT-URI) of actors. This removes the mute relationship for all actors
   * on the specified list.
   */
  unmuteActorList(identifier: ResourceUri, options: RPCOptions = {}) {
    return this.client.call('app.bsky.graph.unmuteActorList', {
      input: { list: identifier },
      as: null,
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
    return this.client.get('app.bsky.video.getUploadLimits', options);
  }

  /**
   * Get status details for a video processing job.
   */
  async status(jobId: string, options?: RPCOptions) {
    const data = await this.client.get('app.bsky.video.getJobStatus', {
      params: { jobId },
      ...options,
    });

    return new JobStatus(this.client, data.jobStatus);
  }

  /**
   * Upload a video to be processed then stored on the PDS.
   */
  async upload(input: AppBskyVideoUploadVideo.$input, options?: RPCOptions) {
    const data = await this.client.call('app.bsky.video.uploadVideo', {
      input,
      as: null,
      ...options,
    });

    return new JobStatus(this.client, data.jobStatus);
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
    const data = await this.client.get('app.bsky.video.getJobStatus', {
      params: { jobId: this.jobId },
      ...options,
    });

    this.state = data.jobStatus.state;

    this.progress = data.jobStatus.progress;
    this.blob = data.jobStatus.blob;
    this.error = data.jobStatus.error;
    this.message = data.jobStatus.message;
  }
}

export class Agent {
  client: Client;

  constructor(private handler: CredentialManager) {
    // Initialize the client
    const xrpc = new AtcuteClient({ handler: this.handler });
    this.client = new Client(xrpc, this.handler);
  }

  get session() {
    return this.handler.session;
  }

  /**
   * Get detailed profile view of an actor. Does not require auth, but contains relevant metadata with auth.
   */
  async actor(identifier: Did | string) {
    return new ActorLazyProfile(this.client, identifier as Did);
  }

  /**
   * Get a hydrated feed from an actor's selected feed generator. Implemented by App View.
   */
  async feed(params: AppBskyFeedGetFeed.$params, options?: RPCOptions) {
    return Paginator.init(async (cursor) => {
      const data = await this.client.get('app.bsky.feed.getFeed', {
        ...(options ?? {}),
        params: {
          cursor,
          ...params,
        },
      });

      data.feed = data.feed.map(
        (item: AppBskyFeedDefs.FeedViewPost) =>
          new FeedViewPost(this.client, item),
      );

      return data;
    });
  }

  /**
   * Send information about interactions with feed items back to the feed generator that served them.
   */
  async sendInteractions(
    interactions: AppBskyFeedSendInteractions.$input['interactions'],
    options: RPCOptions = {},
  ) {
    return this.client.call('app.bsky.feed.sendInteractions', {
      input: { interactions },
      as: null,
      ...options,
    });
  }

  get search() {
    return new Search(this.client);
  }

  get user() {
    if (!this.session) {
      throw new Error('There is no active session');
    }

    return new User(this.client, this.session.did as Did);
  }

  get video() {
    if (!this.session) {
      throw new Error('There is no active session');
    }

    return new Video(this.client);
  }

  async posts(uris: ResourceUri[], options?: RPCOptions) {
    const data = await this.client.get('app.bsky.feed.getPosts', {
      params: { uris },
      ...options,
    });

    return data.posts.map(
      (post: AppBskyFeedDefs.PostView) => new PostView(this.client, post),
    );
  }

  /**
   * Gets a view of a starter pack.
   */
  startpacks(
    uri: ResourceUri,
    options?: RPCOptions,
  ): Promise<AppBskyGraphGetStarterPack.$output>;
  /**
   * Get views for a list of starter packs.
   */
  startpacks(
    uris: ResourceUri[],
    options?: RPCOptions,
  ): Promise<AppBskyGraphGetStarterPacks.$output['starterPacks']>;

  async startpacks(
    uris: ResourceUri | ResourceUri[],
    options: RPCOptions = {},
  ) {
    if (Array.isArray(uris)) {
      const data = await this.client.get('app.bsky.graph.getStarterPacks', {
        params: {
          uris,
        },
        ...options,
      });

      return data.starterPacks;
    }

    const data = await this.client.get('app.bsky.graph.getStarterPack', {
      params: { starterPack: uris },
      ...options,
    });

    return data;
  }

  async resolveDIDFromHandle(handle: string, options: RPCOptions = {}) {
    return this.client.get('com.atproto.identity.resolveHandle', {
      params: { handle: handle as unknown as Handle },
      ...options,
    });
  }
}
