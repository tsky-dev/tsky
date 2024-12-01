[**starterPack**](../index.md)

***

[tsky](../../index.md) / [starterPack](../index.md) / StarterPack

# StarterPack

## Constructors

### new StarterPack()

```ts
new StarterPack(instance, uri): StarterPack
```

#### Parameters

##### instance

`AppBskyNS`

##### uri

`string`

#### Returns

[`StarterPack`](StarterPack.md)

#### Defined in

[starterPack.ts:10](https://github.com/taskylizard/tsky-fork-typedoc-pr/blob/a5370df6192d679fcbec429e409a79d61db0f356/packages/core/src/starterPack.ts#L10)

## Methods

### about()

```ts
about(options?): Promise<OutputSchema>
```

Gets a view of a starter pack.

#### Parameters

##### options?

`CallOptions`

#### Returns

`Promise`\<`OutputSchema`\>

#### Defined in

[starterPack.ts:15](https://github.com/taskylizard/tsky-fork-typedoc-pr/blob/a5370df6192d679fcbec429e409a79d61db0f356/packages/core/src/starterPack.ts#L15)

***

### getMany()

```ts
static getMany(
   instance, 
   starterpacks, 
options?): Promise<OutputSchema>
```

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

[starterPack.ts:52](https://github.com/taskylizard/tsky-fork-typedoc-pr/blob/a5370df6192d679fcbec429e409a79d61db0f356/packages/core/src/starterPack.ts#L52)

***

### search()

```ts
static search(
   instance, 
   query, 
   limit?, 
options?): Paginator<OutputSchema>
```

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

[starterPack.ts:29](https://github.com/taskylizard/tsky-fork-typedoc-pr/blob/a5370df6192d679fcbec429e409a79d61db0f356/packages/core/src/starterPack.ts#L29)
