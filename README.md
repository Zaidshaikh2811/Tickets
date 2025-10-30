# Tickets — Microservices Example

A small microservices sample project for building a ticketing platform. This repository contains multiple independently deployable services (authentication, NATS examples, client, infra and shared/common utilities). It's organized for local development, containerized builds, and simple CI/CD workflows.

This README documents the overall project layout, how to run services locally, how to build Docker images, required environment variables, and where to find service-specific README files.

---

## Table of contents

- Project overview
- Services in this repo
- Prerequisites
- Quick start (run locally)
- Run with Docker
- Environment variables (by service)
- Development notes and conventions
- Project structure
- Contributing
- Troubleshooting
- License

---

## Project overview

This repository is a small microservices playground for a Tickets platform. Its goals are:

- Demonstrate small focused services (auth, event publisher/subscriber via NATS, a client app).
- Provide a reproducible local development experience (TypeScript, Docker, small infra folder for manifests).
- Showcase patterns: containerization, TypeScript compile targets, clean repo layouts.

Use this repository as a learning / prototype base; treat it as a starting point and extend as needed.

## Services in this repo

- `auth/` — Authentication microservice (Node.js + TypeScript, Express). Handles signup, signin, current user and health endpoints. Containerized via Dockerfile in the folder.
- `nats/` — Small examples that publish and subscribe to events using NATS (node-nats-streaming). Useful for testing event flows.
- `client/` — Frontend application (React / Vite / Next or other) — static frontend consuming the API.
- `common/` — Shared types, utilities, and code used across services.
- `infra/` — Infrastructure as code (optional) — docker-compose, k8s manifests or bicep/terraform helpers you may add here.

Each service may have its own README with service-specific commands and environment variables. Look inside each folder for details.

## Prerequisites

- Node.js (LTS recommended, e.g. 18 or 20)
- npm (or yarn/pnpm if you prefer)
- Docker & Docker Compose (optional — for running services in containers)
- Git (for cloning and managing the repo)

If you use Windows PowerShell, commands in this README assume PowerShell syntax. Linux/macOS shells use similar commands (replace `;` chained commands with `&&` if desired).

## Quick start — Run services locally

Basic recommended flow:

1. Install dependencies for a service. For example, to run the auth service:

```powershell
cd auth
npm install
npm run build   # if present, builds TypeScript to dist
npm run dev     # or npm start, see service package.json
```

2. Start a NATS server for pub/sub examples (if you have Docker):

```powershell
docker run --rm -p 4222:4222 -p 8222:8222 nats:2.10.0
```

3. In another terminal, run the NATS publisher or subscriber (from the `nats/` folder):

```powershell
cd nats
npm install
npm run publish    # runs publisher example
npm run subscribe  # runs subscriber example
```

4. Open the client (if present):

```powershell
cd client
npm install
npm run dev
# open http://localhost:5173 or the port printed by your dev server
```

Adjust ports and variables per service's README or package.json scripts.

## Run the project with Docker

Each service has a `Dockerfile` (for example `auth/Dockerfile`). Build and run a service image like:

```powershell
cd auth
docker build -t tickets-auth:local .
docker run --rm -p 3000:3000 --name tickets-auth -e NODE_ENV=production tickets-auth:local
```

To run several services together you can add a `docker-compose.yml` in `infra/` or the repository root. Example `infra/docker-compose.yml` (not included by default) should define services for `nats`, `auth` and `client` and wire ports and environment variables.

## Environment variables (by service)

Below are the typical variables each service may expect. Check each service's code or `package.json` for exact names.

- Auth service (`auth/`)
  - `PORT` — port to listen on (default: 3000)
  - `JWT_KEY` — secret used to sign JWTs
  - `MONGO_URI` — (if the service uses MongoDB)
  - `NATS_URL` / `NATS_CLUSTER_ID` / `NATS_CLIENT_ID` — for publishing/subscribing events

- NATS examples (`nats/`)
  - `NATS_URL` — e.g. `http://localhost:4222`

- Client (`client/`)
  - `VITE_API_URL` or `REACT_APP_API_URL` — URL for the backend API

Create a `.env` or `.env.local` in each service folder for local development and never commit them. A sample `.env.example` file checked in is recommended so other developers know what keys are needed.

## Development notes and conventions

- TypeScript is used throughout the services. Each service should include a `tsconfig.json` tuned for that service. Common types and interfaces can live in `common/`.
- Prefer small, single-responsibility services; keep surface area minimal.
- Follow the repository naming style: package folders at root, service-local package.json and Dockerfile.

## Project structure

Top-level layout (typical):

```
.
├─ auth/           # auth microservice (Node + TS)
├─ nats/           # nats publisher / subscriber examples
├─ client/         # frontend app
├─ common/         # shared types/libs
├─ infra/          # deployment manifests / docker-compose
├─ .gitignore
└─ README.md
```

If you add new services, follow the same pattern: service folder with `package.json`, `src/`, `tsconfig.json`, and `Dockerfile`.

## Contributing

Contributions are welcome. Suggested workflow:

1. Fork the repository and create a topic branch: `git checkout -b feat/your-feature`
2. Make changes and run the relevant service locally.
3. Add tests if applicable and run them.
4. Open a pull request with a clear description and link to any issue.

Coding style:

- Use TypeScript strict mode where possible.
- Keep functions small and pure where feasible.
- Document public functions and types in `common/`.

## Troubleshooting

- If TypeScript or ts-node-dev complains about ESM vs CJS ("Must use import to load ES Module"), check the `package.json` `type` field and `tsconfig.json` `module` setting. Either set `type: "module"` and use ESM imports or switch to CommonJS (`type: "commonjs"`) and `require()`/`module.exports` where appropriate. For development using `ts-node-dev` on Windows, `type: "commonjs"` is usually more straightforward.
- If Docker images fail to build due to native modules, ensure build tools are installed in the image (e.g., `python3`, `make`, `g++`) in the build stage.
- Port conflicts: ensure no other process occupies the same ports (3000, 4222, etc.) or change service `PORT` env var.

## License

This repository does not include a license by default. Add a `LICENSE` file (MIT, Apache-2.0, etc.) to clarify the terms under which the code is shared.

---

If you'd like, I can:

- Generate a `README` per-service (e.g., `auth/README.md`) with exact environment variables and npm scripts pulled from `package.json`.
- Add a `docker-compose.yml` into `infra/` that wires `nats`, `auth`, and `client` together for easy local startup.
- Add `.env.example` files for `auth/` and `nats/`.

Tell me which of the above you'd like next and I will implement it.
