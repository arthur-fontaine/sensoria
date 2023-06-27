# Sensoria

## Setup

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18.0.0 or higher)
- [pnpm](https://pnpm.io/) (v7.15.0 or higher)

> **Note:**
> To install `pnpm` globally, you can run:
> ```sh
> npm install -g pnpm
> ```

### Install dependencies

You just need to install the dependencies with `pnpm`:

```sh
pnpm install
```

### VSCode setup

You can install the recommended extensions for this project:

1. Open the command palette with `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS).
2. Type `Extensions: Show Recommended Extensions`.
3. Click on the `Install Workspace Recommended Extensions` button (the one with the down arrow in a cloud).

## Development

```sh
pnpm dev
```

By default, the GraphQL server will be running on port `4000` and the React app on port `3000`. You can change the ports by creating a `.env` file with the following content:

```
API_PORT=2023
CLIENT_PORT=2024
```

## Applications and Packages overview

| Name | Description | Location |
| --- | --- | --- |
| `api` | GraphQL server | [`apps/api`](apps/api) |
| `client` | React app | [`apps/client`](apps/client) |

## Contributing guidelines

- **Do** create an issue from a project card with the GitHub button [*Convert to issue*](https://docs.github.com/en/issues/planning-and-tracking-with-projects/managing-items-in-your-project/converting-draft-issues-to-issues).
- **Don't** commit directly to `main` branch.
- **Do** create the new branch with the GitHub button [*Create a new branch for this issue*](https://docs.github.com/en/issues/tracking-your-work-with-issues/creating-a-branch-for-an-issue#creating-a-branch-for-an-issue).
- **Do** follow the *Contributing guidelines* section of the application or package you are working on.
- **Do** write commit messages following [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) guidelines.
