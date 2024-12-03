import * as t from 'typanion';

const isPositiveInteger = t.cascade(t.isNumber(), (value): value is number => {
  return Number.isInteger(value) && value >= 0;
});

export const booleanSchema = t.isObject({
  type: t.isLiteral('boolean'),
  description: t.isOptional(t.isString()),
  default: t.isOptional(t.isBoolean()),
  const: t.isOptional(t.isBoolean()),
});

export type BooleanSchema = t.InferType<typeof booleanSchema>;

export const integerSchema = t.isObject({
  type: t.isLiteral('integer'),
  description: t.isOptional(t.isString()),
  default: t.isOptional(isPositiveInteger),
  const: t.isOptional(isPositiveInteger),
  enum: t.isOptional(t.isArray(t.isNumber())),
  maximum: t.isOptional(isPositiveInteger),
  minimum: t.isOptional(isPositiveInteger),
});

export type IntegerSchema = t.InferType<typeof integerSchema>;

const stringFormatSchema = t.isOneOf([
  t.isLiteral('at-identifier'),
  t.isLiteral('at-uri'),
  t.isLiteral('cid'),
  t.isLiteral('datetime'),
  t.isLiteral('did'),
  t.isLiteral('handle'),
  t.isLiteral('language'),
  t.isLiteral('nsid'),
  t.isLiteral('record-key'),
  t.isLiteral('tid'),
  t.isLiteral('uri'),
]);

export const stringSchema: t.StrictValidator<
  unknown,
  {
    type: 'string';
    description?: string;
    format?: string;
    default?: string;
    const?: string;
    enum?: string[];
    knownValues?: string[];
    maxLength?: number;
    minLength?: number;
    maxGraphemes?: number;
    minGraphemes?: number;
  }
> = t.cascade(
  t.isObject({
    type: t.isLiteral('string'),
    description: t.isOptional(t.isString()),
    format: t.isOptional(stringFormatSchema),
    default: t.isOptional(t.isString()),
    const: t.isOptional(t.isString()),
    enum: t.isOptional(t.isArray(t.isString())),
    knownValues: t.isOptional(t.isArray(t.isString())),
    maxLength: t.isOptional(isPositiveInteger),
    minLength: t.isOptional(isPositiveInteger),
    maxGraphemes: t.isOptional(isPositiveInteger),
    minGraphemes: t.isOptional(isPositiveInteger),
  }),
  (
    value,
  ): value is {
    type: 'string';
    description?: string;
    format?:
      | 'at-identifier'
      | 'at-uri'
      | 'cid'
      | 'datetime'
      | 'did'
      | 'handle'
      | 'language'
      | 'nsid'
      | 'record-key'
      | 'tid'
      | 'uri';
    default?: string;
    const?: string;
    enum?: string[];
    knownValues?: string[];
    maxLength?: number;
    minLength?: number;
    maxGraphemes?: number;
    minGraphemes?: number;
  } => {
    if (value.format !== undefined && value.format !== 'uri') {
      if (
        value.maxLength !== undefined
        || value.minLength !== undefined
        || value.maxGraphemes !== undefined
        || value.minGraphemes !== undefined
      ) {
        throw new Error(
          `${value.format} format can't be used with length or grapheme constraints`,
        );
      }
    }
    return true;
  },
);

export type StringSchema = t.InferType<typeof stringSchema>;

export const unknownSchema = t.isObject({
  type: t.isLiteral('unknown'),
  description: t.isOptional(t.isString()),
});

export type UnknownSchema = t.InferType<typeof unknownSchema>;

export const primitiveSchema = t.isOneOf([
  booleanSchema,
  integerSchema,
  stringSchema,
  unknownSchema,
]);

export type PrimitiveSchema = t.InferType<typeof primitiveSchema>;

export const bytesSchema = t.isObject({
  type: t.isLiteral('bytes'),
  description: t.isOptional(t.isString()),
  maxLength: t.isOptional(isPositiveInteger),
  minLength: t.isOptional(isPositiveInteger),
});

export type BytesSchema = t.InferType<typeof bytesSchema>;

export const cidLinkSchema = t.isObject({
  type: t.isLiteral('cid-link'),
  description: t.isOptional(t.isString()),
});

export type CidLinkSchema = t.InferType<typeof cidLinkSchema>;

export const ipldTypeSchema = t.isOneOf([bytesSchema, cidLinkSchema]);

export type IpldTypeSchema = t.InferType<typeof ipldTypeSchema>;

export const refSchema = t.isObject({
  type: t.isLiteral('ref'),
  description: t.isOptional(t.isString()),
  ref: t.isString(),
});

export type RefSchema = t.InferType<typeof refSchema>;

export const refUnionSchema = t.cascade(
  t.isObject({
    type: t.isLiteral('union'),
    description: t.isOptional(t.isString()),
    refs: t.isArray(t.isString()),
    closed: t.isOptional(t.isBoolean()),
  }),
  (
    value,
  ): value is {
    type: 'union';
    description?: string;
    refs: string[];
    closed?: boolean;
  } => {
    if (value.closed && value.refs.length === 0) {
      throw new Error(`A closed union can't have empty refs list`);
    }
    return true;
  },
);

export type RefUnionSchema = t.InferType<typeof refUnionSchema>;

export const refVariantSchema = t.isOneOf([refSchema, refUnionSchema]);

export type RefVariantSchema = t.InferType<typeof refVariantSchema>;

export const blobSchema = t.isObject({
  type: t.isLiteral('blob'),
  description: t.isOptional(t.isString()),
  accept: t.isOptional(t.isArray(t.isString())),
  maxSize: t.isOptional(isPositiveInteger),
});

export type BlobSchema = t.InferType<typeof blobSchema>;

export const arraySchema = t.isObject({
  type: t.isLiteral('array'),
  description: t.isOptional(t.isString()),
  items: t.isOneOf([
    primitiveSchema,
    ipldTypeSchema,
    blobSchema,
    refVariantSchema,
  ]),
  maxLength: t.isOptional(isPositiveInteger),
  minLength: t.isOptional(isPositiveInteger),
});

export type ArraySchema = t.InferType<typeof arraySchema>;

export const primitiveArraySchema = t.cascade(
  arraySchema,
  (value): value is ArraySchema => {
    if (!t.isOneOf([primitiveSchema])(value.items)) {
      throw new Error('Array items must be primitive types');
    }
    return true;
  },
);

export type PrimitiveArraySchema = t.InferType<typeof primitiveArraySchema>;

export const tokenSchema = t.isObject({
  type: t.isLiteral('token'),
  description: t.isOptional(t.isString()),
});

export type TokenSchema = t.InferType<typeof tokenSchema>;

function refineRequiredProperties<
  T extends { required?: string[]; properties: Record<string, unknown> },
>(schema: t.StrictValidator<unknown, T>): t.StrictValidator<unknown, T> {
  interface RequiredPropertiesSchema {
    required?: string[];
    properties: Record<string, unknown>;
  }

  return t.cascade(
    schema,
    (value: RequiredPropertiesSchema): value is RequiredPropertiesSchema => {
      if (value.required) {
        for (const field of value.required) {
          if (value.properties[field] === undefined) {
            throw new Error(`Required field "${field}" not defined`);
          }
        }
      }
      return true;
    },
  );
}

export const objectSchema = refineRequiredProperties(
  t.isObject({
    type: t.isLiteral('object'),
    description: t.isOptional(t.isString()),
    required: t.isOptional(t.isArray(t.isString())),
    nullable: t.isOptional(t.isArray(t.isString())),
    properties: t.isRecord(
      t.isOneOf([
        refVariantSchema,
        ipldTypeSchema,
        arraySchema,
        blobSchema,
        primitiveSchema,
      ]),
    ),
  }),
);

export type ObjectSchema = t.InferType<typeof objectSchema>;

export const xrpcParametersSchema = refineRequiredProperties(
  t.isObject({
    type: t.isLiteral('params'),
    description: t.isOptional(t.isString()),
    required: t.isOptional(t.isArray(t.isString())),
    properties: t.isRecord(t.isOneOf([primitiveSchema, primitiveArraySchema])),
  }),
);

export type XrpcParametersSchema = t.InferType<typeof xrpcParametersSchema>;

export const xrpcBodySchema = t.isObject({
  description: t.isOptional(t.isString()),
  encoding: t.isString(),
  schema: t.isOptional(t.isOneOf([refVariantSchema, objectSchema])),
});

export type XrpcBodySchema = t.InferType<typeof xrpcBodySchema>;

export const xrpcSubscriptionMessageSchema = t.isObject({
  description: t.isOptional(t.isString()),
  schema: t.isOptional(t.isOneOf([refVariantSchema, objectSchema])),
});

export type XrpcSubscriptionMessageSchema = t.InferType<
  typeof xrpcSubscriptionMessageSchema
>;

export const xrpcErrorSchema = t.isObject({
  name: t.isString(),
  description: t.isOptional(t.isString()),
});

export type XrpcErrorSchema = t.InferType<typeof xrpcErrorSchema>;

export const xrpcQuerySchema = t.isObject({
  type: t.isLiteral('query'),
  description: t.isOptional(t.isString()),
  parameters: t.isOptional(xrpcParametersSchema),
  output: t.isOptional(xrpcBodySchema),
  errors: t.isOptional(t.isArray(xrpcErrorSchema)),
});

export type XrpcQuerySchema = t.InferType<typeof xrpcQuerySchema>;

export const xrpcProcedureSchema = t.isObject({
  type: t.isLiteral('procedure'),
  description: t.isOptional(t.isString()),
  parameters: t.isOptional(xrpcParametersSchema),
  input: t.isOptional(xrpcBodySchema),
  output: t.isOptional(xrpcBodySchema),
  errors: t.isOptional(t.isArray(xrpcErrorSchema)),
});

export type XrpcProcedureSchema = t.InferType<typeof xrpcProcedureSchema>;

export const xrpcSubscriptionSchema = t.isObject({
  type: t.isLiteral('subscription'),
  description: t.isOptional(t.isString()),
  parameters: t.isOptional(xrpcParametersSchema),
  message: t.isOptional(xrpcSubscriptionMessageSchema),
  errors: t.isOptional(t.isArray(xrpcErrorSchema)),
});

export type XrpcSubscriptionSchema = t.InferType<typeof xrpcSubscriptionSchema>;

export const recordSchema = t.isObject({
  type: t.isLiteral('record'),
  description: t.isOptional(t.isString()),
  key: t.isOptional(t.isString()),
  record: objectSchema,
});

export type RecordSchema = t.InferType<typeof objectSchema>;

export const userTypeSchema = t.isOneOf([
  recordSchema,
  xrpcQuerySchema,
  xrpcProcedureSchema,
  xrpcSubscriptionSchema,
  blobSchema,
  arraySchema,
  tokenSchema,
  objectSchema,
  booleanSchema,
  integerSchema,
  stringSchema,
  bytesSchema,
  cidLinkSchema,
  unknownSchema,
]);

export type UserTypeSchema = t.InferType<typeof userTypeSchema>;

const NSID_RE
  = /^[a-z](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+\.[a-z]{1,63}$/i;
const nsidType = t.cascade(t.isString(), value => NSID_RE.test(value));

export const documentSchema = t.cascade(
  t.isObject({
    lexicon: t.isLiteral(1),
    id: nsidType,
    revision: t.isOptional(t.isNumber()),
    description: t.isOptional(t.isString()),
    defs: t.isRecord(userTypeSchema),
  }),
  (
    value,
  ): value is {
    lexicon: 1;
    id: string;
    revision?: number;
    description?: string;
    defs: Record<string, UserTypeSchema>;
  } => {
    for (const id in value.defs) {
      const def = value.defs[id];
      const type = def.type;

      if (
        id !== 'main'
        && (type === 'record'
          || type === 'query'
          || type === 'procedure'
          || type === 'subscription')
      ) {
        throw new Error(
          `${type} must be the \`main\` definition (in defs.${id})`,
        );
      }
    }
    return true;
  },
);

export type DocumentSchema = t.InferType<typeof documentSchema>;
