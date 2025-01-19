export const TYPE_FORMATS = {
  DID: 'At.DID',
  CID: 'At.CID',
  HANDLE: 'At.Handle',
  URI: 'At.Uri',
} as const;

export const IGNORED_FORMATS = new Set([
  'at-identifier',
  'datetime',
  'language',
  'nsid',
  'uri',
]);
