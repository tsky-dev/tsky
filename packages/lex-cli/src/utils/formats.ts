export const TYPE_FORMATS = {
  DID: 'At.DID',
  CID: 'At.CID',
  HANDLE: 'At.Handle',
  URI: 'At.Uri',
  TID: 'At.TID',
  RKEY: 'At.RKEY',
} as const;

export const IGNORED_FORMATS = new Set([
  'at-identifier',
  'datetime',
  'language',
  'nsid',
  'uri',
]);
