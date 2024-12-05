import {
  isRecord,
  type Procedures,
  type Queries,
  type Records,
} from './lib/lexicons.js';

export * from './lib/lexicons.js';

// --- Core utility types ---
export type LexiconUnion<T> = T[keyof T];
export type NSIDOf<T> = T extends { $type: infer U extends string } ? U : never;

// --- NSID Patterns ---
export const APP_BSKY_PREFIX = 'app.bsky.' as const;
export const COM_ATPROTO_PREFIX = 'com.atproto.' as const;

export type BskyNSID = `${typeof APP_BSKY_PREFIX}${string}`;
export type AtProtoNSID = `${typeof COM_ATPROTO_PREFIX}${string}`;
export type KnownNSID = BskyNSID | AtProtoNSID;

// --- Record Types ---
export type RecordDefs = LexiconUnion<Records>;
export type BskyRecord = Extract<RecordDefs, { $type: BskyNSID }>;
export type AtProtoRecord = Extract<RecordDefs, { $type: AtProtoNSID }>;

// --- Query Types ---
export type QueryDefs = LexiconUnion<Queries>;
export type BskyQuery = {
  [K in keyof Queries]: K extends BskyNSID ? Queries[K] : never;
}[keyof Queries];

export type QueryParams<T extends keyof Queries> = Queries[T] extends {
  params: infer P;
}
  ? P
  : never;

export type QueryOutput<T extends keyof Queries> = Queries[T]['output'];

export type QueryErrors<T extends keyof Queries> = Queries[T] extends {
  errors: infer E;
}
  ? E
  : never;

// --- Procedure Types ---
export type ProcedureDefs = LexiconUnion<Procedures>;
export type BskyProcedure = {
  [K in keyof Procedures]: K extends BskyNSID ? Procedures[K] : never;
}[keyof Procedures];

export type ProcedureParams<T extends keyof Procedures> =
  Procedures[T] extends {
    params: infer P;
  }
    ? P
    : never;

export type ProcedureInput<T extends keyof Procedures> = Procedures[T] extends {
  input: infer I;
}
  ? I
  : never;

export type ProcedureOutput<T extends keyof Procedures> =
  Procedures[T] extends {
    output: infer O;
  }
    ? O
    : never;

export type ProcedureErrors<T extends keyof Procedures> =
  Procedures[T] extends {
    errors: infer E;
  }
    ? E
    : never;

// --- Common Bluesky Types ---
export type BskyPost = Extract<
  BskyRecord,
  { $type: `${typeof APP_BSKY_PREFIX}feed.post` }
>;
export type BskyProfile = Extract<
  BskyRecord,
  { $type: `${typeof APP_BSKY_PREFIX}actor.profile` }
>;
export type BskyLike = Extract<
  BskyRecord,
  { $type: `${typeof APP_BSKY_PREFIX}feed.like` }
>;
export type BskyFollow = Extract<
  BskyRecord,
  { $type: `${typeof APP_BSKY_PREFIX}graph.follow` }
>;

// --- Type Guards ---
export function isBskyRecord(value: unknown): value is BskyRecord {
  return isRecord(value) && value.$type.startsWith(APP_BSKY_PREFIX);
}

export function isAtProtoRecord(value: unknown): value is AtProtoRecord {
  return isRecord(value) && value.$type.startsWith(COM_ATPROTO_PREFIX);
}

export function isBskyPost(value: unknown): value is BskyPost {
  return (
    isBskyRecord(value) && value.$type.startsWith(`${APP_BSKY_PREFIX}feed.post`)
  );
}

// --- Error Types and Guards ---
export interface BskyError {
  error: string;
  message: string;
  statusCode?: number;
}

export function isBskyError(value: unknown): value is BskyError {
  return (
    typeof value === 'object' &&
    value !== null &&
    'error' in value &&
    'message' in value &&
    typeof (value as BskyError).error === 'string' &&
    typeof (value as BskyError).message === 'string'
  );
}

// --- Helper Types ---
export type BskyQueryParams<T extends BskyNSID> = T extends keyof Queries
  ? QueryParams<T>
  : never;
export type BskyProcedureInput<T extends BskyNSID> = T extends keyof Procedures
  ? ProcedureInput<T>
  : never;
