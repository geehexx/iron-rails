import { describe, it, expect } from 'vitest';
import { SpatialGrid } from '../../src/systems/SpatialGrid';

describe('SpatialGrid', () => {
  it('inserts and queries entities within radius', () => {
    const grid = new SpatialGrid(50);
    grid.insert(1, 100, 100);
    grid.insert(2, 120, 100);
    grid.insert(3, 500, 500);
    
    const results = grid.queryRadius(100, 100, 50);
    expect(results).toContain(1);
    expect(results).toContain(2);
    expect(results).not.toContain(3);
  });

  it('removes entities correctly', () => {
    const grid = new SpatialGrid(50);
    grid.insert(1, 100, 100);
    grid.remove(1);
    expect(grid.queryRadius(100, 100, 50)).toHaveLength(0);
  });
});
