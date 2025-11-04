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
| **Collision Physics (Ramming)** | 1. **Train-to-Zombie Collision:** When the train rams a `Shambler`, the `Shambler` is instantly killed. 2. **Slowdown Mechanic:** Ramming a `Shambler` slows the train. Formula: `SlowdownAmount = EnemyHP / (CurrentSpeed × TrainMass)`. Example: `HP: 1`, `Speed: 50`, `Mass: 1` gives `Slowdown = 0.02`, so speed becomes `49.98 km/h`. This is small, but 100 zombies will have massive effect. 3. **Game Over:** No hard "Game Over" at `0 km/h`, but it should be an *unrecoverable* state as the train will be swarmed and destroyed. |
| **Enemy Damage** | **AOE on Death.** Zombies do **not** damage train on contact. When a `Shambler` dies (from any source: ramming or weapon), it explodes in a simple circle radius AOE. If the `Train` is within AOE, it takes **1 HP** flat damage. Note: Zombie explosions do not damage other zombies (for performance/simplicity). |
| **The Weapon** | **"Default Sentry Gun"**: Single turret on the Engine. **Behavior:** Full Auto-Fire with no player input. **Targeting:** Automatically targets the closest `Shambler` within Range. **Fire Rate:** 1.0 seconds. **Projectile:** Hit-scan tracer (not full physics object for web performance). Visual: tracer line/sprite from gun to target. Logic: on-fire, instantly deal damage (or after 0.1s travel delay). |
| **The Environment** | **"The Wasteland" Biome**: 2D side-scrolling, zombie apocalypse theme.  **Procedural Gen:** Flat, chunk-based track. Chunks include "Ruined city," "Barren fields," "Old highway."  **Art:** 2-3 parallax layers (sky, distant ruins, foreground rubble). |
| **The Enemy** | **"The Shambler"**: A basic zombie.  **Behavior:** Spawns off-screen, moves slowly toward the train track.  **Stats:** `HP: 1`.  **OnDeath:** `Explode(Damage: 1, Radius: 10 units)`.  **Art:** Simple "walk" animation. ~3-5 visual variants. |
| **The HUD (UI)** | **Web-Centric Layout.** All HUD elements anchored to center of viewport. **Top-Center:** HP Bar (e.g., 10 HP), Distance to Station (e.g., `3.4 / 5.0 km`), Scrap Total. **Bottom-Center:** Large, clear Speedometer (`km/h`). |
| **Goal / Win State** | **Reach the Station.** The V1.0 game ends when $\text{HP}$ reaches `0` or the train successfully reaches the `Station` chunk (e.g., at `5.0 km`). |
