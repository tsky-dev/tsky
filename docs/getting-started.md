---
outline: deep
---

# Getting Started

## Installation

```bash
$ npm add tsky
```

## Usage

```ts
import { Tsky } from 'tsky'


const app = new AppBskyNS(); // TODO
const tsky = new Tsky(app);

const profile = await tsky.profile('did:plc:giohuovwawlijq7jkuysq5dd');

console.log(profile.handle);
```
