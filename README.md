<p align="center">
  <img src=".github/assets/tsky-logo.png" width="200" height="200">
</p>

<h1 align="center">tsky</h1>

<p align="center">
  A lightweight, fast, universal and typed Bluesky API wrapper for Apps & Bots.
</p>

## ⚠️ tsky is still in development and is not ready for production use.

tsky is still in active development and is not ready for production use. If you want to contribute to the project, please read the [CONTRIBUTING.md](CONTRIBUTING.md) file or join our [Discord Server](https://discord.gg/KPD7XPUZn3).

tsky is a lightweight, fast, universal and typed Bluesky API wrapper for Apps & Bots. It's designed to be easy to use, lightweight and straightforward to use. It's built with TypeScript and has full type support.

It was primarily built for the [Nimbus Client](https://github.com/nimbus-town/nimbus) but can be used in any other project that requires Bluesky API integration.

## Installation

```bash
# NPM
npm install tsky

# Yarn
yarn add tsky

# PNPM
pnpm add tsky

# Bun
bun add tsky
```

## Usage

Use an identity & password login:

```ts
import { Tsky } from 'tsky';
import { CredentialManager } from '@atcute/client';

const manager = new CredentialManager({ service: 'https://bsky.social' });
await manager.login({
  identifier: 'alice.tsky.dev',
  password: 'password',
});
```

or the [@atcute/oauth-browser-client](https://github.com/mary-ext/atcute/tree/trunk/packages/oauth/browser-client):

```ts
import { Tsky } from 'tsky';
import { OAuthUserAgent, finalizeAuthorization } from '@atcute/oauth-browser-client';

// get a session as described at: https://github.com/mary-ext/atcute/tree/trunk/packages/oauth/browser-client

const manager = new OAuthUserAgent(session);
```

and then initialize the tsky client:

```ts
const tsky = new Tsky(manager);

// get the profile of a user
const profile = await tsky.bsky.profile('did:plc:giohuovwawlijq7jkuysq5dd');

console.log(profile.handle);
```

## Links

- [📚 tsky Documentation](https://tsky.dev/)
- [🦋 tsky on Bluesky](https://bsky.app/profile/tsky.dev)
- [📣 tsky Discord Server](https://discord.gg/KPD7XPUZn3)
- [🦋 Nimbus on Bluesky](https://bsky.app/profile/nimbus.town)

## Contributing

If you want to contribute to this project, please read the [CONTRIBUTING.md](CONTRIBUTING.md) file.

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/tsky-dev/tsky/blob/main/LICENSE) file for details.
