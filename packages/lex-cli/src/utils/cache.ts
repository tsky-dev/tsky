export const toUpperCache: Record<string, string> = Object.create(
  null,
) as Record<string, string>;
export const toNamespaceCache: Record<string, string> = Object.create(
  null,
) as Record<string, string>;

export function toUpper(s: string) {
  if (s in toUpperCache) {
    return toUpperCache[s];
  }
  const value = s[0].toUpperCase() + s.slice(1);
  toUpperCache[s] = value;
  return value;
}

export function toNamespace(s: string) {
  if (s in toNamespaceCache) {
    return toNamespaceCache[s];
  }
  const value = s.replace(/^\w|\.\w/g, m =>
    m[m.length === 1 ? 0 : 1].toUpperCase());
  toNamespaceCache[s] = value;
  return value;
}
