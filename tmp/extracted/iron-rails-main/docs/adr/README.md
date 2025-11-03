# Architecture Decision Records (ADRs)

This directory contains Architecture Decision Records for the Iron Rails project.

## What is an ADR?

An Architecture Decision Record (ADR) is a short document that captures an important architectural decision, along with its context and consequences. We use them to document our key technical decisions and create a historical record of the project's evolution.

## Format

We use a simplified format based on Michael Nygard's ADR template. See [template.md](template.md) for the structure.

## Naming Convention

ADRs are numbered sequentially and named descriptively: `NNNN-descriptive-title.md`.

- `0001-use-phaser-vite-vitest-stack.md`
- `0002-adopt-initiative-and-adr-documentation.md`

## ADR Lifecycle

1. **Proposed:** The ADR is written and submitted for review.
2. **Accepted:** The decision is agreed upon and is ready to be implemented.
3. **Implemented:** The decision has been put into practice in the codebase.
4. **Superseded:** A newer ADR has replaced this one.

## Creating a New ADR

1. Copy `template.md` to a new file: `docs/adr/NNNN-title.md`.
2. Fill in the sections.
3. Submit it for review.

## ADR Index

(This index should be updated manually as new ADRs are added)

- [ADR-0001: Use Phaser, Vite, and Vitest Tech Stack](./0001-use-phaser-vite-vitest-stack.md)
- [ADR-0002: Adopt Initiative and ADR Documentation Standards](./0002-adopt-initiative-and-adr-documentation.md)
- [ADR-0003: Use Spatial Partitioning for Targeting](./0003-use-spatial-partitioning-for-targeting.md)
