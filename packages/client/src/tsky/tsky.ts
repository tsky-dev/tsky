import { XRPC } from '@atcute/client';
import type { Queries } from '@tsky/lexicons';
import { Bsky } from '~/feed';
import { Manager } from '~/manager';
import { Client } from './client';

export class Tsky {
  auth: Manager;
  client: Client<Queries>;

  constructor() {
    this.auth = new Manager();
    const xrpc = new XRPC({ handler: this.auth.manager });
    this.client = new Client(xrpc);
  }

  get bsky() {
    return new Bsky(this.client);
  }
}
