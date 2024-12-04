export const mainPrelude = `/** Base type with optional type field */
export interface TypedBase {
  $type?: string;
}

/** Base type for all record types */
export interface RecordBase {
  $type: string;
}

/** Makes $type required and specific */
export type Typed<T extends TypedBase, Type extends string> = Omit<T, '$type'> & {
  $type: Type;
};

/** Creates a union of objects discriminated by $type */
export type TypeUnion<T extends TypedBase> = T extends any ? Typed<T, string> : never;

/** Type guard for records */
export function isRecord(value: unknown): value is RecordBase {
  return typeof value === 'object' && value !== null && '$type' in value && typeof value.$type === 'string';
}

/** Base AT Protocol schema types */
export declare namespace At {
  /** CID string */
  type CID = string;

  /** DID of a user */
  type DID = \`did:\${string}\`;

  /** User handle */
  type Handle = string;

  /** URI string */
  type Uri = string;

  /** Object containing a CID string */
  interface CIDLink {
    $link: CID;
  }

  /** Object containing a base64-encoded bytes */
  interface Bytes {
    $bytes: string;
  }

  /** Blob interface */
  interface Blob<T extends string = string> extends RecordBase {
    $type: 'blob';
    mimeType: T;
    ref: {
      $link: string;
    };
    size: number;
  }
}`;
