import type { AppBskyActorDefs } from '@tsky/lexicons';
import type { Client } from '~/tsky/client';
import { Preferences } from './preferences';

export class User {
  constructor(
    private client: Client,
    private identifier: string,
  ) {}

  /**
   * Get detailed profile view of the current user.
   */
  async profile(): Promise<AppBskyActorDefs.ProfileViewDetailed> {
    const res = await this.client.get('app.bsky.actor.getProfile', {
      params: { actor: this.identifier },
    });

    return res.data;
  }

  get preferences() {
    return new Preferences(this.client);
  }
}
