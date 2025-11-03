# ADR-0003: Use Spatial Partitioning for Targeting

**Status:** Accepted
**Date:** 2025-11-02

---

## Context

The game design requires weapons to automatically target the "closest" enemy. With potentially hundreds of enemies on screen, a naive `O(n)` search (iterating through every enemy for every turret on every frame) would become a major performance bottleneck and threaten the game's core design pillar of "Escalating Scale."

---

## Decision

We will implement a **Spatial Partitioning** system using a simple uniform grid to optimize the "target closest" query.

-   The game world will be divided into a grid of fixed-size cells.
-   Each enemy will be registered to the cell it occupies.
-   When searching for a target, a turret will only perform a distance check on the enemies located within its own grid cell and the 8 adjacent cells.

This dramatically reduces the number of checks required per frame from `All Enemies` to `Local Enemies`.

---

## Consequences

-   **Positive:**
    -   The performance of the target selection algorithm will be extremely fast and will scale well with a large number of enemies.
    -   Prevents a potential major bottleneck, allowing us to deliver on the promise of "hordes of zombies" without performance degradation.
    -   The same system can be leveraged for other proximity-based queries in the future (e.g., AOE explosions, power-up collection).
-   **Negative:**
    -   This approach is more complex to implement than a simple `for` loop. It requires creating and maintaining the grid data structure. This is a necessary trade-off for performance.
