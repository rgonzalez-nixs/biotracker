# Biotracker Monorepo

Workspaces managed with npm. Apps live under `apps/`.

- `apps/api`: Default NestJS HTTP API.
- `apps/mcp`: NestJS service ready for MCP-specific handlers.
- `apps/web`: React + Mantine client (Vite, TypeScript).

## Getting started

add ./apps/web/.env
```
VITE_API_BASE_URL=http://localhost:3000
VITE_MCP_BASE_URL=http://localhost:3030
```

add .apps/mcp/.env
```
FRONTEND_URL=http://localhost:5173
PORT=10100
OPENAI_API_KEY=<your openai api key>
```

add .apps/api/.env
```
FRONTEND_URL=http://localhost:5173
PORT=10101
```

run:
```bash
npm install

# Run locally
npm run dev:api    # http://localhost:3000
npm run dev:mcp    # http://localhost:3030
npm run dev:web    # http://localhost:5173

# Run production
npm run build:api && npm run run:api
npm run build:mcp && npm run run:mcp
npm run build:web && npm run run:web
```

## Architecture

The project utilizes a microservices architecture composed of three distinct units:

- apps/api: A service dedicated to managing patient records and biotracker data ingestion.

- apps/MCP: A specialized service focused on biotracker analysis and processing.

- apps/web: The client-side application.

### Rationale for Service Separation

The decision to decouple the API from the MCP (Model Context Protocol) service was driven by the need to isolate resource-intensive operations from real-time data handling.

In a unified system, processing complex MCP tasks could block the event loop or consume resources required for real-time updates. By separating these concerns, the architecture ensures that sudden surges in user traffic do not degrade the performance of long-running analysis tasks, and conversely, that heavy analysis does not impact the latency of the API.

## MCP Server Implementation

The MCP server is built using Nest.js and @rekog/MCP-nest. This stack was selected to enforce strict architectural patterns, ensuring long-term maintainability and code readability.

The core logic is encapsulated within the MCP-tools.tools.ts file, which exposes two primary public methods:

- analyze_biotracker

- suggest_monitoring_priorities

### Workflow

Each tool follows a standard execution pipeline: receiving raw input, formatting it into a context-aware prompt for OpenAI, executing the prompt, and returning the structured result.

> Note: While the current proof-of-concept architecture successfully delivers actionable insights, a production-grade environment would likely benefit from migrating to a robust Cloud MCP architecture.

### Tool Strategy

The system exposes Biomarker Analysis and Monitoring Prioritization as distinct, atomic tools. This granular decoupling allows the client to request specific analyses independently, rather than forcing a monolithic execution of all analytical processes at once.

## Technical Design Decisions

Given the project's focus on efficient inter-service communication and data flow, the technology stack was prioritized to maximize development velocity and reliability.

- Backend: Leveraging Nest.js and @rekog/MCP-nest provided a structured framework that minimized boilerplate.

- Frontend: TanStack Query was utilized for efficient server-state management.

These choices streamlined the implementation of standard features, allowing my development effort to focus on solving complex problems regarding service orchestration and reliable data transmission.

## To be done

As improvement, I believe I should implement a better communication solution between the api and mcp as microservices, to enhance security and simplify data handling.