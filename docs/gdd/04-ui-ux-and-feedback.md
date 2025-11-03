# 04: UI/UX and Player Feedback

This document details the user interface layout, wireframe concepts, and the critical "juice" elements required to make the game feel satisfying to watch.

## Wireframe Generation & UI/UX "Feel"

| Screen Name | Key Elements to Sketch | UI/UX Focus |
| :--- | :--- | :--- |
| **Game View (Main HUD)** | 1. **Train:** Center-left.  2. **World:** Parallax backgrounds.  3. **Zombies:** Hordes from the right.  4. **HUD:** **Top-Center** (`HP` Bar, `Distance`, `Scrap`). **Bottom-Center** (Large `Speedometer`). | "Is the `Speedometer` the most exciting element? Can I tell my `HP` and `Distance` at a glance?" |
| **Upgrade/Station Screen** | 1. **Train Schematic:** Left panel. Shows `[Engine]-[Car]-[Car]`.  2. **Upgrade Menu:** Right panel. Tabbed: "Core Stats" (`HP`, `Speed`), "Train Cars" (`Add Gun Car`), "Weapons" (`Buy Gatling`).  3. **Context:** Barbed wire, guards, and "Safe Zone" art. | "Is the cost/benefit of `Max Speed` vs. `Weapon Damage` clear? Is it 3 clicks or less to buy and equip an item?" |
| **Car/Weapon Loadout** | *(Tab in the Station Screen)*  1. **Train Schematic:** Shows `Hardpoint` slots.  2. **Inventory:** Available `Gatling`, `Cannon` icons.  3. **Interaction:** Drag-and-drop a weapon icon onto a `Hardpoint` slot. | "Does the player immediately understand *where* the gun goes and *how* to swap it?" |

## Key Player Feedback ("The Juice")

"Feel" is critical since the player is watching.

* **Collision Feedback:**
  * **Visual:** `Shambler` explodes in a `SPLAT`. Screen *lurches* (quick shake). The `Speedometer` number flashes red.
  * **Audio:** Loud "SQUISH" or "CRUNCH."
* **Weapon Fire Feedback:**
  * **Visual:** Muzzle flash, shell casing particle effect, and a bright `Tracer` that streaks to the target. A "hit" particle effect.
  * **Audio:** Punchy, satisfying "THUD" (Cannon) or "RATATAT" (Gatling).
* **Enemy Death (AOE):**
  * **Visual:** The `Shambler` explodes, and a clear visual `AOE` circle (e.g., a "dust" ring) expands. If it hits the train, a "DAMAGE!" number flashes on the train.
  * **Audio:** A "BOOM" or "SPLAT."
* **Health Feedback:**
  * **Visual:** When the train is hit, the `HP` bar flashes, and the screen vignettes red for a split second.
  * **Audio:** A "metallic stress" groan.
