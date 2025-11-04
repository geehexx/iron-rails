/**
 * GameState manager - Handles player progression, currency, and upgrades
 * Persists data to localStorage between sessions
 */

export interface PlayerUpgrades {
  maxHp: number;
  armor: number;         // Percentage damage reduction (0.0 - 1.0)
  regen: number;         // HP per second
  maxSpeed: number;      // Multiplier for max speed
  acceleration: number;  // Multiplier for acceleration
}

export interface GameStateData {
  scrap: number;
  upgrades: PlayerUpgrades;
  currentLevel: number;  // Which level/run the player is on
  totalEnemiesKilled: number;
  totalDistanceTraveled: number;
}

const DEFAULT_STATE: GameStateData = {
  scrap: 0,
  upgrades: {
    maxHp: 0,
    armor: 0,
    regen: 0,
    maxSpeed: 0,
    acceleration: 0
  },
  currentLevel: 1,
  totalEnemiesKilled: 0,
  totalDistanceTraveled: 0
};

const STORAGE_KEY = 'iron-rails-save';
const SAVE_VERSION = 1;

export class GameState {
  private data: GameStateData;

  constructor() {
    this.data = this.load();
  }

  /**
   * Load state from localStorage
   */
  private load(): GameStateData {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        return {
          ...DEFAULT_STATE,
          upgrades: { ...DEFAULT_STATE.upgrades }
        };
      }

      const parsed = JSON.parse(saved);
      if (parsed.version !== SAVE_VERSION) {
        console.warn('Save version mismatch, using defaults');
        return {
          ...DEFAULT_STATE,
          upgrades: { ...DEFAULT_STATE.upgrades }
        };
      }

      return parsed.data;
    } catch (error) {
      console.error('Failed to load game state:', error);
      return {
        ...DEFAULT_STATE,
        upgrades: { ...DEFAULT_STATE.upgrades }
      };
    }
  }

  /**
   * Save state to localStorage
   */
  save(): void {
    try {
      const saveData = {
        version: SAVE_VERSION,
        timestamp: Date.now(),
        data: this.data
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
    } catch (error) {
      console.error('Failed to save game state:', error);
    }
  }

  /**
   * Reset all progress
   */
  reset(): void {
    this.data = {
      ...DEFAULT_STATE,
      upgrades: { ...DEFAULT_STATE.upgrades }
    };
    this.save();
  }

  // Getters
  getScrap(): number {
    return this.data.scrap;
  }

  getUpgrades(): PlayerUpgrades {
    return { ...this.data.upgrades };
  }

  getCurrentLevel(): number {
    return this.data.currentLevel;
  }

  getTotalEnemiesKilled(): number {
    return this.data.totalEnemiesKilled;
  }

  getTotalDistanceTraveled(): number {
    return this.data.totalDistanceTraveled;
  }

  // Setters
  addScrap(amount: number): void {
    this.data.scrap += amount;
  }

  spendScrap(amount: number): boolean {
    if (this.data.scrap >= amount) {
      this.data.scrap -= amount;
      return true;
    }
    return false;
  }

  purchaseUpgrade(type: keyof PlayerUpgrades, amount: number, cost: number): boolean {
    if (this.data.scrap < cost) return false;
    this.data.scrap -= cost;
    this.data.upgrades[type] += amount;
    this.save();
    return true;
  }

  incrementLevel(): void {
    this.data.currentLevel++;
    this.save();
  }

  addEnemiesKilled(count: number): void {
    this.data.totalEnemiesKilled += count;
  }

  addDistanceTraveled(distance: number): void {
    this.data.totalDistanceTraveled += distance;
  }

  /**
   * Calculate distance to next station based on current level
   * Distance scales: 5km, 7km, 9km, 12km, 15km, etc.
   */
  getTargetDistance(): number {
    const baseDistance = 5000; // 5km
    const level = this.data.currentLevel;
    
    if (level === 1) return baseDistance;
    if (level === 2) return 7000;
    if (level === 3) return 9000;
    
    // After level 3, add 3km per level
    return 9000 + (level - 3) * 3000;
  }
}
