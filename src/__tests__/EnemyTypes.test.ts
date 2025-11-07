import { describe, it, expect } from 'vitest';
import { ENEMY_CONFIGS, getSpawnTable, selectEnemyType } from '../config/EnemyTypes';

describe('EnemyTypes', () => {
  describe('Enemy Configs', () => {
    it('should have shambler config', () => {
      expect(ENEMY_CONFIGS.shambler).toEqual({
        type: 'shambler',
        health: 3,
        speed: -30,
        explosionRadius: 80,
        explosionDamage: 1,
        scrapDrop: 1,
        color: 0x00ff00,
      });
    });

    it('should have bloater config', () => {
      expect(ENEMY_CONFIGS.bloater).toEqual({
        type: 'bloater',
        health: 10,
        speed: -20,
        explosionRadius: 150,
        explosionDamage: 2,
        scrapDrop: 3,
        color: 0xff6600,
      });
    });

    it('should have runner config', () => {
      expect(ENEMY_CONFIGS.runner).toEqual({
        type: 'runner',
        health: 1,
        speed: -80,
        explosionRadius: 60,
        explosionDamage: 1,
        scrapDrop: 2,
        color: 0xff0000,
      });
    });
  });

  describe('Spawn Tables', () => {
    it('should return shambler only for level 1', () => {
      const table = getSpawnTable(1);
      expect(table).toEqual([{ type: 'shambler', weight: 100 }]);
    });

    it('should return mixed spawns for level 3', () => {
      const table = getSpawnTable(3);
      expect(table).toHaveLength(3);
      expect(table.find(e => e.type === 'shambler')?.weight).toBe(80);
      expect(table.find(e => e.type === 'runner')?.weight).toBe(15);
      expect(table.find(e => e.type === 'bloater')?.weight).toBe(5);
    });

    it('should cap at level 5 table for higher levels', () => {
      const table5 = getSpawnTable(5);
      const table10 = getSpawnTable(10);
      expect(table10).toEqual(table5);
    });
  });

  describe('Enemy Selection', () => {
    it('should always return shambler for level 1', () => {
      for (let i = 0; i < 10; i++) {
        expect(selectEnemyType(1)).toBe('shambler');
      }
    });

    it('should return valid enemy types for level 5', () => {
      const types = new Set<string>();
      for (let i = 0; i < 100; i++) {
        types.add(selectEnemyType(5));
      }
      expect(types.size).toBeGreaterThan(1);
      types.forEach(type => {
        expect(['shambler', 'bloater', 'runner']).toContain(type);
      });
    });
  });
});
