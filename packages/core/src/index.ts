import type {
  AppBskyActorDefs,
  AppBskyActorGetProfile,
  AppBskyActorGetProfiles,
  AppBskyActorSearchActors,
  AppBskyActorSearchActorsTypeahead,
  AppBskyNS,
} from '@atproto/api'
import { Paginator } from './paginate'

export class TSky {
  /**
   * Creates a new instance of the TSky class.
   * @param instance The instance of the `AppBskyNS` class.
   */
  constructor(private instance: AppBskyNS) {}

  /**
   * Get detailed profile view of an actor. Does not require auth, but contains relevant metadata with auth.
   * @param identifier The atproto identifier of the actor.
   * @param options Additional options.
   * @returns The detailed profile view of the actor.
   */
  profile(
    identifier: string,
    options?: AppBskyActorGetProfile.CallOptions
  ): Promise<AppBskyActorDefs.ProfileViewDetailed>
  /**
   * Get detailed profile views of multiple actors.
   * @param identifiers The atproto identifiers of the actors.
   * @param options Additional options.
   */
  profile(
    identifiers: string[],
    options?: AppBskyActorGetProfiles.CallOptions
  ): Promise<AppBskyActorDefs.ProfileViewDetailed[]>

  /**
   * Get detailed profile view of an actor. Does not require auth, but contains relevant metadata with auth.
   * @param identifier The atproto identifier or identifiers of the actor/s.
   * @param options Additional options.
   * @returns The detailed profile view of the actor/s.
   */
  async profile(
    identifier: string | string[],
    options?:
      | AppBskyActorGetProfile.CallOptions
      | AppBskyActorGetProfiles.CallOptions,
  ) {
    if (Array.isArray(identifier)) {
      const res = await this.instance.actor.getProfiles(
        { actors: identifier },
        options,
      )

      return res.data.profiles
    }

    const res = await this.instance.actor.getProfile(
      { actor: identifier[0] },
      options,
    )

    return res.data
  }

  /**
   * Find actor suggestions for a prefix search term. Expected use is for auto-completion during text field entry. Does not require auth.
   * @param params The query parameters.
   * @param options Additional options.
   * @returns The actor suggestions.
   */
  async typeahead(
    params: AppBskyActorSearchActorsTypeahead.QueryParams,
    options?: AppBskyActorSearchActorsTypeahead.CallOptions,
  ) {
    const res = await this.instance.actor.searchActorsTypeahead(
      params,
      options,
    )

    return res.data.actors
  }

  /**
   * Find actors (profiles) matching search criteria. Does not require auth.
   * @param params The query parameters.
   * @param options Additional options.
   * @returns The paginator for the search results.
   */
  async search(
    params: AppBskyActorSearchActors.QueryParams = {},
    options?: AppBskyActorSearchActors.CallOptions,
  ) {
    return new Paginator(async (cursor) => {
      const res = await this.instance.actor.searchActors(
        {
          cursor,
          ...params,
        },
        options,
      )

      return res.data
    })
  }
}
