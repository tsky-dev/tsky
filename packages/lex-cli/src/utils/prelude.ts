export const mainPrelude = `type ObjectOmit<T, K extends keyof any> = Omit<T, K>;

/** Handles type branding in objects */
export declare namespace Brand {
  /** Symbol used to brand objects, this does not actually exist in runtime */
  const Type: unique symbol;

  /** Get the intended \`$type\` field */
  type GetType<T extends { [Type]?: string }> = NonNullable<T[typeof Type]>;

  /** Creates a union of objects where it's discriminated by \`$type\` field. */
  type Union<T extends { [Type]?: string }> = T extends any ? T & { $type: GetType<T> } : never;

  /** Omits the type branding from object */
  type Omit<T extends { [Type]?: string }> = ObjectOmit<T, typeof Type>;
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
  interface Blob<T extends string = string> {
    $type: 'blob';
    mimeType: T;
    ref: {
      $link: string;
    };
    size: number;
  }
}`;
