# Contributing

## How to contribute

1. Fork the repository and clone it to your local machine
2. Create a branch for your changes - an optimal name would be `fix/XYZ` or `feature/XYZ` where `XYZ` is a short description of the changes
3. Make your changes locally
4. Link your local repository to a project you want to test your changes on via `pnpm link path/to/tsky/core`
5. Test your changes
6. Write tests if possible and necessary (if you are not sure, ask in the pull request), also make sure your new changes are covered by the existing tests
7. Make sure your changes conform to the linting and formatting rules via `pnpm run lint` && `pnpm run format`, if necessary run `pnpm run lint:fix` and `pnpm run format:fix` to automatically fix the issues that are automatically fixable
8. Commit your changes using [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) - this will be important for automatic versioning and changelog generation
9. Push your changes to your fork
10. Create a pull request, describe your changes, link to issues you are fixing and wait for a review
11. If your changes are approved, they will be merged into the main repository

## How to test your changes

1. Link your local repository to a project you want to test your changes on via `pnpm link path/to/tsky/core`
2. Run `pnpm run dev` in your tsky repository to start the development build of the tsky
3. Run your test project and test your changes
4. Write tests if possible and necessary (if you are not sure, ask in the pull request), also make sure your new changes are covered by the existing tests
5. If you are satisfied with your changes, you can create a pull request

## Contribution guidelines

- **Branch naming**: When creating a branch for your changes, an optimal name would be `fix/XYZ` or `feature/XYZ` where `XYZ` is a short description of the changes.
- **Code quality**: Make sure your changes are of high quality and conform to the existing codebase.
- **Conventional Commits**: We use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for our commit messages. This is important for automatic versioning and changelog generation.
- **Issues**: If you are fixing an issue, make sure to link the issue in your pull request.
- **Linting & Formatting**: We use [Biome](https://biomejs.dev/) for linting and formatting. Make sure your changes conform to the linting and formatting rules via `pnpm run lint` && `pnpm run format`, if necessary run `pnpm run lint:fix` and `pnpm run format:fix` to automatically fix the issues that are automatically fixable.
- **Package Management**: We use [pnpm](https://pnpm.io/) for package management. Make sure to use `pnpm` instead of `npm` or `yarn` for installing packages.
- **Stay respectful**: Always stay respectful and constructive in your communication with other contributors and maintainers and respect their opinions and decisions.
- **Testing**: We use [Vitest](https://vitest.dev/) for testing. Make sure to write tests for your changes if possible and necessary (if you are not sure, ask in the pull request), also make sure your new changes are covered by the existing tests.