# Iron Rails

Iron Rails is a 2D side-scrolling auto-battler web game where you manage a steampunk train fighting through a zombie apocalypse.

## Current Version: V1.5

### Core Features

- **Automatic Combat**: Train auto-fires at nearby enemies
- **Economy System**: Collect scrap from defeated enemies
- **Upgrade Station**: Spend scrap on permanent upgrades between runs
- **Progressive Difficulty**: Distance to next station increases each level
- **Quality of Life**:
  - Pause/Resume (P key)
  - Game Speed Controls (+ / - keys for 1x, 2x)
  - Event Notifications
  - Train Physics with acceleration
  - Health Regeneration

### Available Upgrades

- **Max HP**: Increase maximum health
- **Armor Plating**: Reduce damage taken
- **Repair System**: Regenerate HP over time
- **Max Speed**: Increase top speed
- **Acceleration**: Faster speed recovery

## Development Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/geehexx/iron-rails.git
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the game:**

   ```bash
   npm run dev    # Start dev server at localhost:5173
   npm test       # Run unit tests
   npm run build  # Production build
   ```

## Game Controls

- **P**: Pause/Resume
- **+/=**: Increase game speed
- **-**: Decrease game speed

## Project Structure

```text
src/
├── components/      # Data-only component interfaces
├── ecs/            # Entity-Component-System core
├── scenes/         # Phaser game scenes
├── state/          # Game state management & persistence
├── systems/        # Game logic processors
└── __tests__/      # Unit tests
```

See [docs/run-dev.md](./docs/run-dev.md) for detailed development instructions.
