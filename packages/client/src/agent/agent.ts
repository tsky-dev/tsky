import { type CredentialManager, XRPC } from '@atcute/client';
import type {
  AppBskyGraphGetStarterPack,
  AppBskyGraphGetStarterPacks,
  Queries,
} from '@tsky/lexicons';
import { Actor } from '~/actor';
import { Feed } from '~/feed';
import { List } from '~/list';
import { Search } from '~/search';
import type { RPCOptions } from '~/types';
import { User } from '~/user';
import { Video } from '~/video';
import { Client } from './client';

export class Agent {
  client: Client<Queries>;

  constructor(private handler: CredentialManager) {
    // Initialize the client
    const xrpc = new XRPC({ handler: this.handler });
    this.client = new Client(xrpc);
  }

  get session() {
    return this.handler.session;
  }

  actor(identifier: string) {
    return new Actor(this.client, identifier);
  }

  list(uri: string) {
    return new List(this.client, uri);
  }

  get feed() {
    return new Feed(this.client);
  }

  get search() {
    return new Search(this.client);
  }

  get user() {
    if (!this.session) {
      throw new Error('There is no active session');
    }

    return new User(this.client, this.session.handle);
  }

  get video() {
    if (!this.session) {
      throw new Error('There is no active session');
    }

    return new Video(this.client);
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
