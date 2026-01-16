import type {
  Client as AtcuteClient,
  CredentialManager,
  ProcedureRequestOptions,
  QueryRequestOptions,
  SuccessClientResponse,
} from '@atcute/client';
import { ok } from '@atcute/client';
import type { GenericUri as Uri } from '@atcute/lexicons';
import type { XRPCProcedures, XRPCQueries } from '@atcute/lexicons/ambient';
import { parseAtUri } from '~/utils';
import type { RPCOptions as GenericReqOptions, StrongRef } from './types';

const NO_SESSION_ERROR =
  'No session found. Please login to perform this action.';

export class Client<
  Q extends XRPCQueries = XRPCQueries,
  P extends XRPCProcedures = XRPCProcedures,
> {
  xrpc: AtcuteClient<Q, P>;
  credentials: CredentialManager;

  constructor(xrpc: AtcuteClient<Q, P>, credentials: CredentialManager) {
    this.xrpc = xrpc;
    this.credentials = credentials;
  }

  /**
   * Makes a query (GET) request
   * @param nsid Namespace ID of a query endpoint
   * @param options Options to include like parameters
   * @returns The response of the request
   */
  async get<K extends keyof Q>(
    nsid: K,
    options: QueryRequestOptions<Q[K]>,
  ): Promise<SuccessClientResponse<Q[K], QueryRequestOptions<Q[K]>>['data']> {
    return await ok(this.xrpc.get(nsid, options));
  }

  /**
   * Makes a procedure (POST) request
   * @param nsid Namespace ID of a procedure endpoint
   * @param options Options to include like input body or parameters
   * @returns The response of the request
   */
  async call<K extends keyof P>(
    nsid: K,
    options: ProcedureRequestOptions<P[K]>,
  ): Promise<
    SuccessClientResponse<P[K], ProcedureRequestOptions<P[K]>>['data']
  > {
    return await ok(this.xrpc.post(nsid, options));
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
    record: object,
    rkey?: string,
  ): Promise<StrongRef> {
    if (!this.credentials.session) throw new Error(NO_SESSION_ERROR);
    // @ts-expect-error: complex procedure input types
    const response = await this.call(nsid, {
      input: {
        collection: nsid,
        record: {
          $type: nsid,
          createdAt: new Date().toISOString(),
          ...record,
        },
        repo: this.credentials.session.did,
        ...(rkey ? { rkey } : {}),
      },
    });

    // @ts-expect-error: StrongRef compatibility
    return response;
  }

  /**
   * Put a record in place of an existing record.
   * @param nsid The collection's NSID.
   * @param record The record to put.
   * @param rkey The rkey to use.
   * @returns The record's AT URI and CID.
   */
  async putRecord<K extends keyof P>(
    nsid: K,
    record: object,
    rkey: string,
  ): Promise<StrongRef> {
    if (!this.credentials.session) throw new Error(NO_SESSION_ERROR);
    // @ts-expect-error: complex procedure input types
    const response = await this.call(nsid, {
      input: {
        collection: nsid,
        record: {
          $type: nsid,
          createdAt: new Date().toISOString(),
          ...record,
        },
        repo: this.credentials.session.did,
        rkey,
      },
    });
    // @ts-expect-error: StrongRef compatibility
    return response;
  }

  /**
   * Delete a record.
   * @param uri The record's AT URI.
   */
  async deleteRecord(uri: Uri, options: GenericReqOptions = {}): Promise<void> {
    const { host: repo, collection, rkey } = parseAtUri(uri);
    if (repo !== this.credentials.session?.did)
      throw new Error('Can only delete own record.');
    // @ts-expect-error: complex procedure input types
    await this.call(collection, {
      input: { collection, repo, rkey },
      ...options,
    });
  }
}
