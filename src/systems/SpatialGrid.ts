export class SpatialGrid {
  private cellSize: number;
  private cells: Map<string, Set<number>> = new Map();
  private entityPositions: Map<number, { x: number; y: number }> = new Map();

  constructor(cellSize: number = 100) { this.cellSize = cellSize; }

  private getKey(x: number, y: number): string {
    const cx = Math.floor(x / this.cellSize);
    const cy = Math.floor(y / this.cellSize);
    return `${cx},${cy}`;
  }

  insert(id: number, x: number, y: number): void {
    const key = this.getKey(x, y);
    if (!this.cells.has(key)) this.cells.set(key, new Set());
    this.cells.get(key)!.add(id);
    this.entityPositions.set(id, { x, y });
  }

  remove(id: number): void {
    const pos = this.entityPositions.get(id);
    if (!pos) return;
    const key = this.getKey(pos.x, pos.y);
    this.cells.get(key)?.delete(id);
    this.entityPositions.delete(id);
  }

  update(id: number, x: number, y: number): void {
    this.remove(id);
    this.insert(id, x, y);
  }

  queryRadius(x: number, y: number, radius: number): number[] {
    const results = new Set<number>();
    const cellRadius = Math.ceil(radius / this.cellSize);
    const cx = Math.floor(x / this.cellSize);
    const cy = Math.floor(y / this.cellSize);

    for (let dx = -cellRadius; dx <= cellRadius; dx++) {
      for (let dy = -cellRadius; dy <= cellRadius; dy++) {
        const key = `${cx + dx},${cy + dy}`;
        const cell = this.cells.get(key);
        if (cell) cell.forEach(id => {
          const pos = this.entityPositions.get(id)!;
          const dist = Math.hypot(pos.x - x, pos.y - y);
          if (dist <= radius) results.add(id);
        });
      }
    }
    return Array.from(results);
  }
}
