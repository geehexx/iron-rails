# Initiative: V1.0 Core Prototype Implementation

**Status:** Proposed
**Created:** 2025-11-02
**Owner:** Development Team
**Priority:** High

---

## 1. Objective

To build the initial, "zero-player" V1.0 prototype of the Iron Rails game. The primary goal is to implement the core auto-combat and physics mechanics as defined in the GDD to validate that the game is engaging to *watch* before adding deeper player agency.

---

## 2. Success Criteria

- [ ] A runnable web application is created using the recommended Phaser, Vite, and TypeScript stack.
- [ ] The train game object is rendered and automatically accelerates to a max speed.
- [ ] Zombie game objects are spawned and move towards the train.
- [ ] The train's ramming and the sentry gun's auto-firing mechanics are functional.
- [ ] The core gameplay loop is complete: the game can be won by reaching a target distance or lost when the train's HP reaches zero.
- [ ] The basic HUD (HP, Speed, Distance) is implemented and correctly reflects the game state.

---

## 3. Scope

### In Scope

-   Setting up the initial project structure, build tools, and dependencies (Phaser, Vite, Vitest).
-   Implementation of all game components as defined in the `01_V1_Core_Prototype.md` document.
-   Basic visual and audio feedback ("juice") for key events like collisions and weapon fire.

### Out of Scope

-   Any features from V1.5 or later, including currency, the upgrade station, new train cars, or new enemy types.
-   Advanced procedural generation for the environment (a simple repeating track is sufficient).
-   Mobile-specific optimizations or UI.

---

## 4. Phases & Tasks

### Phase 1: Project Foundation

- [ ] Initialize a new Vite + TypeScript project.
- [ ] Install and configure Phaser and Vitest.
- [ ] Create the recommended directory structure (`/src/scenes`, `/src/gameObjects`, `/src/systems`).
- [ ] Set up a basic `BootScene` to load assets and a `GameScene` for the main game.

### Phase 2: Core Gameplay Implementation

- [ ] Create the `Train` game object class with properties for mass, speed, and HP.
- [ ] Implement the `Zombie` game object class with basic movement and on-death explosion logic.
- [ ] Implement a simple zombie spawning system.
- [ ] Implement the automatic train acceleration and the momentum-based slowdown physics on collision.
- [ ] Create the `SentryGun` weapon and attach it to the train.
- [ ] Implement the auto-fire logic using a spatial partitioning system to find the closest target.

### Phase 3: HUD and Game State Management

- [ ] Implement the HTML/CSS HUD on top of the game canvas, as described in the technical analysis.
- [ ] Connect the HUD elements to the game state (displaying the train's current HP, speed, and distance traveled).
- [ ] Implement the win condition (reaching a set distance) and the loss condition (HP reaching zero).

---

## 5. Risks and Mitigation

| Risk | Likelihood | Mitigation Strategy |
| :--- | :--- | :--- |
| The physics "feel" is not satisfying. | Medium | The momentum-based formula should be tunable. Expose variables like `CollisionImpact` as constants that can be easily tweaked during playtesting. |
| Performance issues with many zombies. | Low | Proactively mitigate this by implementing object pooling and spatial partitioning from the very beginning, as decided in the ADRs. |

---

## 6. Related Documentation

-   **Game Design:** [01-v1-core-prototype.md](../../gdd/01-v1-core-prototype.md)
-   **Technical Stack:** [ADR-0001: Use Phaser, Vite, and Vitest Tech Stack](../../adr/0001-use-phaser-vite-vitest-stack.md)
-   **Targeting Algorithm:** [ADR-0003: Use Spatial Partitioning for Targeting](../../adr/0003-use-spatial-partitioning-for-targeting.md)
