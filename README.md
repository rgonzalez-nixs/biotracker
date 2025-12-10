# Biotracker Monorepo

Workspaces managed with npm. Apps live under `apps/`.

- `apps/api`: Default NestJS HTTP API.
- `apps/mcp`: NestJS service ready for MCP-specific handlers.
- `apps/web`: React + Mantine client (Vite, TypeScript).

## Getting started

```bash
npm install
npm run dev:api    # http://localhost:3000
npm run dev:mcp    # http://localhost:3030
npm run dev:web    # http://localhost:5173
```

## Scripts (per app)

- API: `npm run build --workspace api`, `npm run lint --workspace api`
- MCP: `npm run build --workspace mcp`, `npm run lint --workspace mcp`
- Web: `npm run build --workspace web`, `npm run lint --workspace web`


