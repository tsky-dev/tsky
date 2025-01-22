import { Feed } from '~/bsky/feed';
import type { Client } from '~/tsky/client';
import { Actor } from './actor';
import { List } from './list';

export class Bsky {
  constructor(private client: Client) {}

  actor(identifier: string) {
    return new Actor(this.client, identifier);
  }

  list(uri: string) {
    return new List(this.client, uri);
  }

  get feed() {
    return new Feed(this.client);
  }
}
