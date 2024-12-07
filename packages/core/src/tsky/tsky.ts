import type { FetchHandler } from '@atcute/client';
import type { Queries } from '@tsky/lexicons';
import { Bsky } from '~/bsky';
import { Client } from './client';

export class Tsky {
  client: Client<Queries>;

  constructor(handler: FetchHandler) {
    this.client = new Client(handler);
  }

  get bsky() {
    return new Bsky(this.client);
  }
}
