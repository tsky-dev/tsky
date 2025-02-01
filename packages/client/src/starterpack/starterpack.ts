import type {
  AppBskyGraphGetStarterPack,
  AppBskyGraphGetStarterPacks,
} from '@tsky/lexicons';
import type { Client } from '~/agent/client';
import type { RPCOptions } from '~/types';
import { Paginator } from '~/utils';

export class StarterPack {
  constructor(private client: Client) {}

  /**
   * Gets a view of a starter pack.
   */
  view(
    uri: string,
    options: RPCOptions,
  ): Promise<AppBskyGraphGetStarterPack.Output>;
  /**
   * Get views for a list of starter packs.
   */
  view(
    uris: string[],
    options: RPCOptions,
  ): Promise<AppBskyGraphGetStarterPacks.Output['starterPacks']>;

  async view(uris: string | string[], options: RPCOptions) {
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

  /**
   * Search for starter packs.
   */
  search(query: string, limit?: number, options?: RPCOptions) {
    return Paginator.init(async (cursor) => {
      const res = await this.client.get('app.bsky.graph.searchStarterPacks', {
        params: {
          cursor,
          q: query,
          limit,
        },
        ...options,
      });

      return res.data;
    });
  }
}
