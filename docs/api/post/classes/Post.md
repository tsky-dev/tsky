[**post**](../index.md)

***

[tsky](../../index.md) / [post](../index.md) / Post

# Post

## Constructors

### new Post()

```ts
new Post(instance): Post
```

#### Parameters

##### instance

`AppBskyNS`

#### Returns

[`Post`](Post.md)

#### Defined in

[post.ts:13](https://github.com/taskylizard/tsky-fork-typedoc-pr/blob/a5370df6192d679fcbec429e409a79d61db0f356/packages/core/src/post.ts#L13)

## Methods

### likes()

```ts
likes(params, options?): Paginator<OutputSchema>
```

Get like records which reference a subject (by AT-URI and CID).

#### Parameters

##### params

`QueryParams`

##### options?

`CallOptions`

#### Returns

[`Paginator`](../../paginate/classes/Paginator.md)\<`OutputSchema`\>

#### Defined in

[post.ts:30](https://github.com/taskylizard/tsky-fork-typedoc-pr/blob/a5370df6192d679fcbec429e409a79d61db0f356/packages/core/src/post.ts#L30)

***

### quotes()

```ts
quotes(params, options?): Paginator<OutputSchema>
```

Get a list of quotes for a given post.

#### Parameters

##### params

`QueryParams`

##### options?

`CallOptions`

#### Returns

[`Paginator`](../../paginate/classes/Paginator.md)\<`OutputSchema`\>

#### Defined in

[post.ts:47](https://github.com/taskylizard/tsky-fork-typedoc-pr/blob/a5370df6192d679fcbec429e409a79d61db0f356/packages/core/src/post.ts#L47)

***

### repostedBy()

```ts
repostedBy(params, options?): Paginator<OutputSchema>
```

Get a list of reposts for a given post.

#### Parameters

##### params

`QueryParams`

##### options?

`CallOptions`

#### Returns

[`Paginator`](../../paginate/classes/Paginator.md)\<`OutputSchema`\>

#### Defined in

[post.ts:64](https://github.com/taskylizard/tsky-fork-typedoc-pr/blob/a5370df6192d679fcbec429e409a79d61db0f356/packages/core/src/post.ts#L64)

***

### threads()

```ts
threads(params, options?): Promise<OutputSchema>
```

Get posts in a thread. Does not require auth, but additional metadata and filtering will be applied for authed requests.

#### Parameters

##### params

`QueryParams`

##### options?

`CallOptions`

#### Returns

`Promise`\<`OutputSchema`\>

#### Defined in

[post.ts:18](https://github.com/taskylizard/tsky-fork-typedoc-pr/blob/a5370df6192d679fcbec429e409a79d61db0f356/packages/core/src/post.ts#L18)

***

### getMany()

```ts
static getMany(
   instance, 
   posts, 
options?): Promise<PostView[]>
```

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

[post.ts:99](https://github.com/taskylizard/tsky-fork-typedoc-pr/blob/a5370df6192d679fcbec429e409a79d61db0f356/packages/core/src/post.ts#L99)

***

### search()

```ts
static search(
   instance, 
   params, 
options?): Paginator<OutputSchema>
```

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

[post.ts:81](https://github.com/taskylizard/tsky-fork-typedoc-pr/blob/a5370df6192d679fcbec429e409a79d61db0f356/packages/core/src/post.ts#L81)
