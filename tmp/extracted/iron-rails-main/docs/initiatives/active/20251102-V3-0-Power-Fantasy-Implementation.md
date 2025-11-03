# Initiative: V3.0 Power Fantasy Implementation

**Status:** Proposed
**Created:** 2025-11-02
**Owner:** Development Team
**Priority:** Medium

---

## 1. Objective

To introduce "build-defining" RPG elements that dramatically alter playstyles. This initiative adds a new layer of powerful, strategic upgrades that allow players to push their train builds to the extreme (e.g., a "ramming" build vs. a "gunship" build).

---

## 2. Success Criteria

- [ ] A new "Specialized Module" slot is available for the Engine car in the Upgrade Station.
- [ ] At least three distinct modules (e.g., Life-Steal Turbine, Kinetic Plating, Overclock Engine) are implemented and functional.
- [ ] The game logic correctly applies the powerful, build-altering effects of these modules.
- [ ] The weapon AI can be upgraded to use alternative targeting modes (e.g., "Target Strongest," "Target Fastest").
- [ ] The Upgrade Station UI is updated to support the purchase and equipping of Specialized Modules and AI upgrades.

---

## 3. Scope

### In Scope

- Implementation of all features as defined in the "Phase 3: Power Fantasy RPG Elements (V3.0)" section of `02_Future_Versions.md`.
- A new system for applying passive, global buffs or behavior changes to the train based on equipped modules.
- Refactoring the weapon targeting system to support different AI modes.

### Out of Scope

- Any features from the "Future Expansion Areas" document, such as new energy resources or active abilities.
- Adding new train cars or base weapon types.

---

## 4. Phases & Tasks

### Phase 1: Specialized Modules

- [ ] Create a new data structure or component system for `Specialized Modules`.
- [ ] Implement the core logic for the `Life-Steal Turbine`, `Kinetic Plating`, and `Overclock Engine` modules.
- [ ] Add the module slot to the `EngineCar` class and ensure the module's effects are applied correctly.

### Phase 2: Weapon AI Expansion

- [ ] Refactor the `TargetingSystem` to accept a targeting "strategy" (e.g., Closest, Strongest, Fastest).
- [ ] Implement the logic for the "Target Strongest" and "Target Fastest" strategies.
- [ ] Add the ability for individual `SentryGun` instances to have their targeting strategy modified.

### Phase 3: UI and Integration

- [ ] Update the `UpgradeScene` UI to add a new section for purchasing and equipping Specialized Modules.
- [ ] Add UI elements (e.g., dropdowns next to each weapon in the loadout screen) to allow players to change a weapon's targeting AI.
- [ ] Ensure the new module and AI choices are saved and loaded correctly between runs.

---

## 5. Risks and Mitigation

| Risk | Likelihood | Mitigation Strategy |
| :--- | :--- | :--- |
| The new modules are impossible to balance and break the game. | High | This is expected and part of the "Power Fantasy." The goal is to make the player feel powerful. Embrace the potential for overpowered builds, but ensure they are expensive to achieve. |
| The "Target Strongest/Fastest" logic is inefficient. | Low | The existing spatial partitioning system can be leveraged. After getting the local group of enemies, a simple sort on that small subset will be performant enough. |

---

## 6. Related Documentation

- **Game Design:** [02-future-versions.md](../../gdd/02-future-versions.md)
