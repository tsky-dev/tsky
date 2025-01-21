import { Feed } from '~/bsky/feed';
import type { Client } from '~/tsky/client';

export class Bsky {
  constructor(private client: Client) {}

  get feed() {
    return new Feed(this.client);
  }
}
