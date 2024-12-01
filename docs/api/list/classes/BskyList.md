[**list**](../index.md)

***

[tsky](../../index.md) / [list](../index.md) / BskyList

# BskyList

## Constructors

### new BskyList()

```ts
new BskyList(instance, uri): BskyList
```

#### Parameters

##### instance

`AppBskyNS`

##### uri

`string`

#### Returns

[`BskyList`](BskyList.md)

#### Defined in

[list.ts:9](https://github.com/taskylizard/tsky-fork-typedoc-pr/blob/a5370df6192d679fcbec429e409a79d61db0f356/packages/core/src/list.ts#L9)

## Methods

### about()

```ts
about(limit?, options?): Paginator<OutputSchema>
```

Gets a 'view' (with additional context) of a specified list.

#### Parameters

##### limit?

`number`

##### options?

`CallOptions`

#### Returns

[`Paginator`](../../paginate/classes/Paginator.md)\<`OutputSchema`\>

#### Defined in

[list.ts:14](https://github.com/taskylizard/tsky-fork-typedoc-pr/blob/a5370df6192d679fcbec429e409a79d61db0f356/packages/core/src/list.ts#L14)

***

### feed()

```ts
feed(limit?, options?): Paginator<OutputSchema>
```

Get a feed of recent posts from a list (posts and reposts from any actors on the list). Does not require auth.

#### Parameters

##### limit?

`number`

##### options?

`CallOptions`

#### Returns

[`Paginator`](../../paginate/classes/Paginator.md)\<`OutputSchema`\>

#### Defined in

[list.ts:32](https://github.com/taskylizard/tsky-fork-typedoc-pr/blob/a5370df6192d679fcbec429e409a79d61db0f356/packages/core/src/list.ts#L32)
