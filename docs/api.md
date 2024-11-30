---
outline: deep
---

# API Reference

## Tsky

### `new Tsky(app: AppBskyNS): Tsky`

Create a new Tsky instance.

```ts
import { Tsky } from 'tsky'

const app = new AppBskyNS() // TODO
const tsky = new Tsky(app)
```

### `tsky.profile(did: string): Promise<Profile>`

Get a profile by DID.

```ts
const profile = await tsky.profile('did:plc:giohuovwawlijq7jkuysq5dd')

console.log(profile.handle)
```
