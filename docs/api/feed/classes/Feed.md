[**feed**](../index.md)

***

[tsky](../../index.md) / [feed](../index.md) / Feed

# Class: Feed

## Constructors

### new Feed()

> **new Feed**(`instance`): [`Feed`](Feed.md)

#### Parameters

##### instance

`AppBskyNS`

#### Returns

[`Feed`](Feed.md)

#### Defined in

[feed.ts:14](https://github.com/anbraten/tsky/blob/d41f31ef5ffd7e02d6eae90f23a8982db2e99629/packages/core/src/feed.ts#L14)

## Methods

### generator()

> **generator**(): `FeedGenerator`

#### Returns

`FeedGenerator`

#### Defined in

[feed.ts:62](https://github.com/anbraten/tsky/blob/d41f31ef5ffd7e02d6eae90f23a8982db2e99629/packages/core/src/feed.ts#L62)

***

### getFeed()

> **getFeed**(`params`, `options`?): `Promise`\<[`Paginator`](../../paginate/classes/Paginator.md)\<`OutputSchema`\>\>

Get a hydrated feed from an actor's selected feed generator. Implemented by App View.

#### Parameters

##### params

`QueryParams`

##### options?

`CallOptions`

#### Returns

`Promise`\<[`Paginator`](../../paginate/classes/Paginator.md)\<`OutputSchema`\>\>

#### Defined in

[feed.ts:19](https://github.com/anbraten/tsky/blob/d41f31ef5ffd7e02d6eae90f23a8982db2e99629/packages/core/src/feed.ts#L19)

***

### sendInteractions()

> **sendInteractions**(`data`?, `options`?): `Promise`\<`OutputSchema`\>

Send information about interactions with feed items back to the feed generator that served them.

#### Parameters

##### data?

`InputSchema`

##### options?

`CallOptions`

#### Returns

`Promise`\<`OutputSchema`\>

#### Defined in

[feed.ts:53](https://github.com/anbraten/tsky/blob/d41f31ef5ffd7e02d6eae90f23a8982db2e99629/packages/core/src/feed.ts#L53)

***

### timeline()

> **timeline**(`params`, `options`?): [`Paginator`](../../paginate/classes/Paginator.md)\<`OutputSchema`\>

Get a view of the requesting account's home timeline. This is expected to be some form of reverse-chronological feed.

#### Parameters

##### params

`QueryParams`

##### options?

`CallOptions`

#### Returns

[`Paginator`](../../paginate/classes/Paginator.md)\<`OutputSchema`\>

#### Defined in

[feed.ts:36](https://github.com/anbraten/tsky/blob/d41f31ef5ffd7e02d6eae90f23a8982db2e99629/packages/core/src/feed.ts#L36)
