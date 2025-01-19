import type { IntegerSchema } from '../schema.js';

export function resolveIntegerType(
  def: IntegerSchema,
  descs: string[],
): string {
  if (def.minimum !== undefined) {
    descs.push(`Minimum: ${def.minimum}`);
  }
  if (def.maximum !== undefined) {
    descs.push(`Maximum: ${def.maximum}`);
  }
  if (def.default !== undefined) {
    descs.push(`@default ${def.default}`);
  }
  return 'number';
}
