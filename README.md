# TicketForge (Tickets) — Microservices Example

This repository is a compact microservices playground for a ticketing/event platform. It contains small, focused services that are easy to run locally, containerize, and extend.

Key goals:
 - Demonstrate a minimal event-driven microservices layout (auth, event pub/sub, client).
 - Provide clear local and containerized run instructions.
 - Keep services small and easy to reason about for experimentation and learning.
## Table of contents

 - Services
 - Prerequisites
 - Quick start (local)
 - Run with Docker (single service)
 - Run everything with Docker Compose (example)
 - Environment variables (by service)
 - Development notes
 - Project structure
 - Contributing
## Project overview

This repository is a small microservices playground for a Tickets platform. Its goals are:

 - Demonstrate small focused services (auth, event bus (NATS), and client).
 - Provide a reproducible local development experience (TypeScript, Docker, small infra folder for manifests).
 - Showcase patterns: containerization, TypeScript compile targets, clean repo layouts.

Use this repository as a learning / prototype base; treat it as a starting point and extend as needed.
## Services

This repo groups small services at the top-level. Typical folders you will see:

 - `auth/` — authentication microservice (Node.js + TypeScript, Express). Exposes signup, signin, current user, and health endpoints.
 - `nats/` — NATS publisher/subscriber examples (useful to exercise event flows).
 - `client/` — frontend app (React / Vite / Next, depending on what you scaffolded).
 - `common/` — shared types and helper code.
 - `infra/` — optional infra manifests (k8s, docker-compose) and secrets templates.

Each service should contain its own `package.json`, `tsconfig.json` (if TypeScript), and `Dockerfile` when relevant. Prefer reading the service folder for exact scripts and environment variables.
## Prerequisites

 - Node.js (LTS recommended, e.g. 18 or 20)
 - npm (or yarn/pnpm)
 - Docker & Docker Compose (optional — for running containers)
 - Git

Notes: Examples below use PowerShell syntax where appropriate (you're on Windows). On macOS/Linux replace `;` with `&&` when chaining commands.
## Quick start — run locally (recommended for development)

1) Start NATS (for event examples)

```powershell
docker run --rm -p 4222:4222 -p 8222:8222 nats:2.10.0
```

2) Run the auth service

```powershell
cd auth
npm install
npm run dev    # or npm start / npm run build && node dist/index.js depending on the service
```

3) Run the nats examples

```powershell
cd nats
npm install
npm run publish
npm run subscribe
```

4) Run the client

```powershell
cd client
npm install
npm run dev
# open the dev URL printed by the client
```

Check each service's `package.json` for exact script names (`dev`, `start`, `build`) — they may differ.
## Run a single service with Docker

Build and run a service (example: `auth`):

```powershell
cd auth
docker build -t ticketforge-auth:local .
docker run --rm -p 3000:3000 --name ticketforge-auth -e NODE_ENV=production ticketforge-auth:local
```

You can place a `docker-compose.yml` under `infra/` to start multiple services together (example below).
## Environment variables (examples)

Create a `.env` or `.env.local` per-service for local development and never commit secrets. Here are suggested variables used by many setups in this repo:

 - `auth/` example (`auth/.env`)

```
PORT=3000
JWT_KEY=some-super-secret
MONGO_URI=mongodb://localhost:27017/tickets
NATS_URL=http://localhost:4222
NATS_CLUSTER_ID=test-cluster
NATS_CLIENT_ID=auth-service
```

 - `nats/` example (`nats/.env`)

```
NATS_URL=http://localhost:4222
```

 - `client/` example (`client/.env`)

```
VITE_API_URL=http://localhost:3000
```

Add `.env.example` files to each service folder with keys only (no secrets) so contributors know what to provide.
## Development notes and conventions

 - Use TypeScript strict mode when possible. Keep `common/` for shared types.
 - Keep services small and independent. Each service should ideally run independently (its own `package.json`, `tsconfig.json`, and `Dockerfile`).
 - Prefer semantic commits and low-risk pull requests. Add tests where feasible.
## Project structure

```
.
├─ auth/           # auth microservice (Node + TS)
├─ nats/           # nats publisher / subscriber examples
├─ client/         # frontend app
├─ common/         # shared utilities and types
├─ infra/          # infra manifests (k8s, docker-compose)
├─ .gitignore
└─ README.md
```

Add new services using this pattern so other contributors can follow the same conventions.
## Contributing

Thanks for wanting to help! Suggested workflow:

1. Fork the repo and create a branch (`git checkout -b feat/your-feature`).
2. Run and test the relevant service locally.
3. Add tests and update `README` or `ENV` examples as needed.
4. Open a PR with a clear description and testing notes.

Coding conventions

 - Prefer descriptive commits and small PRs.
 - Keep types and shared interfaces in `common/`.
 - Add `*.example` env files when introducing new environment variables.
