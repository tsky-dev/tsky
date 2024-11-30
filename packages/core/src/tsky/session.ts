export interface Session {
  fetchHandler: (pathname: string, init?: RequestInit) => Promise<Response>;
}


function isTokenExpired(response: Response) {
  if (response.status !== 400) return false

  const contentLength = Number(response.headers.get('content-length') ?? '0');

  // FROM: https://github.com/mary-ext/atcute/blob/3fcf7f990d494049f87d07e940fcc6550b7fbc67/packages/core/client/lib/credential-manager.ts#L293
  // {"error":"ExpiredToken","message":"Token has expired"}
	// {"error":"ExpiredToken","message":"Token is expired"}
	if (contentLength > 54 * 1.5) {
		return false;
	}

  return response.clone().json().then((json) => {
    if (json.error === 'ExpiredToken') {
      return true;
    }

    return false;
  }).catch(() => false);
}

export class PasswordSession implements Session {
  token?: string;
  identifier?: string;
  password?: string;

  constructor(private _baseUrl: string) {
    this.token = process.env.TOKEN; // TODO: remove this hack
  }

  private get baseUrl() {
    return this._baseUrl; // TODO: support session-based URLs
  }

  async login(identifier: string, password: string) {
    // TODO: implement login
  }

  private async refresh(force = false) {
    console.log('Refreshing token', { force });
  }

  async fetchHandler(endpoint: string, init?: RequestInit) {
    await this.refresh();

    const url = new URL(endpoint, this.baseUrl);
    const headers = new Headers(init?.headers);

    if (!headers.has('authorization')) {
      headers.set('authorization', `Bearer ${this.token}`);
    }

    const response = await fetch(url, {
      ...init,
      headers,
    });

    if (!isTokenExpired(response)) {
      return response;
    }

    try {
      await this.refresh(true);
    } catch (e) {
      return response;
    }

    // if the body is a stream, we can't retry
    if (ReadableStream && init?.body instanceof ReadableStream) {
      return response
    }

    // try again with the new token
    headers.set('authorization', `Bearer ${this.token}`);
    return fetch(url, {
      ...init,
      headers,
    });
  }
}
