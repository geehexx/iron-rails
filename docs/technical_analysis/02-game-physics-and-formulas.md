# 02: Game Physics and Formula Analysis

This document analyzes the mathematical formulas that govern core game physics, focusing on stability, tunability, and "game feel."

---

## Slowdown Formula Analysis

The physical interaction between the massive train and the hordes of zombies is a critical component of the game's feel. The formula governing this interaction must be stable and easy to balance.

### Original GDD Formula

The initially proposed formula for calculating the amount of speed lost upon ramming a zombie was:

`SlowdownAmount = EnemyHP / (CurrentSpeed * TrainMass)`

### Mathematical Stability Analysis

This formula presents a significant stability risk:

1.  **Behavior at High Speed:** As `CurrentSpeed` increases, the denominator becomes very large, causing the `SlowdownAmount` to approach zero. This is the **desired behavior**. A train at high speed should feel powerful and largely unaffected by ramming small enemies.
2.  **Behavior at Low Speed:** As `CurrentSpeed` approaches `0`, the denominator also approaches `0`. In mathematics, this causes the result to spike towards **infinity**. In the game, this would manifest as a catastrophic and sudden drop in speed the moment the train hits an enemy at a very low speed. This would make recovering from a "near-stall" state feel impossible and likely be perceived by players as a bug.

### Recommended Alternative Formulas

To ensure a stable and enjoyable gameplay experience, we should adopt a formula that is not susceptible to this division-by-zero issue.

#### **Recommendation 1: Inelastic Collision & Momentum Transfer (Physics-Based)**

This is the **strongly recommended** approach. It is based on the physics principle of momentum (`p = mv`) and provides a much more stable and intuitive model.

**Proposed Formula:**

`NewSpeed = CurrentSpeed - (CollisionImpact / TrainMass)`

-   **`CollisionImpact`**: This is a new, tunable stat that can be defined per enemy. It represents the "oomph" of an enemy's resistance. For example, a basic `Shambler` might have a `CollisionImpact` of `0.5`, while a massive `Tank` zombie might have a `CollisionImpact` of `5.0`.
-   **How it Works:** Each zombie collision subtracts a flat amount of speed. This speed loss is reduced by the train's `TrainMass` (which can be an upgradeable stat).
-   **Benefits:**
    -   **Mathematically Stable:** This formula is completely stable at all speeds.
    -   **Highly Tunable:** Game balance is now a matter of tweaking the `CollisionImpact` values for enemies and the `TrainMass` values for the train. This is much more direct and predictable.
    -   **Intuitive:** It makes inherent physical sense: heavier trains are harder to stop, and bigger enemies slow you down more.

#### **Recommendation 2: Capped Speed Calculation (Simple Fix)**

If we must retain the original formula's structure, it can be made safe by "capping" the speed value used in the calculation.

**Proposed Formula:**

`EffectiveSpeed = max(CurrentSpeed, 1.0)`
`SlowdownAmount = EnemyHP / (EffectiveSpeed * TrainMass)`

-   **How it Works:** The train's actual speed can still drop to zero, but for the purpose of this *specific calculation*, we never let the speed value in the denominator fall below a small number like `1.0`.
-   **Benefits:**
    -   Prevents the division-by-zero error.
-   **Drawbacks:**
    -   Can lead to an inconsistent "feel." The slowdown effect will scale normally until the train's speed drops below `1.0`, at which point the slowdown amount will suddenly stop increasing. This discontinuity may feel unnatural to players.

### Final Recommendation

Adopt the **Inelastic Collision & Momentum Transfer** model. It provides the most stable, tunable, and intuitive results, which is critical for a core mechanic that so heavily influences the game's feel.
