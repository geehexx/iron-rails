# Agent Instructions for the Iron Rails Project

Welcome, agent. This document provides the high-level guidelines for working on the Iron Rails codebase. Your primary goal is to follow these instructions to ensure consistency and quality.

## Guiding Principles

1. **Documentation First:** The `/docs` directory is the single source of truth for this project. Before starting any implementation task, you must read the relevant Game Design Document (GDD), Technical Analysis, and Initiative files.
2. **Follow the Plan:** All significant work is defined in an **Initiative** located in `/docs/initiatives/active/`. You must find the relevant initiative and follow the tasks outlined within it. Do not work on tasks not described in an active initiative.
3. **Record Key Decisions:** For any significant technical decision that is not already documented, you **must** create an Architectural Decision Record (ADR).
    - Use the template located at `/docs/adr/template.md`.
    - Place new ADRs in the `/docs/adr/` directory.
    - A "significant decision" is anything that has a notable impact on the project's architecture, technology stack, or core logic. Examples include choosing a new library, defining a core data structure, or establishing a new performance optimization pattern.

## Code Formatting and Linting

This project uses `markdownlint-cli2` to enforce a consistent style across all Markdown files. The linter is configured to run automatically as a pre-commit hook, so you don't have to worry about running it manually.

## Pull Request Guidelines

When working on pull requests:

1. **Address All Review Comments**: Systematically work through all review comments from automated tools (CodeRabbit, qodo-merge-pro) and human reviewers.
2. **Respond to Reviewers**: Add comments on the PR to acknowledge which suggestions were implemented, which were declined (with rationale), and any alternative approaches taken.
3. **Validate Suggestions**: Don't blindly apply suggestions. Consider:
   - Does this align with our architecture decisions in `/docs/adr/`?
   - Does this improve code quality without over-engineering?
   - Are there performance implications?
4. **Test Changes**: Run `npm run lint`, `npm run build`, and `npm run test` locally before pushing.
5. **Update Documentation**: If implementation differs from review suggestions, update relevant ADRs or technical docs to reflect the final decision.

## Core Documentation Structure

- **/docs/gdd/**: The Game Design Document. This is **what** we are building.
- **/docs/technical_analysis/**: In-depth research and technical recommendations. This is **how** we should build it, based on research.
- **/docs/initiatives/**: Actionable, step-by-step plans for implementation. This is the **development roadmap**.
- **/docs/adr/**: The immutable record of our key architectural decisions. This is **why** we build it the way we do.

Your adherence to this structured approach is critical for the success of the project.
