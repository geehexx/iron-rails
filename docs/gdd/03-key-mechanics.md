# 03: Key Mechanics

This document provides a high-level overview of the core game mechanics. For in-depth technical analysis, formulas, and implementation recommendations, please refer to the documents in the `/docs/technical_analysis` directory.

### Speed & Momentum
The train's constant forward motion and the way it interacts with enemies is a core pillar of the game. The key challenge is managing the train's speed, which is constantly under threat from zombie collisions.

*See: `docs/technical_analysis/02_Game_Physics_And_Formulas.md`*

### Combat & Targeting
The train's weapons fire automatically. The player's strategic agency comes from choosing the right weapons for the job and upgrading them appropriately. The targeting logic is a critical component of the combat system.

*See: `docs/technical_analysis/03_AI_And_Algorithms.md`*

### Progression & Pacing
The core loop of the game is "Run -> Upgrade -> Run". The player collects resources (Scrap) during runs and uses them to upgrade the train at stations. The difficulty and length of subsequent runs are scaled to create a sense of progression and challenge.
