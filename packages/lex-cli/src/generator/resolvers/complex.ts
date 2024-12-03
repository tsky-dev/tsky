import type {
  ObjectSchema,
  RefSchema,
  RefUnionSchema,
  XrpcParametersSchema,
} from '../schema.js';
import { toNamespace, toUpper } from '../../utils/cache.js';
import { writeJsdoc } from '../../utils/docs.js';
import { sortName, sortPropertyKeys } from '../../utils/sort.js';
import { resolveType } from './type.js';

export function resolveRefType(def: RefSchema): string {
  const [ns, ref] = def.ref.split('#');
  return (ns ? `${toNamespace(ns)}.` : '') + (ref ? toUpper(ref) : 'Main');
}

export function resolveUnionType(def: RefUnionSchema): string {
  const refs = def.refs.toSorted(sortName).map((raw) => {
    const [ns, ref] = raw.split('#');
    return (ns ? `${toNamespace(ns)}.` : '') + (ref ? toUpper(ref) : 'Main');
  });
  return `Brand.Union<${refs.join('|')}>`;
}

export function resolveObjectType(
  def: ObjectSchema | XrpcParametersSchema,
  type: 'object' | 'params',
  nsid: string,
): { value: string; descriptions: string[] } {
  const required = def.required;
  const nullable = type === 'object' && 'nullable' in def ? def.nullable : [];
  const properties = def.properties;

  const propKeys = sortPropertyKeys(Object.keys(properties), required);
  let chunk = '{';

  for (const prop of propKeys) {
    const isOptional = !required || !required.includes(prop);
    const isNullable = nullable?.includes(prop);
    const { value, descriptions } = resolveType(
      `${nsid}/${prop}`,
      properties[prop],
    );

    chunk += writeJsdoc(descriptions);
    chunk += `${prop}${isOptional ? '?' : ''}:${value}${isNullable ? '| null' : ''};`;
  }

  chunk += '}';
  return { value: chunk, descriptions: [] };
}
