const COLLATOR = new Intl.Collator('en-US');
export function sortName(a: string, b: string): number {
  return COLLATOR.compare(a, b);
}

export function sortPropertyKeys(
  keys: string[],
  required?: string[],
): string[] {
  return keys.sort((a, b) => {
    const aIsOptional = !required || !required.includes(a);
    const bIsOptional = !required || !required.includes(b);
    if (aIsOptional === bIsOptional) {
      return sortName(a, b);
    }
    return +aIsOptional - +bIsOptional;
  });
}

export function sortDefinition(a: string, b: string) {
  const aIsMain = a === 'main';
  const bIsMain = b === 'main';

  if (aIsMain === bIsMain) {
    return sortName(a, b);
  }
  return +bIsMain - +aIsMain;
}
