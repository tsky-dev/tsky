import type {
  RefVariantSchema,
  UserTypeSchema,
  XrpcParametersSchema,
} from '../schema.js';
import { getDescriptions } from '../../utils/docs.js';
import {
  resolveObjectType,
  resolveRefType,
  resolveUnionType,
} from './complex.js';
import { resolveIntegerType } from './numeric.js';
import { resolvePrimitiveType } from './primitives.js';
import { resolveStringType } from './string.js';

export function resolveType(
  nsid: string,
  def: UserTypeSchema | RefVariantSchema | XrpcParametersSchema,
): { value: string; descriptions: string[] } {
  if (!def?.type) {
    throw new Error(`Invalid schema definition for ${nsid}`);
  }

  let descs = getDescriptions(def);
  let val: string;

  switch (def.type) {
    case 'unknown':
    case 'cid-link':
    case 'blob':
    case 'bytes':
      val = resolvePrimitiveType(def.type);
      break;
    case 'integer':
      val = resolveIntegerType(def, descs);
      break;
    case 'boolean':
      val = 'boolean';
      if (def.default !== undefined) {
        descs.push(`@default ${def.default}`);
      }
      break;
    case 'string':
      val = resolveStringType(def, nsid, descs);
      break;
    case 'array': {
      const { value, descriptions } = resolveType(`${nsid}/0`, def.items);
      if (def.minLength !== undefined) {
        descs.push(`Minimum array length: ${def.minLength}`);
      }
      if (def.maxLength !== undefined) {
        descs.push(`Maximum array length: ${def.maxLength}`);
      }
      val = `(${value})[]`;
      descs = descs.concat(descriptions);
      break;
    }
    case 'ref':
      val = resolveRefType(def);
      break;
    case 'union':
      val = resolveUnionType(def);
      break;
    case 'object':
    case 'params': {
      const result = resolveObjectType(def, def.type, nsid);
      val = result.value;
      descs = descs.concat(result.descriptions);
      break;
    }
    case 'subscription': {
      const output: { value: string; descriptions: string[] }[] = [];
      if (def.parameters) {
        output.push(resolveObjectType(def.parameters, 'params', nsid));
      }
      if (def.message?.schema) {
        output.push(resolveType(nsid, def.message.schema));
      }
      if (def.errors) {
        output.push({
          value: `interface Errors {${def.errors
            .map(error => `${error.name}: {};`)
            .join('')}}`,
          descriptions: [],
        });
      }

      val = output.map(o => o.value).join('\n');
      descs = descs.concat(output.flatMap(o => o.descriptions));
      break;
    }
    default:
      // eslint-disable-next-line no-console
      console.log(`${nsid}: unknown type ${def.type}`);
      val = 'unknown';
  }

  return { value: val, descriptions: descs };
}
