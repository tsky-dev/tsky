import type {
  AppBskyActorDefs,
  AppBskyActorGetProfile,
  AppBskyActorGetProfiles,
  AppBskyActorSearchActors,
  AppBskyActorSearchActorsTypeahead,
  AppBskyNS,
} from '@atproto/api';
import { Paginator } from './paginator';

export class Tsky {
  constructor(private instance: AppBskyNS) {}

  /**
   * Get detailed profile view of an actor. Does not require auth, but contains relevant metadata with auth.
   */
  profile(
    identifier: string,
    options?: AppBskyActorGetProfile.CallOptions,
  ): Promise<AppBskyActorDefs.ProfileViewDetailed>;
  /**
   * Get detailed profile views of multiple actors.
   */
  profile(
    identifiers: string[],
    options?: AppBskyActorGetProfiles.CallOptions,
  ): Promise<AppBskyActorDefs.ProfileViewDetailed[]>;

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
      );

      return res.data.profiles;
    }

    const res = await this.instance.actor.getProfile(
      { actor: identifier[0] },
      options,
    );

    return res.data;
  }

  /**
   * Find actor suggestions for a prefix search term. Expected use is for auto-completion during text field entry. Does not require auth.
   */
  async typeahead(
    params: AppBskyActorSearchActorsTypeahead.QueryParams,
    options?: AppBskyActorSearchActorsTypeahead.CallOptions,
  ) {
    const res = await this.instance.actor.searchActorsTypeahead(
      params,
      options,
    );

    return res.data.actors;
  }

  /**
   * Find actors (profiles) matching search criteria. Does not require auth.
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
      );

      return res.data;
    });
  }
}
