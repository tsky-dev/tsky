import type { Client } from '~/tsky/client';
import { Preferences } from './preferences';

export class User {
  constructor(private client: Client) {}

  get preferences() {
    return new Preferences(this.client);
  }
}
