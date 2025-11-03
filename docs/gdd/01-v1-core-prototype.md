# 01: V1.0 Core Prototype Specification

This initial iteration focuses *exclusively* on establishing the automatic "Run → Fight → Survive" loop.
The only player interaction is clicking "Start."
The goal is to validate the auto-combat and physics feel engaging to *watch* before adding the upgrade layer.

## V1.0 Technical & Design Specification

| Component | V1.0 Definition (Actionable Spec) |
| :--- | :--- |
| **The Train** | **"The Engine"**: A single, armored train car.  **Art:** Heavy, jury-rigged "zombie apocalypse" armor.  **Physics:** A single object with a normalized `Mass = 1`. |
| **Player Controls** | **None.** During the run, the game is a "zero-player" auto-battler. The player is a spectator. All player agency will be added in V1.5 at the "Upgrade Station" screen. |
| **Speed/Momentum** | **Automatic.** The train starts at `0 km/h` at a "Station".  **Acceleration:** It automatically accelerates towards a `MaxSpeed` (e.g., 50 km/h for V1.0).  **Deceleration:** It *only* decelerates when approaching the next designated "Station" or when hitting zombies. |
| **Collision Physics (Ramming)** | 1. **Train-to-Zombie Collision:** When the train rams a `Shambler`, the `Shambler` is instantly killed.  2. **Slowdown Mechanic:** Ramming a `Shambler` slows the train.  $$\text{SlowdownAmount} = \frac{\text{EnemyHP}}{(\text{CurrentSpeed} \times \text{TrainMass})}$$  *Example:* `HP: 1`, `Speed: 50`, `Mass: 1`. `Slowdown = 1 / (50 * 1) = 0.02`. The speed becomes `49.98 km/h`. This is small, but 100 zombies will have a massive effect.  3. **Game Over:** There is no hard "Game Over" at `0 km/h`, but it should be an *unrecoverable* state, as the train will be swarmed and destroyed. |
| **Enemy Damage** | **AOE on Death.** Zombies do **not** damage the train on contact.  1. When a `Shambler` dies (from *any* source: ramming or weapon), it instantly explodes.  2. This explosion is a simple `AOE` (e.g., circle radius check).  3. If the `Train` is within the `AOE`, it takes **1 $\text{HP}$** (flat damage).  4. *Note:* Zombie explosions do not damage other zombies (for performance/simplicity). |
| **The Weapon** | **"Default Sentry Gun"**: A single turret on the Engine.  **Behavior:** **Full Auto-Fire.** No player input.  **Targeting:** Automatically targets the **closest** `Shambler` within its `Range`.  **Fire Rate:** 1.0 seconds.  **Projectile:** **Hit-scan / Tracer.** For web performance, this is not a full physics object.  *Visual:* A "tracer" line/sprite fires from the gun to the target.  *Logic:* On-fire, instantly deal damage (or after a 0.1s "travel" delay). |
| **The Environment** | **"The Wasteland" Biome**: 2D side-scrolling, zombie apocalypse theme.  **Procedural Gen:** Flat, chunk-based track. Chunks include "Ruined city," "Barren fields," "Old highway."  **Art:** 2-3 parallax layers (sky, distant ruins, foreground rubble). |
| **The Enemy** | **"The Shambler"**: A basic zombie.  **Behavior:** Spawns off-screen, moves slowly toward the train track.  **Stats:** `HP: 1`.  **OnDeath:** `Explode(Damage: 1, Radius: 10 units)`.  **Art:** Simple "walk" animation. ~3-5 visual variants. |
| **The HUD (UI)** | **Web-Centric Layout.** All HUD elements are anchored to the *center* of the game viewport.  1. **Top-Center:** **$\text{HP}$ Bar** (e.g., 10 $\text{HP}$), **Distance to Station** (e.g., `3.4 / 5.0 km`), **Scrap Total**.  2. **Bottom-Center:** Large, clear **Speedometer** (`km/h`). |
| **Goal / Win State** | **Reach the Station.** The V1.0 game ends when $\text{HP}$ reaches `0` or the train successfully reaches the `Station` chunk (e.g., at `5.0 km`). |
