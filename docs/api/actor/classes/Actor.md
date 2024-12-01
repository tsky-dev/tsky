[**actor**](../index.md)

***

[tsky](../../index.md) / [actor](../index.md) / Actor

# Actor

## Extends

- [`BaseActor`](BaseActor.md)

## Constructors

### new Actor()

```ts
new Actor(instance, actor): Actor
```

#### Parameters

##### instance

`AppBskyNS`

##### actor

`string`

#### Returns

[`Actor`](Actor.md)

#### Inherited from

[`BaseActor`](BaseActor.md).[`constructor`](BaseActor.md#constructors)

#### Defined in

[actor.ts:24](https://github.com/taskylizard/tsky-fork-typedoc-pr/blob/a5370df6192d679fcbec429e409a79d61db0f356/packages/core/src/actor.ts#L24)

## Properties

### actor

```ts
readonly actor: string;
```

#### Inherited from

[`BaseActor`](BaseActor.md).[`actor`](BaseActor.md#actor)

#### Defined in

[actor.ts:24](https://github.com/taskylizard/tsky-fork-typedoc-pr/blob/a5370df6192d679fcbec429e409a79d61db0f356/packages/core/src/actor.ts#L24)

***

### instance

```ts
readonly instance: AppBskyNS;
```

#### Inherited from

[`BaseActor`](BaseActor.md).[`instance`](BaseActor.md#instance)

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

#### Inherited from

[`BaseActor`](BaseActor.md).[`feed`](BaseActor.md#feed)

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

#### Inherited from

[`BaseActor`](BaseActor.md).[`feeds`](BaseActor.md#feeds)

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

#### Inherited from

[`BaseActor`](BaseActor.md).[`followers`](BaseActor.md#followers)

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

#### Inherited from

[`BaseActor`](BaseActor.md).[`follows`](BaseActor.md#follows)

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

#### Inherited from

[`BaseActor`](BaseActor.md).[`likes`](BaseActor.md#likes)

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

#### Inherited from

[`BaseActor`](BaseActor.md).[`lists`](BaseActor.md#lists)

#### Defined in

[actor.ts:74](https://github.com/taskylizard/tsky-fork-typedoc-pr/blob/a5370df6192d679fcbec429e409a79d61db0f356/packages/core/src/actor.ts#L74)

***

### mute()

```ts
mute(options?): Promise<Response>
```

Creates a mute relationship for the specified account. Mutes are private in Bluesky. Requires auth.

#### Parameters

##### options?

`CallOptions`

#### Returns

`Promise`\<`Response`\>

#### Defined in

[actor.ts:176](https://github.com/taskylizard/tsky-fork-typedoc-pr/blob/a5370df6192d679fcbec429e409a79d61db0f356/packages/core/src/actor.ts#L176)

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

#### Inherited from

[`BaseActor`](BaseActor.md).[`relationships`](BaseActor.md#relationships)

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

#### Inherited from

[`BaseActor`](BaseActor.md).[`starterPacks`](BaseActor.md#starterpacks)

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

#### Inherited from

[`BaseActor`](BaseActor.md).[`thread`](BaseActor.md#thread)

#### Defined in

[actor.ts:149](https://github.com/taskylizard/tsky-fork-typedoc-pr/blob/a5370df6192d679fcbec429e409a79d61db0f356/packages/core/src/actor.ts#L149)

***

### unmute()

```ts
unmute(options?): Promise<Response>
```

Unmutes the specified account. Requires auth.

#### Parameters

##### options?

`CallOptions`

#### Returns

`Promise`\<`Response`\>

#### Defined in

[actor.ts:183](https://github.com/taskylizard/tsky-fork-typedoc-pr/blob/a5370df6192d679fcbec429e409a79d61db0f356/packages/core/src/actor.ts#L183)

***

### muteMany()

```ts
static muteMany(
   instance, 
   actors, 
options?): Promise<Response>
```

Creates a mute relationship for the specified list of accounts. Mutes are private in Bluesky. Requires auth.

#### Parameters

##### instance

`AppBskyNS`

##### actors

`string`[]

##### options?

`CallOptions`

#### Returns

`Promise`\<`Response`\>

#### Defined in

[actor.ts:190](https://github.com/taskylizard/tsky-fork-typedoc-pr/blob/a5370df6192d679fcbec429e409a79d61db0f356/packages/core/src/actor.ts#L190)

***

### unmuteMany()

```ts
static unmuteMany(
   instance, 
   actors, 
options?): Promise<Response>
```

Unmutes the specified list of accounts. Requires auth.

#### Parameters

##### instance

`AppBskyNS`

##### actors

`string`[]

##### options?

`CallOptions`

#### Returns

`Promise`\<`Response`\>

#### Defined in

[actor.ts:202](https://github.com/taskylizard/tsky-fork-typedoc-pr/blob/a5370df6192d679fcbec429e409a79d61db0f356/packages/core/src/actor.ts#L202)
