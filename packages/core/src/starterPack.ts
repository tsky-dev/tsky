import type {
  AppBskyGraphGetStarterPack,
  AppBskyGraphGetStarterPacks,
  AppBskyGraphSearchStarterPacks,
  AppBskyNS,
} from '@atproto/api'
import { Paginator } from './paginate'

export class StarterPack {
  constructor(private instance: AppBskyNS, private uri: string) {}

  /**
   * Gets a view of a starter pack.
   * @param options Additional options.
   * @returns The starter pack view.
   */
  async about(options?: AppBskyGraphGetStarterPack.CallOptions) {
    const res = await this.instance.graph.getStarterPack(
      {
        starterPack: this.uri,
      },
      options,
    )

    return res.data
  }

  /**
   * Search for starter packs.
   * @param instance The instance of the `AppBskyNS` class.
   * @param query The search query.
   * @param limit The maximum number of items to return per page.
   * @param options Additional options.
   * @returns The starter pack search paginator.
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
      )

      return res.data
    })
  }

  /**
   * Get views for a list of starter packs.
   * @param instance The instance of the `AppBskyNS` class.
   * @param starterpacks The atproto identifiers of the starter packs.
   * @param options Additional options.
   * @returns The starter pack views.
   */
  static async getMany(
    instance: AppBskyNS,
    starterpacks: string[],
    options?: AppBskyGraphGetStarterPacks.CallOptions,
  ) {
    const res = await instance.graph.getStarterPacks(
      { uris: starterpacks },
      options,
    )

    return res.data
  }
}
