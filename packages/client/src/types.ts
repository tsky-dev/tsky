import type { AtpSessionData } from '@atcute/client';

export type CreateAgentOptions =
  | {
      identifier: string;
      password: string;
    }
  | {
      session: AtpSessionData;
    };

export type RPCOptions = { signal?: AbortSignal; headers?: HeadersInit };

/**
 * A reference to a record.
 */
export interface StrongRef {
  /** The record's AT URI. */
  uri: string;

  /** The record's CID. */
  cid: string;
}
