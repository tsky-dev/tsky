import type { AppBskyActorDefs } from '@tsky/lexicons';
import { Feed } from '~/bsky/feed';
import type { Client } from '~/tsky/client';

export class Bsky {
  client: Client;

  constructor(client: Client) {
    this.client = client;
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
