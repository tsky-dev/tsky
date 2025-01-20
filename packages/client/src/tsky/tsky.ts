import { XRPC } from '@atcute/client';
import type { Queries } from '@tsky/lexicons';
import { Auth } from '~/auth';
import { Bsky } from '~/feed';
import { Client } from './client';

export class Tsky {
  auth: Auth;
  client: Client<Queries>;

  constructor() {
    this.auth = new Auth();
    const xrpc = new XRPC({ handler: this.auth.manager });
    this.client = new Client(xrpc);
  }

  get bsky() {
    return new Bsky(this.client);
  }
}
