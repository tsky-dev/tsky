export function resolvePrimitiveType(type: string): string {
  switch (type) {
    case 'unknown':
      return 'unknown';
    case 'cid-link':
      return 'At.CIDLink';
    case 'bytes':
      return 'At.Bytes';
    case 'blob':
      return 'At.Blob';
    default:
      return 'unknown';
  }
}
