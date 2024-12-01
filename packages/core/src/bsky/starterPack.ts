import type {
  AppBskyGraphGetStarterPack,
  AppBskyGraphGetStarterPacks,
  AppBskyGraphSearchStarterPacks,
  AppBskyNS,
} from '@atproto/api';
import { Paginator } from '~/tsky/paginator';

export class StarterPack {
  constructor(
    private instance: AppBskyNS,
    private uri: string,
  ) {}

  /**
   * Gets a view of a starter pack.
   */
  async about(options?: AppBskyGraphGetStarterPack.CallOptions) {
    const res = await this.instance.graph.getStarterPack(
      {
        starterPack: this.uri,
      },
      options,
    );

    return res.data;
  }

  /**
   * Search for starter packs.
   */
  static search(
    instance: AppBskyNS,
    query: string,
    limit?: number,
    options?: AppBskyGraphSearchStarterPacks.CallOptions,
  ) {
    return new Paginator(async (cursor) => {
      const res = await instance.graph.searchStarterPacks(
        {
          cursor,
          q: query,
          limit,
        },
        options,
      );

      return res.data;
    });
  }

  /**
   * Get views for a list of starter packs.
   */
  static async getMany(
    instance: AppBskyNS,
    starterpacks: string[],
    options?: AppBskyGraphGetStarterPacks.CallOptions,
  ) {
    const res = await instance.graph.getStarterPacks(
      { uris: starterpacks },
      options,
    );

    return res.data;
  }
}
