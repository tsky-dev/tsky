import { type FetchHandler, XRPC } from '@atcute/client';
import { Feed } from '~/bsky';
import { Paginator } from './paginator';

export class Tsky {
  xrpc: XRPC;

  constructor(handler: FetchHandler) {
    this.xrpc = new XRPC({ handler });
  }

  /**
   * Get detailed profile view of an actor. Does not require auth, but contains relevant metadata with auth.
   */
  async profile(identifier: string) {
    const res = await this.xrpc.get('app.bsky.actor.getProfile', {
      actor: identifier,
    });

    return res.data;
  }

  get feed() {
    return new Feed(this.xrpc);
  }
}
