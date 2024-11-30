interface Session {
  token: string;
}

export class SessionManager {
  token?: string;

  constructor(private _baseUrl: string) {
    this.token = process.env.TOKEN; // TODO: remove this hack
  }

  private get baseUrl() {
    return this._baseUrl; // TODO: support session-based URLs
  }

  async login(identifier: string, password: string) {
    // TODO: implement login
  }

  async loadSession(session: Session) {
    this.token = session.token;
  }

  private async refreshSessionIfNecessary() {
    // Check if the token is expired
    // If it is, refresh it
    // If it's not, do nothing
  }

  async fetch(endpoint: string, options: RequestInit) {
    await this.refreshSessionIfNecessary();

    const url = new URL(endpoint, this.baseUrl);
    const headers = new Headers(options.headers);

    if (!headers.has('authorization')) {
      headers.set('authorization', `Bearer ${this.token}`);
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // TODO: check expired token

    return response;
  }
}
