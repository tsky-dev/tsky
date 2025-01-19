import type { StringSchema } from '../schema.js';
import { IGNORED_FORMATS, TYPE_FORMATS, sortName } from '../../utils/index.js';

export function resolveStringFormat(format: string, nsid: string): string {
  if (format === 'did') return TYPE_FORMATS.DID;
  if (format === 'cid') return TYPE_FORMATS.CID;
  if (format === 'handle') return TYPE_FORMATS.HANDLE;
  if (format === 'at-uri') return TYPE_FORMATS.URI;
  if (IGNORED_FORMATS.has(format)) return 'string';

  console.warn(`${nsid}: unknown format ${format}`);
  return 'string';
}

export function resolveStringType(
  def: StringSchema,
  nsid: string,
  descs: string[],
): string {
  const { format, enum: enums, knownValues: known } = def;

  if (format !== undefined) {
    return resolveStringFormat(format, nsid);
  }

  if (def.minLength !== undefined) {
    descs.push(`Minimum string length: ${def.minLength}`);
  }
  if (def.maxLength !== undefined) {
    descs.push(`Maximum string length: ${def.maxLength}`);
  }
  if (def.maxGraphemes !== undefined) {
    descs.push(`Maximum grapheme length: ${def.maxGraphemes}`);
  }
  if (def.default !== undefined) {
    descs.push(`@default ${JSON.stringify(def.default)}`);
  }

  if (enums) {
    return enums.map((val: string) => JSON.stringify(val)).join('|');
  }
  if (known) {
    return `${known
      .toSorted(sortName)
      .map((val: string) => JSON.stringify(val))
      .join('|')} | (string & {})`;
  }
  return 'string';
}
