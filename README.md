

# Tickets — Microservices 

### *Event-Driven Microservices with Node.js, TypeScript, NATS, Kubernetes & Next.js*

<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/Node.js-18.x-43853D?style=for-the-badge&logo=node.js&logoColor=white"/></a>
  <a href="#"><img src="https://img.shields.io/badge/TypeScript-Microservices-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/></a>
  <a href="#"><img src="https://img.shields.io/badge/NATS-Event%20Bus-1997B5?style=for-the-badge&logo=natsdotio&logoColor=white"/></a>
  <a href="#"><img src="https://img.shields.io/badge/Kubernetes-Local%20Dev-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white"/></a>
  <a href="#"><img src="https://img.shields.io/badge/Skaffold-Auto%20Builds-1A73E8?style=for-the-badge&logo=google-cloud&logoColor=white"/></a>
  <a href="#"><img src="https://img.shields.io/badge/Next.js-Frontend-000000?style=for-the-badge&logo=next.js&logoColor=white"/></a>
  <a href="#"><img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge"/></a>
</p>

<p align="center">
  A clean, production-style microservices architecture for learning **distributed systems**,  
  **event-driven design**, **NATS Streaming**, and **Kubernetes development workflows**.
</p>

---

#  **Tech Stack**

<p align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" width="55" />&nbsp;&nbsp;
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" width="55" />&nbsp;&nbsp;
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg" width="55" />&nbsp;&nbsp;
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" width="55" />&nbsp;&nbsp;
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" width="55" />&nbsp;&nbsp;
</p>

---

#  **Services Included**

```
.
├── auth/        → JWT authentication
├── tickets/     → Ticket creation & management
├── orders/      → Ticket reservation workflow
├── payments/    → Payment confirmation workflow
├── client/      → Next.js frontend
├── common/      → Shared utilities & event definitions
├── nats/        → Examples + test utilities
├── infra/       → Kubernetes manifests + Skaffold
└── diagrams/    → Architecture & flow diagrams
```

---

#  **Service-to-Service Flow (Click to Expand)**

<details>
<summary><strong>View System Flow</strong></summary>

###  **High-Level Service Flow**

```mermaid
flowchart TD
  User --> Browser
  Browser -->|HTTP Request| Ingress

  Ingress --> Auth
  Ingress --> Tickets
  Ingress --> Orders
  Ingress --> Payments

  Tickets -->|publish: TicketCreated| NATS
  NATS --> Orders
  Orders -->|publish: OrderCreated| NATS
  NATS --> Payments
  Payments -->|publish: PaymentCompleted| NATS
  NATS --> Orders
  NATS --> Tickets

  subgraph DBs
    A[(Auth DB)]
    T[(Tickets DB)]
    O[(Orders DB)]
    P[(Payments DB)]
  end

  Auth --> A
  Tickets --> T
  Orders --> O
  Payments --> P
```

**Flow Summary:**

* User creates a ticket → `TicketCreated` event published
* Orders service listens → creates order → emits `OrderCreated`
* Payments service listens → processes payment → emits `PaymentCompleted`
* Tickets & Orders update state accordingly
* Entire system stays **eventually consistent**

</details>

---

#  **Sequence Diagram — How Events Work**

```mermaid
sequenceDiagram
    participant C as Client (Browser)
    participant I as Ingress Controller
    participant T as Tickets Service
    participant N as NATS Streaming
    participant O as Orders Service
    participant P as Payments Service

    C->>I: HTTP POST /api/tickets
    I->>T: Forward request to Tickets
    T->>T: Create ticket in DB
    T->>N: Publish TicketCreated event

    N->>O: Deliver TicketCreated
    O->>O: Create Order
    O->>N: Publish OrderCreated

    N->>P: Deliver OrderCreated
    P->>P: Process payment
    P->>N: Publish PaymentCompleted

    N->>O: Deliver PaymentCompleted
    O->>O: Mark Order complete

    N->>T: Deliver PaymentCompleted
    T->>T: Mark ticket as reserved/sold
```

---

#  **Quick Start**

### 1️ Start Infra

```bash
docker run --rm -p 4222:4222 -p 8222:8222 nats:2.10.0
docker run --rm -p 27017:27017 mongo:latest
```

### 2️ Run a service

```bash
cd auth
npm install
npm run dev
```

---

#  **Docker**

```bash
cd tickets
docker build -t tickets-tickets:local .
docker run --rm -p 3000:3000 tickets-tickets:local
```

---

#  **Kubernetes + Skaffold**

```bash
skaffold dev
```

* Auto rebuild
* Auto deploy
* Auto sync changes

Default host: **ticketforge.local**

---

#  **Environment Variables**

Example:

```
PORT=3000
JWT_KEY=your_jwt_secret
MONGO_URI=mongodb://localhost:27017/authdb
NATS_URL=nats://localhost:4222
```

---

#  **Testing**

```bash
npm test
```

Uses:

* Jest
* Supertest
* `mongodb-memory-server`


---

#  **Contributing**

* Fork → Branch → Commit → PR
* Add tests for each change
* Update `.env.example` when new config is added

---

#  **License**

MIT License

