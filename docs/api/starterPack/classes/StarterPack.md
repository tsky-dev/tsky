[**starterPack**](../index.md)

***

[tsky](../../index.md) / [starterPack](../index.md) / StarterPack

# Class: StarterPack

## Constructors

### new StarterPack()

> **new StarterPack**(`instance`, `uri`): [`StarterPack`](StarterPack.md)

#### Parameters

##### instance

`AppBskyNS`

##### uri

`string`

#### Returns

[`StarterPack`](StarterPack.md)

#### Defined in

[starterPack.ts:10](https://github.com/anbraten/tsky/blob/d41f31ef5ffd7e02d6eae90f23a8982db2e99629/packages/core/src/starterPack.ts#L10)

## Methods

### about()

> **about**(`options`?): `Promise`\<`OutputSchema`\>

Gets a view of a starter pack.

#### Parameters

##### options?

`CallOptions`

#### Returns

`Promise`\<`OutputSchema`\>

#### Defined in

[starterPack.ts:15](https://github.com/anbraten/tsky/blob/d41f31ef5ffd7e02d6eae90f23a8982db2e99629/packages/core/src/starterPack.ts#L15)

***

### getMany()

> `static` **getMany**(`instance`, `starterpacks`, `options`?): `Promise`\<`OutputSchema`\>

Get views for a list of starter packs.

#### Parameters

##### instance

`AppBskyNS`

##### starterpacks

`string`[]

##### options?

`CallOptions`

#### Returns

`Promise`\<`OutputSchema`\>

#### Defined in

[starterPack.ts:52](https://github.com/anbraten/tsky/blob/d41f31ef5ffd7e02d6eae90f23a8982db2e99629/packages/core/src/starterPack.ts#L52)

***

### search()

> `static` **search**(`instance`, `query`, `limit`?, `options`?): [`Paginator`](../../paginate/classes/Paginator.md)\<`OutputSchema`\>

Search for starter packs.

#### Parameters

##### instance

`AppBskyNS`

##### query

`string`

##### limit?

`number`

##### options?

`CallOptions`

#### Returns

[`Paginator`](../../paginate/classes/Paginator.md)\<`OutputSchema`\>

#### Defined in

[starterPack.ts:29](https://github.com/anbraten/tsky/blob/d41f31ef5ffd7e02d6eae90f23a8982db2e99629/packages/core/src/starterPack.ts#L29)
