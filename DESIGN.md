# Iron Rails: A Zombie Survival Game
### **Game Design Document (V1.0)**

**Core Genre:** 2D Side-Scrolling Auto-Battler, Endless Runner, RPG-Lite
**Platform:** Web Browser (HTML5)
**Core Concept:** The player manages a heavily armored, steampunk train designed to survive a zombie apocalypse. The train moves and fights automatically. The player's agency comes from making strategic upgrade choices at fortified stations to optimize the train's performance, build, and survivability against increasingly massive hordes of the undead.
**Guiding Design Pillars:**
1.  **Perpetual Momentum:** The train is an unstoppable force, always pushing forward. Its speed is a resource to be managed, not directly controlled. Hitting zombies will slow it, threatening a complete stop—and doom.
2.  **The Strategic Engineer:** The player is the "mind" of the train. The game is not won by reflexes, but by smart, predictive build design (e.g., "Do I need more speed, or more guns to *maintain* my speed?").
3.  **Escalating Scale:** The game starts with one gun and a few zombies. It must scale to a screen-filling spectacle of auto-cannons, explosions, and hundreds of enemies, all while maintaining web performance.

---

## I. The Core Loop (V1.0 Actionable Prototype)

This initial iteration focuses *exclusively* on establishing the automatic "Run → Fight → Survive" loop. The only player interaction is clicking "Start." The goal is to validate the auto-combat and physics feel engaging to *watch* before adding the upgrade layer.

### **V1.0 Technical & Design Specification**

| Component | V1.0 Definition (Actionable Spec) |
| :--- | :--- |
| **The Train** | **"The Engine"**: A single, armored train car. <br> **Art:** Heavy, jury-rigged "zombie apocalypse" armor. <br> **Physics:** A single object with a normalized `Mass = 1`. |
| **Player Controls** | **None.** During the run, the game is a "zero-player" auto-battler. The player is a spectator. All player agency will be added in V1.5 at the "Upgrade Station" screen. |
| **Speed/Momentum** | **Automatic.** The train starts at `0 km/h` at a "Station". <br> **Acceleration:** It automatically accelerates towards a `MaxSpeed` (e.g., 50 km/h for V1.0). <br> **Deceleration:** It *only* decelerates when approaching the next designated "Station" or when hitting zombies. |
| **Collision Physics (Ramming)** | 1. **Train-to-Zombie Collision:** When the train rams a `Shambler`, the `Shambler` is instantly killed. <br> 2. **Slowdown Mechanic:** Ramming a `Shambler` slows the train. <br> $$\text{SlowdownAmount} = \frac{\text{EnemyHP}}{(\text{CurrentSpeed} \times \text{TrainMass})}$$ <br> *Example:* `HP: 1`, `Speed: 50`, `Mass: 1`. `Slowdown = 1 / (50 * 1) = 0.02`. The speed becomes `49.98 km/h`. This is small, but 100 zombies will have a massive effect. <br> 3. **Game Over:** There is no hard "Game Over" at `0 km/h`, but it should be an *unrecoverable* state, as the train will be swarmed and destroyed. |
| **Enemy Damage** | **AOE on Death.** Zombies do **not** damage the train on contact. <br> 1. When a `Shambler` dies (from *any* source: ramming or weapon), it instantly explodes. <br> 2. This explosion is a simple `AOE` (e.g., circle radius check). <br> 3. If the `Train` is within the `AOE`, it takes **1 $\text{HP}$** (flat damage). <br> 4. *Note:* Zombie explosions do not damage other zombies (for performance/simplicity). |
| **The Weapon** | **"Default Sentry Gun"**: A single turret on the Engine. <br> **Behavior:** **Full Auto-Fire.** No player input. <br> **Targeting:** Automatically targets the **closest** `Shambler` within its `Range`. <br> **Fire Rate:** 1.0 seconds. <br> **Projectile:** **Hit-scan / Tracer.** For web performance, this is not a full physics object. <br> *Visual:* A "tracer" line/sprite fires from the gun to the target. <br> *Logic:* On-fire, instantly deal damage (or after a 0.1s "travel" delay). |
| **The Environment** | **"The Wasteland" Biome**: 2D side-scrolling, zombie apocalypse theme. <br> **Procedural Gen:** Flat, chunk-based track. Chunks include "Ruined city," "Barren fields," "Old highway." <br> **Art:** 2-3 parallax layers (sky, distant ruins, foreground rubble). |
| **The Enemy** | **"The Shambler"**: A basic zombie. <br> **Behavior:** Spawns off-screen, moves slowly toward the train track. <br> **Stats:** `HP: 1`. <br> **OnDeath:** `Explode(Damage: 1, Radius: 10 units)`. <br> **Art:** Simple "walk" animation. ~3-5 visual variants. |
| **The HUD (UI)** | **Web-Centric Layout.** All HUD elements are anchored to the *center* of the game viewport. <br> 1. **Top-Center:** **$\text{HP}$ Bar** (e.g., 10 $\text{HP}$), **Distance to Station** (e.g., `3.4 / 5.0 km`), **Scrap Total**. <br> 2. **Bottom-Center:** Large, clear **Speedometer** (`km/h`). |
| **Goal / Win State** | **Reach the Station.** The V1.0 game ends when $\text{HP}$ reaches `0` or the train successfully reaches the `Station` chunk (e.g., at `5.0 km`). |

---

## II. Iterative Expansion Plan (RPG Layering)

### Phase 1: Resource and Economy (V1.5)

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

### Phase 2: Building and Loadout (V2.0)

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

### Phase 3: Power Fantasy RPG Elements (V3.0)

This phase introduces "build-defining" items that dramatically change playstyle.

* **Specialized Modules (Engine Slot):**
    * **`Life-Steal Turbine`:** A percentage of all weapon damage dealt heals the rearmost train car.
    * **`Kinetic Plating`:** A high-tier defensive upgrade. **Ramming enemies no longer causes them to explode.** This is a *massive* survivability boost, allowing for "ramming builds."
    * **`Overclock Engine`:** Massively increases `Acceleration` and `MaxSpeed`, but reduces all weapon fire rates by 20%. (A "Speed" build vs. "Gun" build).
* **Weapon AI & Arc Expansion:** (Adds complexity back in).
    * **Targeting Modules (Upgrade):** Allows guns to be set to "Target Strongest," "Target Fastest," or "Target Closest."
    * **Firing Arcs (Upgrade):** Unlock a `Point-Defense` arc. Guns in this slot (e.g., 90° upward) will *only* target aerial enemies (V3.1+).

---

## III. Wireframe Generation & UI/UX "Feel"

| Screen Name | Key Elements to Sketch | UI/UX Focus |
| :--- | :--- | :--- |
| **Game View (Main HUD)** | 1. **Train:** Center-left. <br> 2. **World:** Parallax backgrounds. <br> 3. **Zombies:** Hordes from the right. <br> 4. **HUD:** **Top-Center** (`HP` Bar, `Distance`, `Scrap`). **Bottom-Center** (Large `Speedometer`). | "Is the `Speedometer` the most exciting element? Can I tell my `HP` and `Distance` at a glance?" |
| **Upgrade/Station Screen** | 1. **Train Schematic:** Left panel. Shows `[Engine]-[Car]-[Car]`. <br> 2. **Upgrade Menu:** Right panel. Tabbed: "Core Stats" (`HP`, `Speed`), "Train Cars" (`Add Gun Car`), "Weapons" (`Buy Gatling`). <br> 3. **Context:** Barbed wire, guards, and "Safe Zone" art. | "Is the cost/benefit of `Max Speed` vs. `Weapon Damage` clear? Is it 3 clicks or less to buy and equip an item?" |
| **Car/Weapon Loadout** | *(Tab in the Station Screen)* <br> 1. **Train Schematic:** Shows `Hardpoint` slots. <br> 2. **Inventory:** Available `Gatling`, `Cannon` icons. <br> 3. **Interaction:** Drag-and-drop a weapon icon onto a `Hardpoint` slot. | "Does the player immediately understand *where* the gun goes and *how* to swap it?" |

### Key Player Feedback ("The Juice")

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

---

## IV. Key Risks & Mitigation

1.  **Risk: Boring Gameplay Loop.**
    * **Problem:** With no player input during combat, the game might be boring. It's an "auto-battler."
    * **Mitigation:** The "game" must be 100% in the **Upgrade Screen** and the satisfying visuals and audio. The choices must be *deeply* strategic. The player's fun comes from designing a "build" and *seeing it work* (or fail) against the horde. The visual "juice" (explosions, sounds, feedback) must be high-quality.
2.  **Risk: Web Performance.**
    * **Problem:** The game scales to "massive numbers of enemies." This is *very* expensive in a web browser.
    * **Mitigation:**
        * **Sprites:** Use simple 2D sprites, not 3D models.
        * **Object Pooling:** *Crucial.* Do not `instantiate`/`destroy` zombies or projectiles. Pre-load a pool (e.g., 1000 zombies) and `enable`/`disable` them.
        * **Simple Physics:** Use hit-scan/tracers (no projectile physics). AOE checks are simple circle casts.
        * **Culling:** Aggressively remove enemies that are far off-screen.
3.  **Risk: Pacing & Balance.**
    * **Problem:** The `Slowdown` formula (`HP / (Speed * Mass)`) is sensitive. If tuned wrong, the game is either trivially easy (speed never drops) or impossibly hard (speed drops to 0 on the first wave).
    * **Mitigation:** This formula needs to be the #1 focus of playtesting. Expose all variables (`EnemyHP`, `TrainMass`, `Acceleration`) so they can be tweaked *easily* without recompiling.

## V. Future Expansion Areas

* **Weapons (Deep Dive):**
    * **Types:** Flamethrowers (cone AOE), Mortars (lobbed AOE), Railguns (piercing).
    * **Energy:** Introduce a "Power" resource generated by the Engine. Guns *consume* Power. This adds a new balance layer (`Power Generation` vs. `Power Consumption`).
* **"Special" Zombies:**
    * **`Tank`:** High HP, high mass (causes *massive* slowdown on ram).
    * **`Spitter`:** A ranged enemy that fires projectiles at the train, forcing the need for point-defense.
    * **`Shrieker`:** Does no damage, but *buffs* all other zombies (e.g., +Speed, +HP).
* **Active Abilities:**
    * To add *some* in-run agency back, the player could have 1-2 "panic buttons" that charge up.
    * **`[Steam Vent]`:** A one-time AOE blast that clears zombies near the train.
    * **`[Manual Brake]`:** (High risk) Slam on the brakes to avoid a `Tank`, but lose all speed.
* **Station Management:**
    * **Survivors:** Rescue survivors on runs to add as "Staff" at the Station, providing passive bonuses (e.g., "Engineer" = +5% `Regen`).
    * **Resource Trading:** (V4.0+) Trade `Scrap` for `Fuel`, `Food`, or `Tech` (new upgrade trees).
