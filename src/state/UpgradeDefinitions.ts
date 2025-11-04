/**
 * Upgrade definitions and balancing constants
 */

import { PlayerUpgrades } from './GameState';

export interface UpgradeConfig {
  name: string;
  description: string;
  baseCost: number;
  costGrowth: number;  // Multiplier per level
  effectPerLevel: number;
  maxLevel: number;
  statKey: keyof PlayerUpgrades;
  format: (value: number) => string;
}

export const UPGRADES: Record<string, UpgradeConfig> = {
  maxHp: {
    name: 'Max HP',
    description: 'Increases maximum health',
    baseCost: 10,
    costGrowth: 1.5,
    effectPerLevel: 2,
    maxLevel: 20,
    statKey: 'maxHp',
    format: (value) => `+${value} HP`
  },
  armor: {
    name: 'Armor Plating',
    description: 'Reduces all damage taken',
    baseCost: 15,
    costGrowth: 1.8,
    effectPerLevel: 0.05,
    maxLevel: 10,
    statKey: 'armor',
    format: (value) => `${(value * 100).toFixed(0)}% Reduction`
  },
  regen: {
    name: 'Repair System',
    description: 'Regenerates HP over time',
    baseCost: 20,
    costGrowth: 2.0,
    effectPerLevel: 0.1,
    maxLevel: 10,
    statKey: 'regen',
    format: (value) => `+${value.toFixed(1)} HP/sec`
  },
  maxSpeed: {
    name: 'Max Speed',
    description: 'Increases top speed',
    baseCost: 12,
    costGrowth: 1.6,
    effectPerLevel: 0.1,
    maxLevel: 15,
    statKey: 'maxSpeed',
    format: (value) => `+${(value * 100).toFixed(0)}% Speed`
  },
  acceleration: {
    name: 'Acceleration',
    description: 'Faster speed recovery',
    baseCost: 12,
    costGrowth: 1.6,
    effectPerLevel: 0.1,
    maxLevel: 15,
    statKey: 'acceleration',
    format: (value) => `+${(value * 100).toFixed(0)}% Accel`
  }
};

/**
 * Calculate cost for next level of an upgrade
 */
export function calculateUpgradeCost(
  config: UpgradeConfig,
  currentLevel: number
): number {
  return Math.floor(config.baseCost * Math.pow(config.costGrowth, currentLevel));
}

/**
 * Get display value for current upgrade level
 */
export function getUpgradeDisplayValue(
  config: UpgradeConfig,
  currentLevel: number
): string {
  const totalValue = config.effectPerLevel * currentLevel;
  return config.format(totalValue);
}
