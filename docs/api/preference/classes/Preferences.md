[**preference**](../index.md)

***

[tsky](../../index.md) / [preference](../index.md) / Preferences

# Preferences

## Constructors

### new Preferences()

```ts
new Preferences(instance): Preferences
```

#### Parameters

##### instance

`AppBskyNS`

#### Returns

[`Preferences`](Preferences.md)

#### Defined in

[preference.ts:8](https://github.com/taskylizard/tsky-fork-typedoc-pr/blob/a5370df6192d679fcbec429e409a79d61db0f356/packages/core/src/preference.ts#L8)

## Methods

### get()

```ts
get(options?): Promise<Preferences>
```

Get private preferences attached to the current account. Expected use is synchronization between multiple devices, and import/export during account migration. Requires auth.

#### Parameters

##### options?

`CallOptions`

#### Returns

`Promise`\<`Preferences`\>

#### Defined in

[preference.ts:13](https://github.com/taskylizard/tsky-fork-typedoc-pr/blob/a5370df6192d679fcbec429e409a79d61db0f356/packages/core/src/preference.ts#L13)

***

### set()

```ts
set(preferences, options?): Promise<void>
```

Set the private preferences attached to the account.

#### Parameters

##### preferences

`Preferences`

##### options?

`CallOptions`

#### Returns

`Promise`\<`void`\>

#### Defined in

[preference.ts:22](https://github.com/taskylizard/tsky-fork-typedoc-pr/blob/a5370df6192d679fcbec429e409a79d61db0f356/packages/core/src/preference.ts#L22)
