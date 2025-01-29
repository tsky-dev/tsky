import type { AtpSessionData } from '@atcute/client';

export type CreateAgentOptions =
  | {
      identifier: string;
      password: string;
    }
  | {
      session: AtpSessionData;
    };
