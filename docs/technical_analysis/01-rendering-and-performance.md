# 01: Rendering & Performance Analysis

This document analyzes the core technical decisions related to rendering performance, which is a key risk for the project given its goal of displaying hundreds of sprites and effects simultaneously in a web browser.

---

## 1. Web Performance: Canvas vs. DOM

For a 2D side-scrolling game with a high entity count (enemies, particles, tracers), the choice of rendering technology is critical.
The two primary options in a web browser are standard HTML DOM manipulation and the HTML5 Canvas API.

### Standard DOM

- **How it works:** Each game entity (e.g., a zombie) is a separate HTML element (like a `<div>`) styled with CSS.
Movement is achieved by changing CSS properties (`transform`, `top`, `left`).
- **Pros:**
  - Simple to get started.
  - Easy to debug using browser developer tools.
- **Cons:**
  - **Extremely Poor Performance at Scale:** The browser's layout and rendering engine (the "reflow" and "repaint" process) is very expensive.
  Animating hundreds of individual DOM elements will quickly lead to low frame rates and a poor user experience.
  - **Not Designed for Games:** The DOM is designed for documents, not real-time, high-frequency updates.

### HTML5 Canvas

- **How it works:** The `<canvas>` element provides a single, bitmap drawing surface.
All rendering is done via a JavaScript API (e.g., `drawImage`, `fillRect`). The browser only needs to render one element.
- **Pros:**
  - **High Performance:** The Canvas API is optimized for this kind of work.
  It bypasses the expensive DOM layout engine, allowing for the efficient rendering of thousands of sprites.
  - **Full Control:** Provides pixel-level control over the rendering process.
- **Cons:**
  - More complex to manage; you are responsible for drawing everything every frame.
  - Debugging can be more difficult as you can't just "inspect" a game object.

### **Conclusion & Recommendation: Use a Rendering Library**

While the Canvas API is the correct underlying technology, writing a rendering engine from scratch is a significant undertaking.
A dedicated 2D rendering library provides a higher-level, game-oriented API while leveraging the performance of the underlying technology (typically **WebGL** with a fallback to Canvas).

For this project, **[Phaser](https://phaser.io/)** is the recommended choice.

- **Why Phaser?** It is a mature, feature-rich, "batteries-included" game framework that handles rendering, physics, input, and asset loading.
It is built for performance and is an excellent choice for rapidly developing a high-quality 2D web game, which aligns with our project goals.
It has excellent community support and is written in JavaScript, with first-class support for TypeScript.

---

## 2. Object Pooling

Object pooling is a critical performance optimization technique.
Instead of creating and destroying objects (like zombies or bullet tracers) on the fly, we pre-allocate a "pool" of them and reuse them.
This avoids the performance cost of frequent memory allocation and garbage collection.

### TypeScript Object Pooling Class Example

Here is a simple, reusable Object Pooling class written in TypeScript. It can be used to manage any type of game object.

```typescript
// A generic interface for objects that can be pooled.
// The 'reset' method is crucial for cleaning up an object's state
// before it is reused.
interface IPoolable {
    isActive: boolean;
    reset(): void;
}

// A generic ObjectPool class.
export class ObjectPool<T extends IPoolable> {
    private pool: T[] = [];
    private creator: () => T;

    /**
     * @param creator A function that creates new instances of the pooled object.
     * @param initialSize The number of objects to pre-allocate.
     */
    constructor(creator: () => T, initialSize: number = 0) {
        this.creator = creator;
        for (let i = 0; i < initialSize; i++) {
            this.pool.push(this.creator());
        }
    }

    /**
     * Retrieves an object from the pool.
     * If the pool is empty, a new object is created.
     */
    public get(): T {
        // Find the first inactive object in the pool.
        let obj = this.pool.find(o => !o.isActive);

        if (obj) {
            // If found, activate it and return it.
            obj.isActive = true;
            return obj;
        } else {
            // If no inactive objects are available, create a new one.
            // This allows the pool to grow if needed.
            const newObj = this.creator();
            newObj.isActive = true;
            this.pool.push(newObj);
            return newObj;
        }
    }

    /**
     * Releases an object back into the pool, making it available for reuse.
     * @param obj The object to release.
     */
    public release(obj: T): void {
        obj.reset(); // Reset the object's state.
        obj.isActive = false;
    }

    /**
     * Returns the total number of objects in the pool (both active and inactive).
     */
    public size(): number {
        return this.pool.length;
    }

    /**
     * Returns the number of active objects currently in use.
     */
    public activeCount(): number {
        return this.pool.filter(o => o.isActive).length;
    }
}

// --- Example Usage ---

// // 1. Define a class that implements the IPoolable interface.
// class Zombie implements IPoolable {
//     public isActive: boolean = false;
//     public health: number = 100;
//     public position: { x: number, y: number } = { x: 0, y: 0 };

//     constructor() {
//         this.reset();
//     }

//     public reset(): void {
//         this.isActive = false;
//         this.health = 100;
//         this.position = { x: -1000, y: -1000 }; // Move off-screen
//     }
// }

// // 2. Create a pool for Zombies.
// const zombiePool = new ObjectPool<Zombie>(() => new Zombie(), 100);

// // 3. Get a zombie from the pool when needed.
// const zombie1 = zombiePool.get();
// zombie1.position = { x: 100, y: 200 };

// // 4. When the zombie is "killed", release it back to the pool instead of destroying it.
// // someTimeLater...
// zombiePool.release(zombie1);
```
