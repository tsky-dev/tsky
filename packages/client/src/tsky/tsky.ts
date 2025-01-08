import type { XRPC } from '@atcute/client';
import type { Queries } from '@tsky/lexicons';
import { Bsky } from '~/bsky';
import { Client } from './client';

export class Tsky {
  client: Client<Queries>;

  constructor(xrpc: XRPC) {
    this.client = new Client(xrpc);
  }

  get bsky() {
    return new Bsky(this.client);
  }
}
