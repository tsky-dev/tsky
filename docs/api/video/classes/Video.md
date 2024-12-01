[**video**](../index.md)

***

[tsky](../../index.md) / [video](../index.md) / Video

# Video

## Constructors

### new Video()

```ts
new Video(instance): Video
```

#### Parameters

##### instance

`AppBskyNS`

#### Returns

[`Video`](Video.md)

#### Defined in

[video.ts:11](https://github.com/taskylizard/tsky-fork-typedoc-pr/blob/a5370df6192d679fcbec429e409a79d61db0f356/packages/core/src/video.ts#L11)

## Methods

### limit()

```ts
limit(options?): Promise<OutputSchema>
```

Get video upload limits for the authenticated user.

#### Parameters

##### options?

`CallOptions`

#### Returns

`Promise`\<`OutputSchema`\>

#### Defined in

[video.ts:16](https://github.com/taskylizard/tsky-fork-typedoc-pr/blob/a5370df6192d679fcbec429e409a79d61db0f356/packages/core/src/video.ts#L16)

***

### status()

```ts
status(jobId, options?): Promise<JobStatus>
```

Get status details for a video processing job.

#### Parameters

##### jobId

`string`

##### options?

`CallOptions`

#### Returns

`Promise`\<`JobStatus`\>

#### Defined in

[video.ts:25](https://github.com/taskylizard/tsky-fork-typedoc-pr/blob/a5370df6192d679fcbec429e409a79d61db0f356/packages/core/src/video.ts#L25)

***

### upload()

```ts
upload(data, options?): Promise<JobStatus>
```

Upload a video to be processed then stored on the PDS.

#### Parameters

##### data

`InputSchema`

##### options?

`CallOptions`

#### Returns

`Promise`\<`JobStatus`\>

#### Defined in

[video.ts:34](https://github.com/taskylizard/tsky-fork-typedoc-pr/blob/a5370df6192d679fcbec429e409a79d61db0f356/packages/core/src/video.ts#L34)
