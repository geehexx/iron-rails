# 03: AI and Algorithm Analysis

This document analyzes the algorithmic choices for core game mechanics, focusing on performance and scalability, particularly for the auto-targeting system.

---

## Efficient "Target Closest" Algorithm

The GDD specifies that the train's auto-cannons will always target the "closest" enemy. With the potential for hundreds of enemies on screen, the algorithm used for this check must be highly efficient to avoid causing frame rate drops.

### The Naive Approach: Full Scan

The most straightforward approach is to iterate through every enemy, calculate its distance to the turret, and keep track of the closest one found.

```typescript
// Pseudocode for a naive full scan
let closestEnemy = null;
let minDistance = Infinity;

for (const enemy of allEnemies) {
    const distance = calculateDistance(turret.position, enemy.position);
    if (distance < minDistance) {
        minDistance = distance;
        closestEnemy = enemy;
    }
}
// closestEnemy is now the target.
```

- **Complexity:** `O(n)`, where `n` is the number of enemies.
- **Pros:**
  - Simple to implement and understand.
- **Cons:**
  - **Inefficient at Scale:** If there are 100 enemies and 5 turrets, this loop runs 500 times per frame. While modern JavaScript engines are fast, this can become a significant bottleneck, especially alongside physics and rendering calculations.
  - **Wasted Calculations:** It checks every single enemy, even those that are clearly too far away to be a viable target.

### Recommendation 1: Array Sort (Simple Improvement)

A slight improvement is to sort the entire array of enemies by distance. The closest enemy is then simply the first element in the sorted array.

```typescript
// Pseudocode for sorting
allEnemies.sort((a, b) => {
    const distA = calculateDistance(turret.position, a.position);
    const distB = calculateDistance(turret.position, b.position);
    return distA - distB;
});

const closestEnemy = allEnemies[0];
```

- **Complexity:** `O(n log n)` due to the sort operation.
- **Pros:**
  - Still relatively simple to implement.
- **Cons:**
  - **Slower than a Full Scan:** For the simple case of finding only the single closest enemy, this is actually *less* performant than the naive approach.
  - **Limited Use Case:** This method only becomes efficient if you need to know the closest *k* enemies (e.g., for a multi-target weapon), not just the single closest one.

### Recommendation 2: Spatial Partitioning (Best Practice)

This is the **strongly recommended** approach for any game with a large number of entities. Spatial partitioning involves dividing the game world into a data structure that makes it very fast to query for objects in a specific area.

#### Method: Simple Grid Partition

A simple and highly effective method is a uniform grid.

1. **Setup:** We divide the game world into a grid of fixed-size cells (e.g., 100x100 pixels).
2. **Update:** Every frame (or every few frames), we iterate through all enemies and store them in a list associated with the grid cell they currently occupy.
3. **Query:** To find the closest enemy, the turret does the following:
    a.  Gets its own grid cell.
    b.  Searches for enemies *only* within its own cell and its 8 neighboring cells.
    c.  It performs the simple "naive scan" on this much smaller subset of enemies.

![A diagram showing a 3x3 grid centered on the player/turret. The search for the closest enemy is limited to the enemies within these 9 cells, ignoring all others.](https://i.imgur.com/7g6Y5hV.png)

- **Complexity:** `O(1)` for the query, assuming a reasonable distribution of enemies. The cost is in the initial update step, which is `O(n)`, but this is a much faster `O(n)` operation than the distance calculations.
- **Pros:**
  - **Extremely Fast Queries:** The search space is dramatically reduced. Instead of checking 100s of enemies, a turret might only need to check the 5-10 enemies in its local grid neighborhood.
  - **Scales Well:** This approach handles a very large number of entities with minimal performance degradation.
- **Cons:**
  - More complex to implement than a simple loop.
  - Requires tuning the grid cell size to the game's scale.

#### Alternative: Quadtree

A quadtree is a more advanced spatial partitioning method that recursively subdivides space. It's more efficient for sparsely populated worlds but can be more complex to implement and may be overkill for this game's 2D side-scrolling nature where a simple grid will suffice.

### Final Recommendation

Implement a **Simple Grid Partition** system. The initial implementation effort is a worthwhile investment that will completely solve the performance problem of target selection at scale, ensuring the game can handle the "hordes of zombies" design pillar without performance issues.
