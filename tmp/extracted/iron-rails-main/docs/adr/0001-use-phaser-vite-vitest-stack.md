# ADR-0001: Use Phaser, Vite, and Vitest Tech Stack

**Status:** Accepted
**Date:** 2025-11-02

---

## Context

The project requires a modern, efficient, and well-supported technology stack to enable the rapid development of a high-performance 2D web game. Key considerations are development speed, rendering performance, testing capabilities, and TypeScript integration.

---

## Decision

We will adopt the following technical stack:

- **Game Framework:** **Phaser**. A feature-rich 2D game framework that handles rendering, physics, and assets, accelerating development.
- **Build Tool:** **Vite**. A modern build tool offering extremely fast hot-reloading and first-class TypeScript support, which improves the developer workflow.
- **Testing Framework:** **Vitest**. A fast, Jest-compatible testing framework that integrates seamlessly with Vite.
- **Language:** **TypeScript**. For static typing to improve code quality and maintainability.

---

## Consequences

- **Positive:**
  - We can develop features quickly by leveraging Phaser's extensive APIs.
  - The development feedback loop will be very fast due to Vite.
  - Code quality will be higher and bugs will be reduced thanks to TypeScript.
  - We have a clear path for writing unit and integration tests with Vitest.
- **Negative:**
  - We are dependent on the Phaser framework's architecture and release cycle. This is a standard trade-off for using any third-party engine.
