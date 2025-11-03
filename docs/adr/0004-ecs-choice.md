# ADR-0004: Use bitecs for Entity Component System (ECS)

**Status:** Accepted
**Date:** 2025-11-03

---

## Context

The project requires a minimal, high-performance, and low-dependency Entity Component System (ECS) library that is well-suited for browser-based games. A data-oriented design is preferred to decouple game logic from the rendering engine.

---

## Decision

We will use **bitecs** as the project's official ECS library.

- **Minimal API:** bitecs provides a small, focused API that is easy to learn and integrate.
- **High Performance:** It is designed for performance and avoids unnecessary allocations and garbage collection.
- **Data-Oriented:** It enforces a data-oriented approach, which aligns with our goal of separating game logic from rendering.

---

## Consequences

- **Positive:**
  - Game logic will be implemented as data-oriented systems, which will be easier to test and reason about.
  - The performance characteristics of bitecs will help us achieve our goal of supporting numerous entities.
  - The small size of the library will help keep the final bundle size down.

- **Negative:**
  - A thin adapter layer will need to be implemented to synchronize the state of ECS components (e.g., position, rotation) with their corresponding Phaser game objects (e.g., sprites). This is a manageable and necessary task.
