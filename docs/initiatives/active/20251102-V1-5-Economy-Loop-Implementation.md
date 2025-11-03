# Initiative: V1.5 Economy Loop Implementation

**Status:** Proposed
**Created:** 2025-11-02
**Owner:** Development Team
**Priority:** Medium

---

## 1. Objective

To build upon the V1.0 prototype by introducing the full "Run → Upgrade → Run" gameplay loop. This initiative will add the core economic systems, the Upgrade Station, and the first set of player-driven strategic choices.

---

## 2. Success Criteria

- [ ] Zombies drop "Scrap" currency upon death, which is collected by the player.
- [ ] A new "Upgrade Station" scene is created and is triggered upon successfully completing a run.
- [ ] A UI is implemented in the Upgrade Station that allows players to spend Scrap on a selection of core upgrades.
- [ ] The player's choices in the upgrade station are saved and persist into the next run.
- [ ] The distance to the next station increases after each successful run, making speed upgrades valuable.

---

## 3. Scope

### In Scope

-   Implementation of all features as defined in the "Phase 1: Resource and Economy (V1.5)" section of `02_Future_Versions.md`.
-   Creating a simple data persistence mechanism (e.g., using browser `localStorage`) to save player upgrades between sessions.
-   A new `UpgradeScene` in the Phaser project.
-   UI elements for displaying and purchasing upgrades.

### Out of Scope

-   Any features from V2.0 or later (new train cars, weapon specializations, etc.).
-   Complex animations or artwork for the Upgrade Station (functional UI is the priority).

---

## 4. Phases & Tasks

### Phase 1: Currency and Data

- [ ] Modify the `Zombie` class to drop a "Scrap" collectible upon death.
- [ ] Implement a system for the train to automatically collect nearby Scrap.
- [ ] Create a `PlayerData` or `GameState` manager to track currency and purchased upgrades.
- [ ] Implement saving and loading of this player data to `localStorage`.

### Phase 2: The Upgrade Station

- [ ] Create a new `UpgradeScene.ts` file and integrate it into the main scene flow.
- [ ] Build the HTML/CSS UI for the upgrade screen, layered on top of the Phaser canvas.
- [ ] Populate the UI with the initial set of core upgrades (Max HP, Armor, Regen, Max Speed, Acceleration).
- [ ] Implement the logic to allow players to purchase upgrades, deducting the cost from their Scrap total.

### Phase 3: Gameplay Loop Integration

- [ ] Apply the purchased upgrades to the `Train` object at the start of each new run.
- [ ] Implement the logic for scaling the `distanceToStation` variable after each successful run.
- [ ] Ensure the player's Scrap total is correctly updated in the main game HUD.

---

## 5. Risks and Mitigation

| Risk | Likelihood | Mitigation Strategy |
| :--- | :--- | :--- |
| Upgrade balancing is difficult. | High | Expose all upgrade costs and effects as easily tunable constants. The goal for V1.5 is a functional system, not perfect balance. Balance can be refined in a later initiative. |
| The UI is complex to build. | Medium | Keep the initial UI simple and functional. Prioritize clarity and ease of use over complex visual design. |

---

## 6. Related Documentation

-   **Game Design:** [02_Future_Versions.md](../../gdd/02_Future_Versions.md)
