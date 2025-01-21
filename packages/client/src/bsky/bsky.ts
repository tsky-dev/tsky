import { Feed } from '~/bsky/feed';
import type { Client } from '~/tsky/client';
import { Actor } from './autor';

export class Bsky {
  constructor(private client: Client) {}

  actor(identifier: string) {
    return new Actor(this.client, identifier);
  }

  get feed() {
    return new Feed(this.client);
  }
}
