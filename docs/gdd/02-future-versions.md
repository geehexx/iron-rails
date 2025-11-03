# 02: Future Version Specifications

This document outlines the planned iterative expansions beyond the V1.0 prototype, layering in RPG elements, customization, and deeper strategic choices.

---

## Phase 1: Resource and Economy (V1.5)

This phase introduces the full "Run → Upgrade → Run" loop and player agency.

* **Currency:** Zombies drop **Scrap** (auto-magnetized to the train for simplicity).
* **The Upgrade Station:**
  * **Art:** A fortified safe zone with barbed wire, guards in towers, and large, secure gates.
  * **Logic:** The train auto-stops. Gates open, train enters, gates close. The "Upgrade Screen" appears.
  * **Progression:** This marks the end of "Level 1." The distance to the *next* station (Level 2) increases (e.g., from 5km to 7km). This scaling makes `Speed` upgrades valuable.
* **Core Upgrades:** The player spends `Scrap` on permanent upgrades.
  * **`Max HP`:** Increases total health.
  * **`Armor`:** (e.g., "Reduces all AOE damage by 10%").
  * **`Regen`:** (e.g., "+0.1 $\text{HP}$/sec").
  * **`Max Speed`:** Increases the train's target top speed.
  * **`Acceleration`:** Increases how fast the train reaches `MaxSpeed`.

---

## Phase 2: Building and Loadout (V2.0)

This phase introduces horizontal progression and train customization.

* **Train Cars:** The "Upgrade Station" now allows adding **new cars**.
  * **Cargo Car:** A passive car. Adds a large amount of `Max HP`.
  * **Gun Car:** Adds one `Hardpoint` for another auto-firing weapon.
* **Train Logic:**
  * **Damage Order:** Damage is *always* dealt to the rearmost car first, working its way forward. `[Engine]<-[GunCar]<-[CargoCar]<- (Damage)`.
  * **Build Order:** Cars can be rearranged, but `Cargo Car` types are *always* fixed to the rear of the train, as their only purpose is to be an HP buffer. `[Engine]-[GunCar]-[GunCar]-[CargoCar]` is a valid layout.
* **Weapon Specialization:** (All are auto-fire, targeting "closest").
  * **`Gatling`:** High fire rate, low damage. (Good for clearing many `Shamblers`).
  * **`Cannon`:** Low fire rate, high damage. (Good for "Special" zombies).
* **New Enemies:**
  * **`"The Bloater"`:** High HP. Explodes in a *massive* AOE.
  * **`"The Runner"`:** Low HP, but moves *very fast*. (Threatens to get in ramming/AOE range quickly).

---

## Phase 3: Power Fantasy RPG Elements (V3.0)

This phase introduces "build-defining" items that dramatically change playstyle.

* **Specialized Modules (Engine Slot):**
  * **`Life-Steal Turbine`:** A percentage of all weapon damage dealt heals the rearmost train car.
  * **`Kinetic Plating`:** A high-tier defensive upgrade. **Ramming enemies no longer causes them to explode.** This is a *massive* survivability boost, allowing for "ramming builds."
  * **`Overclock Engine`:** Massively increases `Acceleration` and `MaxSpeed`, but reduces all weapon fire rates by 20%. (A "Speed" build vs. "Gun" build).
* **Weapon AI & Arc Expansion:** (Adds complexity back in).
  * **Targeting Modules (Upgrade):** Allows guns to be set to "Target Strongest," "Target Fastest," or "Target Closest."
  * **Firing Arcs (Upgrade):** Unlock a `Point-Defense` arc. Guns in this slot (e.g., 90° upward) will *only* target aerial enemies (V3.1+).
