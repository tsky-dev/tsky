import {
  type AtpSessionData,
  CredentialManager,
  type CredentialManagerOptions,
} from '@atcute/client';

export class Auth {
  manager: CredentialManager;
  sessions: Map<string, AtpSessionData> = new Map();

  constructor(options?: CredentialManagerOptions) {
    this.manager = new CredentialManager(
      options ?? { service: 'https://bsky.social' },
    );
  }

  async login(identifier: string, password: string) {
    const session = await this.manager.login({
      identifier,
      password,
    });

    this.sessions.set(session.did, session);

    return session;
  }

  async switch(did: string) {
    const session = this.sessions.get(did);

    if (!session) {
      throw new Error('Session not found');
    }

    return await this.manager.resume(session);
  }

  logout(did: string) {
    this.sessions.delete(did);
  }

  get currentSession() {
    return this.manager.session;
  }
}
