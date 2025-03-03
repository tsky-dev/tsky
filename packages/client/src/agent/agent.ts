import { type CredentialManager, XRPC } from '@atcute/client';
import type {
  AppBskyFeedGetFeed,
  AppBskyFeedSendInteractions,
  AppBskyGraphGetStarterPack,
  AppBskyGraphGetStarterPacks,
  At,
  Queries,
} from '@tsky/lexicons';
import { ActorWithProfileFunction } from '~/actor';
import { FeedViewPost } from '~/feed';
import { Post } from '~/post';
import { Search } from '~/search';
import type { RPCOptions } from '~/types';
import { User } from '~/user';
import { Paginator } from '~/utils';
import { Video } from '~/video';
import { Client } from './client';

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
  async actor(identifier: At.DID): Promise<ActorWithProfileFunction> {
    return new ActorWithProfileFunction(this.client, identifier);
  }

  /**
   * Get a hydrated feed from an actor's selected feed generator. Implemented by App View.
   */
  async feed(
    params: AppBskyFeedGetFeed.Params,
    options?: AppBskyFeedGetFeed.Input,
  ): Promise<Paginator<AppBskyFeedGetFeed.Output>> {
    return Paginator.init(async (cursor) => {
      const res = await this.client.get('app.bsky.feed.getFeed', {
        ...(options ?? {}),
        params: {
          cursor,
          ...params,
        },
      });

      return {
        ...res.data,
        feed: res.data.feed.map((item) => new FeedViewPost(this.client, item)),
      };
    });
  }

  /**
   * Send information about interactions with feed items back to the feed generator that served them.
   */
  async sendInteractions(
    interactions: AppBskyFeedSendInteractions.Input['interactions'],
    options: RPCOptions = {},
  ) {
    const res = await this.client.call('app.bsky.feed.sendInteractions', {
      data: { interactions },
      ...options,
    });

    return res.data;
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

    return data.posts.map((post) => new Post(this.client, post));
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
      const res = await this.client.get('app.bsky.graph.getStarterPacks', {
        params: {
          uris,
        },
        ...options,
      });

      return res.data.starterPacks;
    }

    const res = await this.client.get('app.bsky.graph.getStarterPack', {
      params: { starterPack: uris },
      ...options,
    });

    return res.data;
  }
}
