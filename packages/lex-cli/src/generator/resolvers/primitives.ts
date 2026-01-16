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
    case 'permission':
      return 'At.Permission';
    case 'permission-set':
      return 'At.PermissionSet';
    default:
      return 'unknown';
  }
}
