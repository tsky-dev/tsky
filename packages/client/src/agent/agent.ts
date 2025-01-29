import { type CredentialManager, XRPC } from '@atcute/client';
import type { Queries } from '@tsky/lexicons';
import { Bsky } from '~/bsky';
import { StarterPack } from '~/starterpack';
import { User } from '~/user';
import { Video } from '~/video';
import { Client } from './client';

export class Agent {
  private client: Client<Queries>;

  constructor(private handler: CredentialManager) {
    // Initialize the client
    const xrpc = new XRPC({ handler: this.handler });
    this.client = new Client(xrpc);
  }

  get session() {
    return this.handler.session;
  }

  get user() {
    if (!this.session) {
      throw new Error('There is no active session');
    }

    return new User(this.client, this.session.handle);
  }

  get bsky() {
    return new Bsky(this.client);
  }

  get video() {
    if (!this.session) {
      throw new Error('There is no active session');
    }

    return new Video(this.client);
  }

  get starterpack() {
    return new StarterPack(this.client);
  }
}
