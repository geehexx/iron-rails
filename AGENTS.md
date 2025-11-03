# Agent Instructions for the Iron Rails Project

Welcome, agent. This document provides the high-level guidelines for working on the Iron Rails codebase. Your primary goal is to follow these instructions to ensure consistency and quality.

## Guiding Principles

1.  **Documentation First:** The `/docs` directory is the single source of truth for this project. Before starting any implementation task, you must read the relevant Game Design Document (GDD), Technical Analysis, and Initiative files.
2.  **Follow the Plan:** All significant work is defined in an **Initiative** located in `/docs/initiatives/active/`. You must find the relevant initiative and follow the tasks outlined within it. Do not work on tasks not described in an active initiative.
3.  **Record Key Decisions:** For any significant technical decision that is not already documented, you **must** create an Architectural Decision Record (ADR).
    -   Use the template located at `/docs/adr/template.md`.
    -   Place new ADRs in the `/docs/adr/` directory.
    -   A "significant decision" is anything that has a notable impact on the project's architecture, technology stack, or core logic. Examples include choosing a new library, defining a core data structure, or establishing a new performance optimization pattern.

## Core Documentation Structure

-   **/docs/gdd/**: The Game Design Document. This is **what** we are building.
-   **/docs/technical_analysis/**: In-depth research and technical recommendations. This is **how** we should build it, based on research.
-   **/docs/initiatives/**: Actionable, step-by-step plans for implementation. This is the **development roadmap**.
-   **/docs/adr/**: The immutable record of our key architectural decisions. This is **why** we build it the way we do.

Your adherence to this structured approach is critical for the success of the project.
