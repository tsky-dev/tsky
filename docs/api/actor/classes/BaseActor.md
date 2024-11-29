[**actor**](../index.md)

***

[tsky](../../index.md) / [actor](../index.md) / BaseActor

# Class: BaseActor

## Extended by

- [`Actor`](Actor.md)
- [`User`](User.md)

## Constructors

### new BaseActor()

> **new BaseActor**(`instance`, `actor`): [`BaseActor`](BaseActor.md)

#### Parameters

##### instance

`AppBskyNS`

##### actor

`string`

#### Returns

[`BaseActor`](BaseActor.md)

#### Defined in

[actor.ts:24](https://github.com/anbraten/tsky/blob/d41f31ef5ffd7e02d6eae90f23a8982db2e99629/packages/core/src/actor.ts#L24)

## Properties

### actor

> `readonly` **actor**: `string`

#### Defined in

[actor.ts:24](https://github.com/anbraten/tsky/blob/d41f31ef5ffd7e02d6eae90f23a8982db2e99629/packages/core/src/actor.ts#L24)

***

### instance

> `readonly` **instance**: `AppBskyNS`

#### Defined in

[actor.ts:24](https://github.com/anbraten/tsky/blob/d41f31ef5ffd7e02d6eae90f23a8982db2e99629/packages/core/src/actor.ts#L24)

## Methods

### feed()

> **feed**(`params`, `options`?): [`Paginator`](../../paginate/classes/Paginator.md)\<`OutputSchema`\>

Get a list of feeds (feed generator records) created by the actor (in the actor's repo).

#### Parameters

##### params

`QueryParams`

##### options?

`CallOptions`

#### Returns

[`Paginator`](../../paginate/classes/Paginator.md)\<`OutputSchema`\>

#### Defined in

[actor.ts:135](https://github.com/anbraten/tsky/blob/d41f31ef5ffd7e02d6eae90f23a8982db2e99629/packages/core/src/actor.ts#L135)

***

### feeds()

> **feeds**(`limit`?, `options`?): [`Paginator`](../../paginate/classes/Paginator.md)\<`OutputSchema`\>

Get a view of an actor's 'author feed' (post and reposts by the author). Does not require auth.

#### Parameters

##### limit?

`number`

##### options?

`CallOptions`

#### Returns

[`Paginator`](../../paginate/classes/Paginator.md)\<`OutputSchema`\>

#### Defined in

[actor.ts:107](https://github.com/anbraten/tsky/blob/d41f31ef5ffd7e02d6eae90f23a8982db2e99629/packages/core/src/actor.ts#L107)

***

### followers()

> **followers**(`limit`?): [`Paginator`](../../paginate/classes/Paginator.md)\<`OutputSchema`\>

Enumerates accounts which follow a specified account (actor).

#### Parameters

##### limit?

`number`

#### Returns

[`Paginator`](../../paginate/classes/Paginator.md)\<`OutputSchema`\>

#### Defined in

[actor.ts:44](https://github.com/anbraten/tsky/blob/d41f31ef5ffd7e02d6eae90f23a8982db2e99629/packages/core/src/actor.ts#L44)

***

### follows()

> **follows**(`limit`?): [`Paginator`](../../paginate/classes/Paginator.md)\<`OutputSchema`\>

Enumerates accounts which a specified account (actor) follows.

#### Parameters

##### limit?

`number`

#### Returns

[`Paginator`](../../paginate/classes/Paginator.md)\<`OutputSchema`\>

#### Defined in

[actor.ts:59](https://github.com/anbraten/tsky/blob/d41f31ef5ffd7e02d6eae90f23a8982db2e99629/packages/core/src/actor.ts#L59)

***

### likes()

> **likes**(`limit`?, `options`?): [`Paginator`](../../paginate/classes/Paginator.md)\<`OutputSchema`\>

Get a list of posts liked by an actor. Requires auth, actor must be the requesting account.

#### Parameters

##### limit?

`number`

##### options?

`CallOptions`

#### Returns

[`Paginator`](../../paginate/classes/Paginator.md)\<`OutputSchema`\>

#### Defined in

[actor.ts:121](https://github.com/anbraten/tsky/blob/d41f31ef5ffd7e02d6eae90f23a8982db2e99629/packages/core/src/actor.ts#L121)

***

### lists()

> **lists**(`limit`?): [`Paginator`](../../paginate/classes/Paginator.md)\<`OutputSchema`\>

Enumerates the lists created by a specified account (actor).

#### Parameters

##### limit?

`number`

#### Returns

[`Paginator`](../../paginate/classes/Paginator.md)\<`OutputSchema`\>

#### Defined in

[actor.ts:74](https://github.com/anbraten/tsky/blob/d41f31ef5ffd7e02d6eae90f23a8982db2e99629/packages/core/src/actor.ts#L74)

***

### relationships()

> **relationships**(`others`?, `options`?): `Promise`\<`OutputSchema`\>

Enumerates public relationships between one account, and a list of other accounts. Does not require auth.

#### Parameters

##### others?

`string`[]

##### options?

`CallOptions`

#### Returns

`Promise`\<`OutputSchema`\>

#### Defined in

[actor.ts:89](https://github.com/anbraten/tsky/blob/d41f31ef5ffd7e02d6eae90f23a8982db2e99629/packages/core/src/actor.ts#L89)

***

### starterPacks()

> **starterPacks**(`limit`?): [`Paginator`](../../paginate/classes/Paginator.md)\<`OutputSchema`\>

Get a list of starter packs created by the actor.

#### Parameters

##### limit?

`number`

#### Returns

[`Paginator`](../../paginate/classes/Paginator.md)\<`OutputSchema`\>

#### Defined in

[actor.ts:29](https://github.com/anbraten/tsky/blob/d41f31ef5ffd7e02d6eae90f23a8982db2e99629/packages/core/src/actor.ts#L29)

***

### thread()

> **thread**(`thread`): `Thread`

#### Parameters

##### thread

`string`

#### Returns

`Thread`

#### Defined in

[actor.ts:149](https://github.com/anbraten/tsky/blob/d41f31ef5ffd7e02d6eae90f23a8982db2e99629/packages/core/src/actor.ts#L149)
