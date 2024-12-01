[**actor**](../index.md)

***

[tsky](../../index.md) / [actor](../index.md) / BaseActor

# BaseActor

## Extended by

- [`Actor`](Actor.md)
- [`User`](User.md)

## Constructors

### new BaseActor()

```ts
new BaseActor(instance, actor): BaseActor
```

#### Parameters

##### instance

`AppBskyNS`

##### actor

`string`

#### Returns

[`BaseActor`](BaseActor.md)

#### Defined in

[actor.ts:24](https://github.com/taskylizard/tsky-fork-typedoc-pr/blob/a5370df6192d679fcbec429e409a79d61db0f356/packages/core/src/actor.ts#L24)

## Properties

### actor

```ts
readonly actor: string;
```

#### Defined in

[actor.ts:24](https://github.com/taskylizard/tsky-fork-typedoc-pr/blob/a5370df6192d679fcbec429e409a79d61db0f356/packages/core/src/actor.ts#L24)

***

### instance

```ts
readonly instance: AppBskyNS;
```

#### Defined in

[actor.ts:24](https://github.com/taskylizard/tsky-fork-typedoc-pr/blob/a5370df6192d679fcbec429e409a79d61db0f356/packages/core/src/actor.ts#L24)

## Methods

### feed()

```ts
feed(params, options?): Paginator<OutputSchema>
```

Get a list of feeds (feed generator records) created by the actor (in the actor's repo).

#### Parameters

##### params

`QueryParams`

##### options?

`CallOptions`

#### Returns

[`Paginator`](../../paginate/classes/Paginator.md)\<`OutputSchema`\>

#### Defined in

[actor.ts:135](https://github.com/taskylizard/tsky-fork-typedoc-pr/blob/a5370df6192d679fcbec429e409a79d61db0f356/packages/core/src/actor.ts#L135)

***

### feeds()

```ts
feeds(limit?, options?): Paginator<OutputSchema>
```

Get a view of an actor's 'author feed' (post and reposts by the author). Does not require auth.

#### Parameters

##### limit?

`number`

##### options?

`CallOptions`

#### Returns

[`Paginator`](../../paginate/classes/Paginator.md)\<`OutputSchema`\>

#### Defined in

[actor.ts:107](https://github.com/taskylizard/tsky-fork-typedoc-pr/blob/a5370df6192d679fcbec429e409a79d61db0f356/packages/core/src/actor.ts#L107)

***

### followers()

```ts
followers(limit?): Paginator<OutputSchema>
```

Enumerates accounts which follow a specified account (actor).

#### Parameters

##### limit?

`number`

#### Returns

[`Paginator`](../../paginate/classes/Paginator.md)\<`OutputSchema`\>

#### Defined in

[actor.ts:44](https://github.com/taskylizard/tsky-fork-typedoc-pr/blob/a5370df6192d679fcbec429e409a79d61db0f356/packages/core/src/actor.ts#L44)

***

### follows()

```ts
follows(limit?): Paginator<OutputSchema>
```

Enumerates accounts which a specified account (actor) follows.

#### Parameters

##### limit?

`number`

#### Returns

[`Paginator`](../../paginate/classes/Paginator.md)\<`OutputSchema`\>

#### Defined in

[actor.ts:59](https://github.com/taskylizard/tsky-fork-typedoc-pr/blob/a5370df6192d679fcbec429e409a79d61db0f356/packages/core/src/actor.ts#L59)

***

### likes()

```ts
likes(limit?, options?): Paginator<OutputSchema>
```

Get a list of posts liked by an actor. Requires auth, actor must be the requesting account.

#### Parameters

##### limit?

`number`

##### options?

`CallOptions`

#### Returns

[`Paginator`](../../paginate/classes/Paginator.md)\<`OutputSchema`\>

#### Defined in

[actor.ts:121](https://github.com/taskylizard/tsky-fork-typedoc-pr/blob/a5370df6192d679fcbec429e409a79d61db0f356/packages/core/src/actor.ts#L121)

***

### lists()

```ts
lists(limit?): Paginator<OutputSchema>
```

Enumerates the lists created by a specified account (actor).

#### Parameters

##### limit?

`number`

#### Returns

[`Paginator`](../../paginate/classes/Paginator.md)\<`OutputSchema`\>

#### Defined in

[actor.ts:74](https://github.com/taskylizard/tsky-fork-typedoc-pr/blob/a5370df6192d679fcbec429e409a79d61db0f356/packages/core/src/actor.ts#L74)

***

### relationships()

```ts
relationships(others?, options?): Promise<OutputSchema>
```

Enumerates public relationships between one account, and a list of other accounts. Does not require auth.

#### Parameters

##### others?

`string`[]

##### options?

`CallOptions`

#### Returns

`Promise`\<`OutputSchema`\>

#### Defined in

[actor.ts:89](https://github.com/taskylizard/tsky-fork-typedoc-pr/blob/a5370df6192d679fcbec429e409a79d61db0f356/packages/core/src/actor.ts#L89)

***

### starterPacks()

```ts
starterPacks(limit?): Paginator<OutputSchema>
```

Get a list of starter packs created by the actor.

#### Parameters

##### limit?

`number`

#### Returns

[`Paginator`](../../paginate/classes/Paginator.md)\<`OutputSchema`\>

#### Defined in

[actor.ts:29](https://github.com/taskylizard/tsky-fork-typedoc-pr/blob/a5370df6192d679fcbec429e409a79d61db0f356/packages/core/src/actor.ts#L29)

***

### thread()

```ts
thread(thread): Thread
```

#### Parameters

##### thread

`string`

#### Returns

`Thread`

#### Defined in

[actor.ts:149](https://github.com/taskylizard/tsky-fork-typedoc-pr/blob/a5370df6192d679fcbec429e409a79d61db0f356/packages/core/src/actor.ts#L149)
