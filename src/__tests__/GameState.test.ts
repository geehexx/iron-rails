import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { GameState } from '../state/GameState';

describe('GameState', () => {
  let gameState: GameState;

  beforeEach(() => {
    // Clear localStorage and create fresh instance
    localStorage.clear();
    // Remove any saved game state
    localStorage.removeItem('iron-rails-save');
    gameState = new GameState();
  });

  afterEach(() => {
    localStorage.clear();
    localStorage.removeItem('iron-rails-save');
  });

  describe('Currency Management', () => {
    it('should start with 0 scrap', () => {
      expect(gameState.getScrap()).toBe(0);
    });

    it('should add scrap correctly', () => {
      gameState.addScrap(10);
      expect(gameState.getScrap()).toBe(10);
      gameState.addScrap(5);
      expect(gameState.getScrap()).toBe(15);
    });

    it('should spend scrap when sufficient', () => {
      gameState.addScrap(20);
      const success = gameState.spendScrap(15);
      expect(success).toBe(true);
      expect(gameState.getScrap()).toBe(5);
    });

    it('should not spend scrap when insufficient', () => {
      gameState.addScrap(10);
      const success = gameState.spendScrap(15);
      expect(success).toBe(false);
      expect(gameState.getScrap()).toBe(10);
    });
  });

  describe('Upgrade Purchases', () => {
    it('should purchase upgrade when affordable', () => {
      gameState.addScrap(20);
      const success = gameState.purchaseUpgrade('maxHp', 2, 10);
      expect(success).toBe(true);
      expect(gameState.getScrap()).toBe(10);
      expect(gameState.getUpgrades().maxHp).toBe(2);
    });

    it('should not purchase upgrade when not affordable', () => {
      gameState.addScrap(5);
      const success = gameState.purchaseUpgrade('maxHp', 2, 10);
      expect(success).toBe(false);
      expect(gameState.getScrap()).toBe(5);
      expect(gameState.getUpgrades().maxHp).toBe(0);
    });

    it('should accumulate multiple upgrades', () => {
      gameState.addScrap(100);
      gameState.purchaseUpgrade('maxHp', 2, 10);
      gameState.purchaseUpgrade('maxHp', 2, 10);
      expect(gameState.getUpgrades().maxHp).toBe(4);
    });
  });

  describe('Level Progression', () => {
    it('should start at level 1', () => {
      expect(gameState.getCurrentLevel()).toBe(1);
    });

    it('should increment level', () => {
      gameState.incrementLevel();
      expect(gameState.getCurrentLevel()).toBe(2);
    });

    it('should calculate target distance correctly', () => {
      expect(gameState.getTargetDistance()).toBe(5000); // Level 1
      gameState.incrementLevel();
      expect(gameState.getTargetDistance()).toBe(7000); // Level 2
      gameState.incrementLevel();
      expect(gameState.getTargetDistance()).toBe(9000); // Level 3
      gameState.incrementLevel();
      expect(gameState.getTargetDistance()).toBe(12000); // Level 4
    });
  });

  describe('Statistics Tracking', () => {
    it('should track enemies killed', () => {
      expect(gameState.getTotalEnemiesKilled()).toBe(0);
      gameState.addEnemiesKilled(10);
      expect(gameState.getTotalEnemiesKilled()).toBe(10);
      gameState.addEnemiesKilled(5);
      expect(gameState.getTotalEnemiesKilled()).toBe(15);
    });

    it('should track distance traveled', () => {
      expect(gameState.getTotalDistanceTraveled()).toBe(0);
      gameState.addDistanceTraveled(5000);
      expect(gameState.getTotalDistanceTraveled()).toBe(5000);
      gameState.addDistanceTraveled(3000);
      expect(gameState.getTotalDistanceTraveled()).toBe(8000);
    });
  });

  describe('Persistence', () => {
    it('should save and load state', () => {
      gameState.addScrap(50);
      gameState.purchaseUpgrade('maxHp', 2, 10);
      gameState.incrementLevel();
      gameState.save();

      const newGameState = new GameState();
      expect(newGameState.getScrap()).toBe(40);
      expect(newGameState.getUpgrades().maxHp).toBe(2);
      expect(newGameState.getCurrentLevel()).toBe(2);
    });

    it('should reset all progress', () => {
      gameState.addScrap(100);
      gameState.purchaseUpgrade('maxHp', 2, 10);
      gameState.incrementLevel();
      gameState.reset();

      expect(gameState.getScrap()).toBe(0);
      expect(gameState.getUpgrades().maxHp).toBe(0);
      expect(gameState.getCurrentLevel()).toBe(1);
    });
  });
});
