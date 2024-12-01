[**paginate**](../index.md)

***

[tsky](../../index.md) / [paginate](../index.md) / Paginator

# Paginator\<T\>

## Type Parameters

• **T** *extends* `CursorResponse`

## Constructors

### new Paginator()

```ts
new Paginator<T>(onNext, defaultValues?): Paginator<T>
```

#### Parameters

##### onNext

(`cursor`?) => `Promise`\<`T`\>

##### defaultValues?

`T`[]

#### Returns

[`Paginator`](Paginator.md)\<`T`\>

#### Defined in

[paginate.ts:9](https://github.com/taskylizard/tsky-fork-typedoc-pr/blob/a5370df6192d679fcbec429e409a79d61db0f356/packages/core/src/paginate.ts#L9)

## Properties

### values

```ts
readonly values: T[] = [];
```

#### Defined in

[paginate.ts:7](https://github.com/taskylizard/tsky-fork-typedoc-pr/blob/a5370df6192d679fcbec429e409a79d61db0f356/packages/core/src/paginate.ts#L7)

## Methods

### clone()

```ts
clone(): Paginator<T>
```

#### Returns

[`Paginator`](Paginator.md)\<`T`\>

#### Defined in

[paginate.ts:21](https://github.com/taskylizard/tsky-fork-typedoc-pr/blob/a5370df6192d679fcbec429e409a79d61db0f356/packages/core/src/paginate.ts#L21)

***

### next()

```ts
next(): Promise<null | T>
```

#### Returns

`Promise`\<`null` \| `T`\>

#### Defined in

[paginate.ts:25](https://github.com/taskylizard/tsky-fork-typedoc-pr/blob/a5370df6192d679fcbec429e409a79d61db0f356/packages/core/src/paginate.ts#L25)
