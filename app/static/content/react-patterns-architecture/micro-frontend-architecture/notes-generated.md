# Micro-Frontend Architecture

## What is Micro-Frontend Architecture?
- Micro-frontends apply the microservices concept to the frontend, breaking a large app into smaller, independently developed and deployed pieces.
- Each team can own a feature or domain, building, testing, and deploying it independently.

## Key Concepts
- **Decomposition:** Split the UI into semi-independent "verticals" (e.g., cart, search, profile).
- **Integration:** Compose micro-frontends at runtime (client-side, server-side, or edge).
- **Autonomy:** Teams choose their own tech stack, release cycles, and deployment pipelines.
- **Shared Contracts:** Agree on APIs, events, and shared libraries for interoperability.

## Integration Patterns
- **Build-time:** Merge micro-frontends at build (e.g., npm packages, monorepo).
- **Run-time:** Load micro-frontends dynamically (e.g., iframes, Web Components, Module Federation).
- **Server-side:** Compose HTML on the server (Edge Side Includes, SSR).

## Challenges
- **Shared State:** Managing global state and cross-app communication.
- **Routing:** Coordinating navigation and deep linking.
- **Performance:** Avoiding duplicated dependencies and excessive network requests.
- **Consistency:** Maintaining a unified look and feel.

## Example Technologies
- Module Federation (Webpack 5)
- Single-SPA
- Web Components
- Iframes (legacy, less common now)

## Summary
- Micro-frontends enable independent development and deployment, but require careful integration, shared contracts, and governance.