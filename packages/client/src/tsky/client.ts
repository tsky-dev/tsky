import {
  type FetchHandler,
  type RPCOptions,
  XRPC,
  type XRPCRequestOptions,
  type XRPCResponse,
} from '@atcute/client';
import type { Procedures, Queries } from '@tsky/lexicons';

// From @atcute/client
type OutputOf<T> = T extends {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  output: any;
}
  ? T['output']
  : never;

export class Client<Q = Queries, P = Procedures> {
  xrpc: XRPC;

  constructor(handler: FetchHandler) {
    this.xrpc = new XRPC({ handler });
  }

  /**
   * Makes a query (GET) request
   * @param nsid Namespace ID of a query endpoint
   * @param options Options to include like parameters
   * @returns The response of the request
   */
  async get<K extends keyof Q>(
    nsid: K,
    options: RPCOptions<Q[K]>,
  ): Promise<XRPCResponse<OutputOf<Q[K]>>> {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    return this.xrpc.get(nsid as any, options);
  }

  /**
   * Makes a procedure (POST) request
   * @param nsid Namespace ID of a procedure endpoint
   * @param options Options to include like input body or parameters
   * @returns The response of the request
   */
  async call<K extends keyof P>(
    nsid: K,
    options: RPCOptions<P[K]>,
  ): Promise<XRPCResponse<OutputOf<P[K]>>> {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    return this.xrpc.call(nsid as any, options);
  }

  /** Makes a request to the XRPC service */
  async request(options: XRPCRequestOptions): Promise<XRPCResponse> {
    return this.xrpc.request(options);
  }
}
