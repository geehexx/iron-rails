# Initiative: V2.0 Loadout Expansion Implementation

**Status:** Proposed
**Created:** 2025-11-02
**Owner:** Development Team
**Priority:** Medium

---

## 1. Objective

To introduce horizontal progression and deeper strategic choice by allowing players to customize their train. This initiative adds new train cars, specialized weapons, and new enemy types to challenge the player's custom builds.

---

## 2. Success Criteria

- [ ] Players can purchase and add new train cars (Cargo Car, Gun Car) at the Upgrade Station.
- [ ] The train's game logic correctly handles multi-car trains, including the rearmost car taking damage first.
- [ ] New specialized weapons (Gatling, Cannon) can be acquired and equipped onto "Hardpoint" slots on Gun Cars.
- [ ] New enemy types (Bloater, Runner) are implemented and added to the zombie spawn tables.
- [ ] The Upgrade Station UI is updated to support train car and weapon loadout management.

---

## 3. Scope

### In Scope

-   Implementation of all features as defined in the "Phase 2: Building and Loadout (V2.0)" section of `02_Future_Versions.md`.
-   Refactoring the `Train` object to be a collection of `TrainCar` objects.
-   A drag-and-drop or similar UI for managing weapon loadouts.
-   Creating the `Bloater` and `Runner` enemy classes with their unique behaviors.

### Out of Scope

-   Any features from V3.0 (Specialized Modules, advanced targeting AI, etc.).
-   Rearranging the order of train cars (the GDD specifies a fixed order for now).

---

## 4. Phases & Tasks

### Phase 1: Train Refactor

- [ ] Refactor the `Train` class into a parent controller that manages a list of `TrainCar` objects.
- [ ] Create subclasses for `EngineCar`, `GunCar`, and `CargoCar`.
- [ ] Implement the damage propagation logic (damage hits the last car first).

### Phase 2: Loadout & New Content

- [ ] Implement the `Gatling` and `Cannon` weapon types.
- [ ] Implement the `Bloater` and `Runner` enemy types.
- [ ] Update the zombie spawning system to include the new enemy types in later-game waves.

### Phase 3: UI and Integration

- [ ] Update the `UpgradeScene` UI to include a new tab or section for purchasing train cars.
- [ ] Create a new UI screen or modal for managing weapon loadouts on Gun Cars.
- [ ] Ensure the player's custom train configuration is correctly saved and loaded between runs.

---

## 5. Risks and Mitigation

| Risk | Likelihood | Mitigation Strategy |
| :--- | :--- | :--- |
| Refactoring the train logic is complex and could introduce bugs. | High | Dedicate time to this task and write unit tests (using Vitest) for the new `Train` and `TrainCar` classes to ensure the damage logic is correct before integrating it into the main game. |
| The new enemies are either too weak or too powerful. | Medium | As with all game balance, expose enemy stats as easily tunable constants. The goal is to make them functionally different, with fine-tuning to come later. |

---

## 6. Related Documentation

-   **Game Design:** [02-future-versions.md](../../gdd/02-future-versions.md)
