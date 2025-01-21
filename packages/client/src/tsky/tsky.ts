import { XRPC } from '@atcute/client';
import type { Queries } from '@tsky/lexicons';
import { Auth } from '~/auth';
import { Bsky } from '~/bsky';
import { User } from '~/user';
import { Client } from './client';

export class Tsky {
  auth: Auth;
  private client: Client<Queries>;

  constructor() {
    // Initialize the auth manager
    this.auth = new Auth();

    // Initialize the client
    const xrpc = new XRPC({ handler: this.auth.manager });
    this.client = new Client(xrpc);
  }

  get user() {
    return new User(this.client);
  }

  get bsky() {
    return new Bsky(this.client);
  }
}
