import { describe, it, expect } from 'vitest';
import GameScene from './GameScene';

describe('GameScene', () => {
  it('should construct without throwing', () => {
    expect(() => new GameScene()).not.toThrow();
  });
});
