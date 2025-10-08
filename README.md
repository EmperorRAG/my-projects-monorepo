# My Projects Monorepo

> A monorepo for managing my personal projects, including a Next.js application, a NestJS microservice, and shared utility libraries.

This workspace is managed by [Nx](https://nx.dev).

## Projects

This monorepo contains the following projects:

- **`apps/my-programs-app`**: A Next.js application serving as the main user interface.
- **`apps/my-programs-app-e2e`**: Playwright end-to-end tests for the `my-programs-app`.
- **`libs/utilities`**: A shared library for common functions and types used across the monorepo.
- **`services/my-nest-js-email-microservice`**: A NestJS microservice responsible for handling email-related functionalities.
- **`services/my-nest-js-email-microservice-e2e`**: End-to-end tests for the email microservice.

## Getting Started

### Prerequisites

- [pnpm](https://pnpm.io/installation)
- [Node.js](https://nodejs.org/) (version specified in `.nvmrc`)

### Installation

1. Clone the repository.
2. Install dependencies using pnpm:

    ```sh
    pnpm install
    ```

## Development

To run the development server for the main application:

```sh
npx nx dev my-programs-app
```

## Building

To build a specific project for production:

```sh
npx nx build <project-name>
```

For example, to build the Next.js application:

```sh
npx nx build my-programs-app
```

## Testing

To run tests for a specific project:

```sh
npx nx test <project-name>
```

To run end-to-end tests:

```sh
npx nx e2e my-programs-app-e2e
```

## AI Agent Instructions

This repository is designed to be understood by AI agents. Key instructions and context can be found in the following files:

- `AGENTS.md`: High-level instructions for AI agents interacting with this repository.
- `llms.txt`: A mapping of important files and directories to guide language models.
- `docs/adr/`: Contains Architectural Decision Records (ADRs) that document key architectural choices.
