import { describe, it, expect } from 'vitest';
import { 
  UPGRADES, 
  calculateUpgradeCost, 
  getUpgradeDisplayValue 
} from '../../src/state/UpgradeDefinitions';

describe('UpgradeDefinitions', () => {
  describe('calculateUpgradeCost', () => {
    it('should calculate base cost at level 0', () => {
      const config = UPGRADES['maxHp'];
      expect(config).toBeDefined();
      if (!config) return;
      const cost = calculateUpgradeCost(config, 0);
      expect(cost).toBe(config.baseCost);
    });

    it('should calculate exponential cost growth', () => {
      const config = UPGRADES['maxHp'];
      expect(config).toBeDefined();
      if (!config) return;
      const cost1 = calculateUpgradeCost(config, 1);
      const cost2 = calculateUpgradeCost(config, 2);
      
      expect(cost1).toBeGreaterThan(config.baseCost);
      expect(cost2).toBeGreaterThan(cost1);
      expect(cost1).toBe(Math.floor(config.baseCost * config.costGrowth));
    });

    it('should return integer costs', () => {
      const config = UPGRADES['armor'];
      expect(config).toBeDefined();
      if (!config) return;
      for (let level = 0; level < 5; level++) {
        const cost = calculateUpgradeCost(config, level);
        expect(cost).toBe(Math.floor(cost));
      }
    });
  });

  describe('getUpgradeDisplayValue', () => {
    it('should format maxHp correctly', () => {
      const config = UPGRADES['maxHp'];
      expect(config).toBeDefined();
      if (!config) return;
      expect(getUpgradeDisplayValue(config, 0)).toBe('+0 HP');
      expect(getUpgradeDisplayValue(config, 5)).toBe('+10 HP');
    });

    it('should format armor as percentage', () => {
      const config = UPGRADES['armor'];
      expect(config).toBeDefined();
      if (!config) return;
      expect(getUpgradeDisplayValue(config, 0)).toBe('0% Reduction');
      expect(getUpgradeDisplayValue(config, 2)).toBe('10% Reduction');
    });

    it('should format regen with decimals', () => {
      const config = UPGRADES['regen'];
      expect(config).toBeDefined();
      if (!config) return;
      expect(getUpgradeDisplayValue(config, 0)).toBe('+0.0 HP/sec');
      expect(getUpgradeDisplayValue(config, 5)).toBe('+0.5 HP/sec');
    });

    it('should format speed multipliers as percentages', () => {
      const config = UPGRADES['maxSpeed'];
      expect(config).toBeDefined();
      if (!config) return;
      expect(getUpgradeDisplayValue(config, 0)).toBe('+0% Speed');
      expect(getUpgradeDisplayValue(config, 3)).toBe('+30% Speed');
    });
  });

  describe('Upgrade Configurations', () => {
    it('should have valid base costs', () => {
      Object.values(UPGRADES).forEach(config => {
        expect(config.baseCost).toBeGreaterThan(0);
      });
    });

    it('should have positive cost growth', () => {
      Object.values(UPGRADES).forEach(config => {
        expect(config.costGrowth).toBeGreaterThan(1.0);
      });
    });

    it('should have positive effect per level', () => {
      Object.values(UPGRADES).forEach(config => {
        expect(config.effectPerLevel).toBeGreaterThan(0);
      });
    });

    it('should have reasonable max levels', () => {
      Object.values(UPGRADES).forEach(config => {
        expect(config.maxLevel).toBeGreaterThan(0);
        expect(config.maxLevel).toBeLessThanOrEqual(30);
      });
    });
  });
});
