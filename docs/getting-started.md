---
outline: deep
---

# Getting Started

## Installation

::: code-group

```sh [npm]
$ npm add -D tsky
```

```sh [pnpm]
$ pnpm add -D tsky
```

```sh [yarn]
$ yarn add -D tsky
```

```sh [bun]
$ bun add -D tsky
```

:::

## Usage

```ts
import { Tsky } from 'tsky'

const app = new AppBskyNS() // TODO
const tsky = new Tsky(app)

const profile = await tsky.profile('did:plc:giohuovwawlijq7jkuysq5dd')

console.log(profile.handle)
```
