[**post**](../index.md)

***

[tsky](../../index.md) / [post](../index.md) / Post

# Class: Post

## Constructors

### new Post()

> **new Post**(`instance`): [`Post`](Post.md)

#### Parameters

##### instance

`AppBskyNS`

#### Returns

[`Post`](Post.md)

#### Defined in

[post.ts:13](https://github.com/anbraten/tsky/blob/d41f31ef5ffd7e02d6eae90f23a8982db2e99629/packages/core/src/post.ts#L13)

## Methods

### likes()

> **likes**(`params`, `options`?): [`Paginator`](../../paginate/classes/Paginator.md)\<`OutputSchema`\>

Get like records which reference a subject (by AT-URI and CID).

#### Parameters

##### params

`QueryParams`

##### options?

`CallOptions`

#### Returns

[`Paginator`](../../paginate/classes/Paginator.md)\<`OutputSchema`\>

#### Defined in

[post.ts:30](https://github.com/anbraten/tsky/blob/d41f31ef5ffd7e02d6eae90f23a8982db2e99629/packages/core/src/post.ts#L30)

***

### quotes()

> **quotes**(`params`, `options`?): [`Paginator`](../../paginate/classes/Paginator.md)\<`OutputSchema`\>

Get a list of quotes for a given post.

#### Parameters

##### params

`QueryParams`

##### options?

`CallOptions`

#### Returns

[`Paginator`](../../paginate/classes/Paginator.md)\<`OutputSchema`\>

#### Defined in

[post.ts:47](https://github.com/anbraten/tsky/blob/d41f31ef5ffd7e02d6eae90f23a8982db2e99629/packages/core/src/post.ts#L47)

***

### repostedBy()

> **repostedBy**(`params`, `options`?): [`Paginator`](../../paginate/classes/Paginator.md)\<`OutputSchema`\>

Get a list of reposts for a given post.

#### Parameters

##### params

`QueryParams`

##### options?

`CallOptions`

#### Returns

[`Paginator`](../../paginate/classes/Paginator.md)\<`OutputSchema`\>

#### Defined in

[post.ts:64](https://github.com/anbraten/tsky/blob/d41f31ef5ffd7e02d6eae90f23a8982db2e99629/packages/core/src/post.ts#L64)

***

### threads()

> **threads**(`params`, `options`?): `Promise`\<`OutputSchema`\>

Get posts in a thread. Does not require auth, but additional metadata and filtering will be applied for authed requests.

#### Parameters

##### params

`QueryParams`

##### options?

`CallOptions`

#### Returns

`Promise`\<`OutputSchema`\>

#### Defined in

[post.ts:18](https://github.com/anbraten/tsky/blob/d41f31ef5ffd7e02d6eae90f23a8982db2e99629/packages/core/src/post.ts#L18)

***

### getMany()

> `static` **getMany**(`instance`, `posts`, `options`?): `Promise`\<`PostView`[]\>

Gets post views for a specified list of posts (by AT-URI). This is sometimes referred to as 'hydrating' a 'feed skeleton'.

#### Parameters

##### instance

`AppBskyNS`

##### posts

`string`[]

##### options?

`CallOptions`

#### Returns

`Promise`\<`PostView`[]\>

#### Defined in

[post.ts:99](https://github.com/anbraten/tsky/blob/d41f31ef5ffd7e02d6eae90f23a8982db2e99629/packages/core/src/post.ts#L99)

***

### search()

> `static` **search**(`instance`, `params`, `options`?): [`Paginator`](../../paginate/classes/Paginator.md)\<`OutputSchema`\>

Find posts matching search criteria, returning views of those posts.

#### Parameters

##### instance

`AppBskyNS`

##### params

`QueryParams`

##### options?

`CallOptions`

#### Returns

[`Paginator`](../../paginate/classes/Paginator.md)\<`OutputSchema`\>

#### Defined in

[post.ts:81](https://github.com/anbraten/tsky/blob/d41f31ef5ffd7e02d6eae90f23a8982db2e99629/packages/core/src/post.ts#L81)
