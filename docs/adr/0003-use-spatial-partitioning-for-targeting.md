# ADR-0003: Use Spatial Partitioning for Targeting

**Status:** Accepted
**Date:** 2025-11-02

---

## Context

The game design requires weapons to automatically target the "closest" enemy. With potentially hundreds of enemies on screen, a naive `O(n)` search (iterating through every enemy for every turret on every frame) would become a major performance bottleneck and threaten the game's core design pillar of "Escalating Scale."

---

## Decision

We will implement a **Spatial Partitioning** system using a simple uniform grid to optimize proximity queries for targeting. This system acts as a foundational optimization layer.

-   The game world will be divided into a grid of fixed-size cells.
-   Each enemy will be registered to the cell it occupies.
-   Each turret will use its own world position as the origin for its query. This inherently supports turrets being located on different train cars.
-   When searching for potential targets, a turret will first check for enemies within its own grid cell and the 8 adjacent cells (a 3x3 area).
-   If no enemies are found in the initial 3x3 search, the search will expand outwards layer by layer (to 5x5, then 7x7, etc.) until at least one enemy is found or a maximum search range is reached.

This dramatically reduces the number of entities that need to be considered for targeting from `All Enemies` to a small subset of `Local Enemies`.

---

## Consequences

-   **Positive:**
    -   The performance of finding a list of nearby enemies will be extremely fast and will scale well with a large number of entities.
    -   Prevents a major performance bottleneck, allowing us to deliver on the "hordes of zombies" design pillar.
    -   The same system can be leveraged for other proximity-based queries (e.g., AOE explosions, power-up collection).

-   **Negative:**
    -   This approach is more complex to implement than a simple `for` loop. It requires creating and maintaining the grid data structure. This is a necessary trade-off for performance.

-   **Future-Proofing for Advanced Targeting:**
    -   This system is not the *entirety* of the targeting logic, but rather a highly efficient **first pass** to find a small list of candidate targets.
    -   Future, more complex targeting modes (e.g., "target highest health," "target densest cluster") will operate on the small, localized list of enemies provided by this spatial partitioning system. This ensures that even computationally expensive targeting logic remains performant because it will only ever run on a handful of potential targets, not the entire population.
