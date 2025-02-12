import type {
  CredentialManager,
  RPCOptions,
  XRPC,
  XRPCRequestOptions,
  XRPCResponse,
} from '@atcute/client';
import type { At, Procedures, Queries } from '@tsky/lexicons';
import { parseAtUri } from '~/utils';
import type { RPCOptions as GenericReqOptions, StrongRef } from '../types';

// From @atcute/client
type OutputOf<T> = T extends {
  output: unknown;
}
  ? T['output']
  : never;

const NO_SESSION_ERROR =
  'No session found. Please login to perform this action.';

export class Client<Q = Queries, P = Procedures> {
  xrpc: XRPC;
  crenditials: CredentialManager;

  constructor(xrpc: XRPC, crenditials: CredentialManager) {
    this.xrpc = xrpc;
    this.crenditials = crenditials;
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

  /**
   * Create a record.
   * @param nsid The collection's NSID.
   * @param record The record to create.
   * @param rkey The rkey to use.
   * @returns The record's AT URI and CID.
   */
  async createRecord<K extends keyof P>(
    nsid: K,
    record: Omit<RPCOptions<P[K]>, '$type' | 'createdAt'>,
    rkey?: string,
  ): Promise<StrongRef> {
    if (!this.crenditials.session) throw new Error(NO_SESSION_ERROR);
    const response = await this.call(
      'com.atproto.repo.createRecord' as keyof P,
      {
        data: {
          collection: nsid,
          record: {
            $type: nsid,
            createdAt: new Date().toISOString(),
            ...record,
          },
          repo: this.crenditials.session.did,
          ...(rkey ? { rkey } : {}),
        },
      } as unknown as RPCOptions<P[keyof P]>,
    );
    return response.data;
  }

  /**
   * Put a record in place of an existing record.
   * @param nsid The collection's NSID.
   * @param record The record to put.
   * @param rkey The rkey to use.
   * @returns The record's AT URI and CID.
   */
  async putRecord(
    nsid: string,
    record: object,
    rkey: string,
  ): Promise<StrongRef> {
    if (!this.crenditials.session) throw new Error(NO_SESSION_ERROR);
    const response = await this.call(
      'com.atproto.repo.putRecord' as keyof P,
      {
        data: {
          collection: nsid,
          record: {
            $type: nsid,
            createdAt: new Date().toISOString(),
            ...record,
          },
          repo: this.crenditials.session.did,
          rkey,
        },
      } as unknown as RPCOptions<P[keyof P]>,
    );
    return response.data;
  }

  /**
   * Delete a record.
   * @param uri The record's AT URI.
   */
  async deleteRecord(
    uri: At.Uri,
    options: GenericReqOptions = {},
  ): Promise<void> {
    const { host: repo, collection, rkey } = parseAtUri(uri);
    if (repo !== this.crenditials.session?.did)
      throw new Error('Can only delete own record.');
    await this.call(
      'com.atproto.repo.deleteRecord' as keyof P,
      {
        data: { collection, repo, rkey },
        ...options,
      } as unknown as RPCOptions<P[keyof P]>,
    );
  }
}
