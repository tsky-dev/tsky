import type { Session } from './session';

async function getResponseJSONData<T>(
  response: Response,
  fail?: true,
): Promise<T>;
async function getResponseJSONData<T>(
  response: Response,
  fail: false,
): Promise<T | null>;
async function getResponseJSONData<T>(
  response: Response,
  fail = true,
): Promise<T | null> {
  if (response.headers.get('Content-Type')?.includes('application/json')) {
    return response.json();
  }

  if (fail) {
    throw new Error('Response is not JSON');
  }

  return null;
}

async function getResponseContent(response: Response): Promise<unknown> {
  const json = await getResponseJSONData(response);
  if (json) {
    return json;
  }

  return response.text();
}

export class XrpcError extends Error {
  statusCode: number;

  constructor(statusCode: number, error?: string, message?: string) {
    super(message || error);
    this.statusCode = statusCode;
  }

  static async fromResponse(response: Response): Promise<XrpcError> {
    const data = await getResponseJSONData<{
      error?: string;
      message?: string;
    }>(response, false);
    if (data) {
      return new XrpcError(response.status, data.error, data.message);
    }

    return new XrpcError(
      response.status,
      response.statusText,
      response.statusText,
    );
  }
}

export class XrpcClient {
  session: Session;

  constructor(session: Session) {
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

    const response = await this.session.fetchHandler(
      `/xrpc/${nsid}?${searchParams.toString()}`,
      {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (response.status >= 200 && response.status < 300) {
      const data = await getResponseContent(response);
      return {
        data: data as T,
        headers: Object.fromEntries(response.headers.entries()),
      };
    }

    throw await XrpcError.fromResponse(response);
  }
}
