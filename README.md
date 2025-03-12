<p align="center">
  <img src="https://raw.githubusercontent.com/tsky-dev/tsky/refs/heads/main/.github/assets/tsky-logo.png" width="200" height="200">
</p>

<h1 align="center">tsky</h1>

<p align="center">
  A lightweight, fast, universal and typed Bluesky API wrapper for Apps & Bots.
</p>

## ⚠️ tsky is still in development and is not ready for production use

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

Using a Public Agent

```ts
import { createAgent } from '@tsky/client';

const agent = await createAgent({
  options: {
    service: 'https://public.api.bsky.app',
  },
});

// Getting a user from their handle
// First, we need to get the user's DID
const did = await agent.resolveDIDFromHandle(handle);
// Then, we can get the user's profile
const profile = await agent.actor(did);
```

Using an Authenticated Agent

```ts
import { createAgent } from '@tsky/client';

const agent = await createAgent({
  credentials: {
    identifier: "handle",
      password: "password"
  }
});

// Getting the profile of the authenticated user
const user_profile = await agent.user.profile();
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
