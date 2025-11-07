export type EnemyType = 'shambler' | 'bloater' | 'runner';

export interface EnemyConfig {
  type: EnemyType;
  health: number;
  speed: number;
  explosionRadius: number;
  explosionDamage: number;
  scrapDrop: number;
  color: number;
}

export const ENEMY_CONFIGS: Record<EnemyType, EnemyConfig> = {
  shambler: {
    type: 'shambler',
    health: 3,
    speed: -30,
    explosionRadius: 80,
    explosionDamage: 1,
    scrapDrop: 1,
    color: 0x00ff00,
  },
  bloater: {
    type: 'bloater',
    health: 10,
    speed: -20,
    explosionRadius: 150,
    explosionDamage: 2,
    scrapDrop: 3,
    color: 0xff6600,
  },
  runner: {
    type: 'runner',
    health: 1,
    speed: -80,
    explosionRadius: 60,
    explosionDamage: 1,
    scrapDrop: 2,
    color: 0xff0000,
  },
};

export interface EnemySpawnWeight {
  type: EnemyType;
  weight: number;
}

export const SPAWN_TABLES: Record<number, EnemySpawnWeight[]> = {
  1: [{ type: 'shambler', weight: 100 }],
  2: [{ type: 'shambler', weight: 100 }],
  3: [
    { type: 'shambler', weight: 80 },
    { type: 'runner', weight: 15 },
    { type: 'bloater', weight: 5 },
  ],
  4: [
    { type: 'shambler', weight: 70 },
    { type: 'runner', weight: 20 },
    { type: 'bloater', weight: 10 },
  ],
  5: [
    { type: 'shambler', weight: 60 },
    { type: 'runner', weight: 25 },
    { type: 'bloater', weight: 15 },
  ],
};

export function getSpawnTable(level: number): EnemySpawnWeight[] {
  return SPAWN_TABLES[Math.min(level, 5)] || SPAWN_TABLES[5];
}

export function selectEnemyType(level: number): EnemyType {
  const table = getSpawnTable(level);
  const totalWeight = table.reduce((sum, entry) => sum + entry.weight, 0);
  let random = Math.random() * totalWeight;

  for (const entry of table) {
    random -= entry.weight;
    if (random <= 0) {
      return entry.type;
    }
  }

  return table[0].type;
}
