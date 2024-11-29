[**list**](../index.md)

***

[tsky](../../index.md) / [list](../index.md) / BskyList

# Class: BskyList

## Constructors

### new BskyList()

> **new BskyList**(`instance`, `uri`): [`BskyList`](BskyList.md)

#### Parameters

##### instance

`AppBskyNS`

##### uri

`string`

#### Returns

[`BskyList`](BskyList.md)

#### Defined in

[list.ts:9](https://github.com/anbraten/tsky/blob/d41f31ef5ffd7e02d6eae90f23a8982db2e99629/packages/core/src/list.ts#L9)

## Methods

### about()

> **about**(`limit`?, `options`?): [`Paginator`](../../paginate/classes/Paginator.md)\<`OutputSchema`\>

Gets a 'view' (with additional context) of a specified list.

#### Parameters

##### limit?

`number`

##### options?

`CallOptions`

#### Returns

[`Paginator`](../../paginate/classes/Paginator.md)\<`OutputSchema`\>

#### Defined in

[list.ts:14](https://github.com/anbraten/tsky/blob/d41f31ef5ffd7e02d6eae90f23a8982db2e99629/packages/core/src/list.ts#L14)

***

### feed()

> **feed**(`limit`?, `options`?): [`Paginator`](../../paginate/classes/Paginator.md)\<`OutputSchema`\>

Get a feed of recent posts from a list (posts and reposts from any actors on the list). Does not require auth.

#### Parameters

##### limit?

`number`

##### options?

`CallOptions`

#### Returns

[`Paginator`](../../paginate/classes/Paginator.md)\<`OutputSchema`\>

#### Defined in

[list.ts:32](https://github.com/anbraten/tsky/blob/d41f31ef5ffd7e02d6eae90f23a8982db2e99629/packages/core/src/list.ts#L32)
