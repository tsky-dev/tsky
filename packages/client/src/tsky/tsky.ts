import { XRPC } from '@atcute/client';
import type { Queries } from '@tsky/lexicons';
import { Auth } from '~/auth';
import { Bsky } from '~/bsky';
import { StarterPack } from '~/starterpack';
import { User } from '~/user';
import { Video } from '~/video';
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
    if (!this.auth.currentSession) {
      throw new Error('There is no active session');
    }

    return new User(this.client, this.auth.currentSession.handle);
  }

  get bsky() {
    return new Bsky(this.client);
  }

  get video() {
    if (!this.auth.currentSession) {
      throw new Error('There is no active session');
    }

    return new Video(this.client);
  }

  get starterpack() {
    return new StarterPack(this.client);
  }
}
