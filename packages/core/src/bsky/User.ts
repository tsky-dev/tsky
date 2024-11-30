import type { AppBskyGraphGetKnownFollowers, AppBskyGraphGetListBlocks, AppBskyGraphGetListMutes, AppBskyGraphGetMutes } from '@atproto/api'
import { Paginator } from '~/tsky/Paginator'
import { BaseActor } from './BaseActor'
import { Preferences } from './Preferences'
import { Suggestions } from './Suggestions'

export class User extends BaseActor {
  /**
   * Enumerates accounts which follow a specified account (actor) and are followed by the viewer.
   */
  knownFollowers(
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
