[**video**](../index.md)

***

[tsky](../../index.md) / [video](../index.md) / Video

# Class: Video

## Constructors

### new Video()

> **new Video**(`instance`): [`Video`](Video.md)

#### Parameters

##### instance

`AppBskyNS`

#### Returns

[`Video`](Video.md)

#### Defined in

[video.ts:11](https://github.com/anbraten/tsky/blob/d41f31ef5ffd7e02d6eae90f23a8982db2e99629/packages/core/src/video.ts#L11)

## Methods

### limit()

> **limit**(`options`?): `Promise`\<`OutputSchema`\>

Get video upload limits for the authenticated user.

#### Parameters

##### options?

`CallOptions`

#### Returns

`Promise`\<`OutputSchema`\>

#### Defined in

[video.ts:16](https://github.com/anbraten/tsky/blob/d41f31ef5ffd7e02d6eae90f23a8982db2e99629/packages/core/src/video.ts#L16)

***

### status()

> **status**(`jobId`, `options`?): `Promise`\<`JobStatus`\>

Get status details for a video processing job.

#### Parameters

##### jobId

`string`

##### options?

`CallOptions`

#### Returns

`Promise`\<`JobStatus`\>

#### Defined in

[video.ts:25](https://github.com/anbraten/tsky/blob/d41f31ef5ffd7e02d6eae90f23a8982db2e99629/packages/core/src/video.ts#L25)

***

### upload()

> **upload**(`data`, `options`?): `Promise`\<`JobStatus`\>

Upload a video to be processed then stored on the PDS.

#### Parameters

##### data

`InputSchema`

##### options?

`CallOptions`

#### Returns

`Promise`\<`JobStatus`\>

#### Defined in

[video.ts:34](https://github.com/anbraten/tsky/blob/d41f31ef5ffd7e02d6eae90f23a8982db2e99629/packages/core/src/video.ts#L34)
