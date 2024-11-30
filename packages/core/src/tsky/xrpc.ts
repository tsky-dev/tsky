import type { SessionManager } from './session';

export class XrpcClient {
  session: SessionManager;

  constructor(session: SessionManager) {
    this.session = session;
  }

  async request<T>(
    nsid: string,
    method = 'GET',
    params?: Record<string, string>,
  ): Promise<{
    data: T;
    headers: Record<string, string>;
  }> {
    const searchParams = new URLSearchParams(params);

    const response = await this.session.fetch(
      `/xrpc/${nsid}?${searchParams.toString()}`,
      {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (response.status === 200) {
      const data = response.headers
        .get('Content-Type')
        ?.includes('application/json')
        ? await response.json()
        : await response.text();
      return {
        data,
        headers: Object.fromEntries(response.headers.entries()),
      };
    }

    console.error(response, await response.text());
    throw new Error('Request failed');
  }
}
