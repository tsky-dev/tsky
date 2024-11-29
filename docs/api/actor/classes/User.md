[**actor**](../index.md)

***

[tsky](../../index.md) / [actor](../index.md) / User

# Class: User

## Extends

- [`BaseActor`](BaseActor.md)

## Constructors

### new User()

> **new User**(`instance`, `actor`): [`User`](User.md)

#### Parameters

##### instance

`AppBskyNS`

##### actor

`string`

#### Returns

[`User`](User.md)

#### Inherited from

[`BaseActor`](BaseActor.md).[`constructor`](BaseActor.md#constructors)

#### Defined in

[actor.ts:24](https://github.com/anbraten/tsky/blob/d41f31ef5ffd7e02d6eae90f23a8982db2e99629/packages/core/src/actor.ts#L24)

## Properties

### actor

> `readonly` **actor**: `string`

#### Inherited from

[`BaseActor`](BaseActor.md).[`actor`](BaseActor.md#actor)

#### Defined in

[actor.ts:24](https://github.com/anbraten/tsky/blob/d41f31ef5ffd7e02d6eae90f23a8982db2e99629/packages/core/src/actor.ts#L24)

***

### instance

> `readonly` **instance**: `AppBskyNS`

#### Inherited from

[`BaseActor`](BaseActor.md).[`instance`](BaseActor.md#instance)

#### Defined in

[actor.ts:24](https://github.com/anbraten/tsky/blob/d41f31ef5ffd7e02d6eae90f23a8982db2e99629/packages/core/src/actor.ts#L24)

## Methods

### blockedLists()

> **blockedLists**(`limit`?, `options`?): [`Paginator`](../../paginate/classes/Paginator.md)\<`OutputSchema`\>

Get mod lists that the requesting account (actor) is blocking. Requires auth.

#### Parameters

##### limit?

`number`

##### options?

`CallOptions`

#### Returns

[`Paginator`](../../paginate/classes/Paginator.md)\<`OutputSchema`\>

#### Defined in

[actor.ts:236](https://github.com/anbraten/tsky/blob/d41f31ef5ffd7e02d6eae90f23a8982db2e99629/packages/core/src/actor.ts#L236)

***

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

#### Inherited from

[`BaseActor`](BaseActor.md).[`feed`](BaseActor.md#feed)

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

#### Inherited from

[`BaseActor`](BaseActor.md).[`feeds`](BaseActor.md#feeds)

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

#### Inherited from

[`BaseActor`](BaseActor.md).[`followers`](BaseActor.md#followers)

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

#### Inherited from

[`BaseActor`](BaseActor.md).[`follows`](BaseActor.md#follows)

#### Defined in

[actor.ts:59](https://github.com/anbraten/tsky/blob/d41f31ef5ffd7e02d6eae90f23a8982db2e99629/packages/core/src/actor.ts#L59)

***

### knowFollowers()

> **knowFollowers**(`params`, `options`?): [`Paginator`](../../paginate/classes/Paginator.md)\<`OutputSchema`\>

Enumerates accounts which follow a specified account (actor) and are followed by the viewer.

#### Parameters

##### params

###### params.actor

`string`

###### params.limit

`number`

##### options?

`CallOptions`

#### Returns

[`Paginator`](../../paginate/classes/Paginator.md)\<`OutputSchema`\>

#### Defined in

[actor.ts:216](https://github.com/anbraten/tsky/blob/d41f31ef5ffd7e02d6eae90f23a8982db2e99629/packages/core/src/actor.ts#L216)

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

#### Inherited from

[`BaseActor`](BaseActor.md).[`likes`](BaseActor.md#likes)

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

#### Inherited from

[`BaseActor`](BaseActor.md).[`lists`](BaseActor.md#lists)

#### Defined in

[actor.ts:74](https://github.com/anbraten/tsky/blob/d41f31ef5ffd7e02d6eae90f23a8982db2e99629/packages/core/src/actor.ts#L74)

***

### mutedLists()

> **mutedLists**(`limit`?, `options`?): [`Paginator`](../../paginate/classes/Paginator.md)\<`OutputSchema`\>

Enumerates mod lists that the requesting account (actor) currently has muted. Requires auth.

#### Parameters

##### limit?

`number`

##### options?

`CallOptions`

#### Returns

[`Paginator`](../../paginate/classes/Paginator.md)\<`OutputSchema`\>

#### Defined in

[actor.ts:256](https://github.com/anbraten/tsky/blob/d41f31ef5ffd7e02d6eae90f23a8982db2e99629/packages/core/src/actor.ts#L256)

***

### mutedProfiles()

> **mutedProfiles**(`limit`?, `options`?): [`Paginator`](../../paginate/classes/Paginator.md)\<`OutputSchema`\>

Enumerates accounts that the requesting account (actor) currently has muted. Requires auth.

#### Parameters

##### limit?

`number`

##### options?

`CallOptions`

#### Returns

[`Paginator`](../../paginate/classes/Paginator.md)\<`OutputSchema`\>

#### Defined in

[actor.ts:273](https://github.com/anbraten/tsky/blob/d41f31ef5ffd7e02d6eae90f23a8982db2e99629/packages/core/src/actor.ts#L273)

***

### preferences()

> **preferences**(): [`Preferences`](../../preference/classes/Preferences.md)

#### Returns

[`Preferences`](../../preference/classes/Preferences.md)

#### Defined in

[actor.ts:291](https://github.com/anbraten/tsky/blob/d41f31ef5ffd7e02d6eae90f23a8982db2e99629/packages/core/src/actor.ts#L291)

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

#### Inherited from

[`BaseActor`](BaseActor.md).[`relationships`](BaseActor.md#relationships)

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

#### Inherited from

[`BaseActor`](BaseActor.md).[`starterPacks`](BaseActor.md#starterpacks)

#### Defined in

[actor.ts:29](https://github.com/anbraten/tsky/blob/d41f31ef5ffd7e02d6eae90f23a8982db2e99629/packages/core/src/actor.ts#L29)

***

### suggestions()

> **suggestions**(): `Suggestions`

#### Returns

`Suggestions`

#### Defined in

[actor.ts:287](https://github.com/anbraten/tsky/blob/d41f31ef5ffd7e02d6eae90f23a8982db2e99629/packages/core/src/actor.ts#L287)

***

### thread()

> **thread**(`thread`): `Thread`

#### Parameters

##### thread

`string`

#### Returns

`Thread`

#### Inherited from

[`BaseActor`](BaseActor.md).[`thread`](BaseActor.md#thread)

#### Defined in

[actor.ts:149](https://github.com/anbraten/tsky/blob/d41f31ef5ffd7e02d6eae90f23a8982db2e99629/packages/core/src/actor.ts#L149)
