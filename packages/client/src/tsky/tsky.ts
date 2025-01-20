import type { CredentialManager } from '@atcute/client';
import { XRPC } from '@atcute/client';
import type { Queries } from '@tsky/lexicons';
import { Bsky } from '~/feed';
import { Client } from './client';

export class Tsky {
  client: Client<Queries>;

  constructor(manager: CredentialManager) {
    const xrpc = new XRPC({ handler: manager });
    this.client = new Client(xrpc);
  }

  get bsky() {
    return new Bsky(this.client);
  }
}
