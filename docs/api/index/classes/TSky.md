[**index**](../index.md)

***

[tsky](../../index.md) / [index](../index.md) / TSky

# TSky

## Constructors

### new TSky()

```ts
new TSky(instance): TSky
```

#### Parameters

##### instance

`AppBskyNS`

#### Returns

[`TSky`](TSky.md)

#### Defined in

[index.ts:12](https://github.com/taskylizard/tsky-fork-typedoc-pr/blob/a5370df6192d679fcbec429e409a79d61db0f356/packages/core/src/index.ts#L12)

## Methods

### profile()

#### Call Signature

```ts
profile(identifier, options?): Promise<ProfileViewDetailed>
```

Get detailed profile view of an actor. Does not require auth, but contains relevant metadata with auth.

##### Parameters

###### identifier

`string`

###### options?

`CallOptions`

##### Returns

`Promise`\<`ProfileViewDetailed`\>

##### Defined in

[index.ts:17](https://github.com/taskylizard/tsky-fork-typedoc-pr/blob/a5370df6192d679fcbec429e409a79d61db0f356/packages/core/src/index.ts#L17)

#### Call Signature

```ts
profile(identifiers, options?): Promise<ProfileViewDetailed[]>
```

Get detailed profile views of multiple actors.

##### Parameters

###### identifiers

`string`[]

###### options?

`CallOptions`

##### Returns

`Promise`\<`ProfileViewDetailed`[]\>

##### Defined in

[index.ts:24](https://github.com/taskylizard/tsky-fork-typedoc-pr/blob/a5370df6192d679fcbec429e409a79d61db0f356/packages/core/src/index.ts#L24)

***

### search()

```ts
search(params, options?): Promise<Paginator<OutputSchema>>
```

Find actors (profiles) matching search criteria. Does not require auth.

#### Parameters

##### params

`QueryParams` = `{}`

##### options?

`CallOptions`

#### Returns

`Promise`\<[`Paginator`](../../paginate/classes/Paginator.md)\<`OutputSchema`\>\>

#### Defined in

[index.ts:70](https://github.com/taskylizard/tsky-fork-typedoc-pr/blob/a5370df6192d679fcbec429e409a79d61db0f356/packages/core/src/index.ts#L70)

***

### typeahead()

```ts
typeahead(params, options?): Promise<ProfileViewBasic[]>
```

Find actor suggestions for a prefix search term. Expected use is for auto-completion during text field entry. Does not require auth.

#### Parameters

##### params

`QueryParams`

##### options?

`CallOptions`

#### Returns

`Promise`\<`ProfileViewBasic`[]\>

#### Defined in

[index.ts:55](https://github.com/taskylizard/tsky-fork-typedoc-pr/blob/a5370df6192d679fcbec429e409a79d61db0f356/packages/core/src/index.ts#L55)
