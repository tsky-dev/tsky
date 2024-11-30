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

    return new XrpcError(response.status, response.statusText);
  }
}

function dropEmptyValues<T extends Record<string, string>>(obj: T): T {
  const _obj = { ...obj };
  for (const key of Object.keys(_obj)) {
    if (_obj[key] === undefined) {
      delete _obj[key];
    }
  }
  return _obj;
}

export class XrpcClient {
  session: Session;

  constructor(session: Session) {
    this.session = session;
  }

  async request<P = Record<string, string>, R = unknown>(
    nsid: string,
    method: 'GET' | 'POST' = 'GET',
    params?: P,
  ): Promise<{
    data: R;
    headers: Record<string, string>;
  }> {
    const searchParams = new URLSearchParams(dropEmptyValues(params ?? {}));

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
