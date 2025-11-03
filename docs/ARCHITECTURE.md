# Architecture Overview

Layers:
- ECS (bitecs) - data-only components and systems
- Spatial partitioning - grid/quadtree service for queries
- Pools - object pools for bullets, particles, enemies
- Render adapters - map ECS state to Phaser sprites
- Resource loader - atlas, audio, fonts

Placement:
- src/ecs/*
- src/systems/*
- src/render/*
- src/resources/*

Performance budgets and measurement hooks must be documented in PERFORMANCE.md
