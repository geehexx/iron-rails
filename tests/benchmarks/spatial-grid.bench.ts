import { bench, describe } from 'vitest';
import { SpatialGrid } from '../../src/systems/SpatialGrid';

describe('SpatialGrid Performance', () => {
  bench('insert 100 entities', () => {
    const grid = new SpatialGrid(100);
    for (let i = 0; i < 100; i++) {
      grid.insert(`entity-${i}`, Math.random() * 800, Math.random() * 600);
    }
  });

  bench('queryRadius with 100 entities', () => {
    const grid = new SpatialGrid(100);
    for (let i = 0; i < 100; i++) {
      grid.insert(`entity-${i}`, Math.random() * 800, Math.random() * 600);
    }
    grid.queryRadius(400, 300, 200);
  });

  bench('queryRadius with 150 entities (target)', () => {
    const grid = new SpatialGrid(100);
    for (let i = 0; i < 150; i++) {
      grid.insert(`entity-${i}`, Math.random() * 800, Math.random() * 600);
    }
    grid.queryRadius(400, 300, 200);
  });
});
