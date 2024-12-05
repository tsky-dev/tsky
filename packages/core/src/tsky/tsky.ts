import type { FetchHandler } from '@atcute/client';
import type { AppBskyActorDefs, Queries } from '@tsky/lexicons';
import { Feed } from '~/bsky';
import { Client } from './client';

export class Tsky {
  client: Client<Queries>;

  constructor(handler: FetchHandler) {
    this.client = new Client(handler);
  }

  /**
   * Get detailed profile view of an actor. Does not require auth, but contains relevant metadata with auth.
   */
  async profile(
    identifier: string,
  ): Promise<AppBskyActorDefs.ProfileViewDetailed> {
    const res = await this.client.get('app.bsky.actor.getProfile', {
      params: { actor: identifier },
    });

    return res.data;
  }

  get feed() {
    return new Feed(this.client);
  }
}
